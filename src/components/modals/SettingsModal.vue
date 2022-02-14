<template>
  <b-modal 
    ref="settings-modal"
    title="Settings"
    header-bg-variant="primary"
    header-text-variant="light"
    hide-footer
    v-model="modalShown">
    <b-row>
      <b-col>
        <b-list-group class="mb-3">
          <b-list-group-item>
            <b-form-checkbox
              class="float-right" 
              v-bind:checked="settingsEncryption" 
              switch 
              size="lg"
              @change="setSettingsEncryption">
            </b-form-checkbox>
            Use Encryption to protect recorded Web traffic<br />
            <small>Encryption is turned <b>{{(settingsEncryption) ? "ON" : "OFF"}}</b></small><br />
            <small v-if="!settingsEncryption">Encrypted requests won't be loaded.</small>
          </b-list-group-item>
          <b-list-group-item>
            <b-form-checkbox
              class="float-right" 
              v-bind:checked="settingsBodyFormData" 
              switch 
              size="lg"
              @change="setSettingsBodyFormData">
            </b-form-checkbox>
            Record data that was transmitted in the HTTP body<br />
            <small>HTTP payload <b>{{(settingsBodyFormData) ? "will be recorded" : "won't be recorded"}}</b></small>
          </b-list-group-item>
          <b-list-group-item>
            <b-row>
              <b-col cols="8">
              Max. number of tabs opened simultaneously during a crawl
              </b-col>
              <b-col cols="4">
                <b-form-input 
                  class="float-right"
                  type="number"
                  v-model="settingsTabsAtOnce"
                  @blur="setSetting('settingsTabsAtOnce', settingsTabsAtOnce)">
                </b-form-input>
              </b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row>
              <b-col cols="8">
              Time-to-live of a tab for websites that load too long
              </b-col>
              <b-col cols="4">
                <b-form-input 
                  class="float-right"
                  type="number"
                  v-model="settingsTabTtl"
                  @blur="setSetting('settingsTabTtl', settingsTabTtl)">
                </b-form-input>
              </b-col>
            </b-row>
          </b-list-group-item>            
          <b-list-group-item>
            <b-row>
              <b-col cols="8">
              Max. number of HTTP requests contained in a single chunk
              </b-col>
              <b-col cols="4">
                <b-form-input 
                  class="float-right"
                  type="number"
                  v-model="settingsChunkSize"
                  @blur="setSetting('settingsChunkSize', settingsChunkSize)">
                </b-form-input>
              </b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row>
              <b-col cols="8">
              Max. number of chunks loaded at once when loading the extension
              </b-col>
              <b-col cols="4">
                <b-form-input 
                  class="float-right"
                  type="number"
                  v-model="settingsChunksAtOnce"
                  @blur="setSetting('settingsChunksAtOnce', settingsChunksAtOnce)">
                </b-form-input>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-modal>  
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
        "settingsEncryption",
        "settingsTabsAtOnce",
        "settingsTabTtl",
        "settingsChunkSize",
        "settingsChunksAtOnce",
      ],
    }
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
    setSettingsEncryption(flag) {
      this.settingsEncryption = flag;
      chrome.storage.local.set({settingsEncryption: flag}, () => {
        (flag) ? 
          chrome.storage.local.get("publicKey", (result) => {
            (result.hasOwnProperty("publicKey")) ?
              chrome.runtime.sendMessage({pubKey: result.publicKey}) :
              (this.resetModal(), this.$emit("create-password"))
          }) :
          chrome.runtime.sendMessage({delete: true})
      });
    },
  },
}
</script>