<template>
  <div id="settings-modal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Settings</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <ul class="list-group mb-3">
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-10">
                      Record data that was transmitted in the HTTP body<br />
                      <small
                        >HTTP payload
                        <b>{{
                          settingsBodyFormData
                            ? "will be recorded"
                            : "won't be recorded"
                        }}</b></small
                      >
                    </div>
                    <div class="col-2">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input float-end"
                          type="checkbox"
                          role="switch"
                          @change="setSettingsBodyFormData"
                          :checked="settingsBodyFormData"
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-8">
                      Max. number of tabs opened simultaneously during a crawl
                    </div>
                    <div class="col-4">
                      <input
                        type="number"
                        class="form-control"
                        :value="settingsTabsAtOnce"
                        @blur="
                          setSetting('settingsTabsAtOnce', settingsTabsAtOnce)
                        "
                      />
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-8">
                      Time-to-live of a tab for websites that load too long
                    </div>
                    <div class="col-4">
                      <input
                        type="number"
                        class="form-control"
                        :value="settingsTabTtl"
                        @blur="setSetting('settingsTabTtl', settingsTabTtl)"
                      />
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-8">
                      Max. number of HTTP requests contained in a single chunk
                    </div>
                    <div class="col-4">
                      <input
                        type="number"
                        class="form-control"
                        :value="settingsChunkSize"
                        @blur="
                          setSetting('settingsChunkSize', settingsChunkSize)
                        "
                      />
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-8">
                      Max. number of chunks loaded at once when loading the
                      extension
                    </div>
                    <div class="col-4">
                      <input
                        type="number"
                        class="form-control"
                        :value="settingsChunksAtOnce"
                        @blur="
                          setSetting(
                            'settingsChunksAtOnce',
                            settingsChunksAtOnce
                          )
                        "
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      modalShown: false,
      settingsBodyFormData: false,
      settingsEncryption: false,
      settingsTabsAtOnce: 20,
      settingsTabTtl: 30,
      settingsChunkSize: 1500,
      settingsChunksAtOnce: 6,
      settingsKeys: [
        "settingsBodyFormData",
        "settingsTabsAtOnce",
        "settingsTabTtl",
        "settingsChunkSize",
        "settingsChunksAtOnce",
      ],
    };
  },
  props: [],
  mounted() {
    chrome.storage.local.get(this.settingsKeys, (result) => {
      this.settingsKeys.forEach((setting) => {
        this[setting] = result[setting] || this[setting];
      });
    });
  },
  methods: {
    showModal() {
      this.modalShown = true;
    },
    resetModal() {
      this.modalShown = false;
    },
    setSetting(setting, value) {
      this[setting] = value;
      let obj = {};
      obj[setting] = value;
      chrome.storage.local.set(obj, () => {
        chrome.runtime.sendMessage(obj);
      });
    },
    setSettingsBodyFormData(flag) {
      this.setSetting("settingsBodyFormData", flag);
    },
  },
};
</script>