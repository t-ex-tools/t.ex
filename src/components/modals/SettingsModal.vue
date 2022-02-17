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
                <li
                  v-for="(setting, index) in settings"
                  :key="index"
                  class="list-group-item"
                >
                  <div class="row">
                    <div class="col-8">
                      <div class="fw-bold">{{ setting.label }}</div>
                      <small>{{ setting.description }}</small>
                    </div>
                    <div class="col-4">
                      <div class="form-check form-switch">
                        <input
                          v-if="setting.type === 'checkbox'"
                          class="form-check-input float-end"
                          :name="setting.key"
                          :type="setting.type"
                          role="switch"
                          @change="set"
                          :checked="
                            values[setting.key]
                              ? values[setting.key]
                              : setting.default
                          "
                        />
                        <input
                          v-else
                          :name="setting.key"
                          type="number"
                          class="form-control"
                          :value="
                            values[setting.key]
                              ? values[setting.key]
                              : setting.default
                          "
                          @blur="set"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Exit settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      values: {},
      settings: [
        {
          key: "httpBody",
          label: "HTTP Body",
          description: "Record data that was transmitted in the HTTP body",
          type: "checkbox",
          default: false,
        },
        {
          key: "tabsAtOnce",
          label: "Tabs at once",
          description:
            "Max. number of tabs opened simultaneously during a crawl",
          type: "number",
          default: 20,
        },
        {
          key: "tabsTtl",
          label: "Tabs TTL",
          description:
            "Time-to-live of a tab for websites that load too long (in seconds)",
          type: "number",
          default: 30,
        },
        {
          key: "chunkSize",
          label: "Chunk size",
          description:
            "Max. number of HTTP requests contained in a single chunk",
          type: "number",
          default: 1500,
        },
        {
          key: "chunksAtOnce",
          label: "Chunk at once",
          description:
            "Max. number of chunks loaded at once when loading the extension",
          type: "number",
          default: 6,
        },
      ],
    };
  },
  mounted() {
    chrome.storage.local.get("settings").then((res) => {
      this.values = res.settings;
    });
  },
  methods: {
    set(evt) {
      this.values[evt.target.name] =
        evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;

      chrome.storage.local.set({ settings: this.values }).then(() => {
        chrome.runtime.sendMessage({ settings: this.values });
      });
    },
  },
};
</script>