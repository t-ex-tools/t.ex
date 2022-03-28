<template>
  <div
    id="settings-modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Settings
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
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
                      <div class="fw-bold">
                        {{ settings[k].label }}
                      </div>
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
                          :checked="
                            values[k]
                              ? values[k]
                              : settings[k].default
                          "
                          @change="set"
                        >
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
                        >
                      </div>
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
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Exit settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "../../model/Settings.js";

export default {
  data: () => {
    return {
      values: {},
      settings: config,
    };
  },
  mounted() {
    browser.storage.local.get("settings").then((res) => {
      this.values = (res.settings) ? res.settings : {};
    });
  },
  methods: {
    set(evt) {
      this.values[evt.target.name] =
        evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;

      if (config[evt.target.name].handler) {
        config[evt.target.name].handler(this.values[evt.target.name]);
      }

      const cfg = { settings: this.values };
      browser.storage.local.set(cfg).then(() => {
        browser.runtime.sendMessage(cfg);
      });

      this.emitter.emit("settings", cfg);
    },
  },
};
</script>