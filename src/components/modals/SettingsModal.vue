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
import settings from "../../assets/settings.json";

export default {
  data: () => {
    return {
      values: {},
      settings: settings,
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