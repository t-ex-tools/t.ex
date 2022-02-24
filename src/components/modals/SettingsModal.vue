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
                  v-for="(k, index) in Object.keys(settings)"
                  :key="index"
                  class="list-group-item"
                >
                  <div class="row">
                    <div class="col-8">
                      <div class="fw-bold">{{ settings[k].label }}</div>
                      <small>{{ settings[k].description }}</small>
                    </div>
                    <div class="col-4">
                      <div class="form-check form-switch">
                        <input
                          v-if="settings[k].type === 'checkbox'"
                          class="form-check-input float-end"
                          :name="k"
                          :type="settings[k].type"
                          role="switch"
                          @change="set"
                          :checked="
                            values[k]
                              ? values[k]
                              : settings[k].default
                          "
                        />
                        <input
                          v-else
                          :name="k"
                          type="number"
                          class="form-control"
                          :value="
                            values[k]
                              ? values[k]
                              : settings[k].default
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
import config from "../../assets/settings.json";

export default {
  data: () => {
    return {
      values: {},
      settings: config,
    };
  },
  mounted() {
    chrome.storage.local.get("settings").then((res) => {
      this.values = (res.settings) ? res.settings : {};
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