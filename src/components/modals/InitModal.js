import PasswordForm from "./init-modal/PasswordForm.js";
import LimitSlider from "./init-modal/LimitSlider.js";
import CrawlLoader from "./init-modal/CrawlLoader.js";

export default {
  components: {
    "PasswordForm": PasswordForm,
    "LimitSlider": LimitSlider,
    "CrawlLoader": CrawlLoader,
  },
  data: () => {
    return {
      modalShown: false,
      createPwdMode: false,
      useEncryption: false,
      showDataPicker: false,
      callback: null,
    }
  },
  mounted() {
    window.addEventListener("crypt:loaded", (e) => {
      this.createPwdMode = !e.detail.privKeyExists;
    });
  },
  methods: {
    showModal(useEncryption, showDataPicker, callback) {
      this.useEncryption = useEncryption;
      this.showDataPicker = showDataPicker;
      this.callback = callback;
      this.modalShown = true;
    },
    resetModal() {
    },
    setModal() {
    },
    passLimit(limit) {
      this.$emit("update-limit", limit);
    },
    handleOk(e) {
      (this.useEncryption) ? 
        (this.createPwdMode) ? 
          this.$refs.PasswordForm.createPwd(e, this.callbackAndHide)
          : this.$refs.PasswordForm.checkPwd(e, this.callbackAndHide) 
        : this.callbackAndHide();
    },
    callbackAndHide() {
      this.callback();
      this.modalShown = false;
      (this.$refs.PasswordForm) ? this.$refs.PasswordForm.resetForm() : null;
    },
  },
  template: /*html*/`
    <b-modal 
      ref="InitModal"
      title="Load recorded data"
      header-bg-variant="primary"
      header-text-variant="light"
      ok-only
      v-model="modalShown"
      v-on:shown="setModal"
      v-on:hidden="resetModal"
      v-on:ok="handleOk">

      <b-row v-if="useEncryption" class="mb-3">
        <b-col>
          <password-form ref="PasswordForm" v-bind:createPwdMode="createPwdMode"></password-form>
        </b-col>
      </b-row>

      <b-row v-if="showDataPicker">
        <b-col>

          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-1 variant="outline-primary">
                  Select time range
                </b-button>
              </b-card-header>
              <b-collapse visible
                id="accordion-1"
                accordion="my-accordion"
                role="tabpanel"  
                @show="$refs.LimitSlider.updateLimit()">
                <b-card-body>
                  <limit-slider 
                    ref="LimitSlider"
                    class="mt-3"
                    @update-limit="passLimit">
                  </limit-slider>
                </b-card-body>
              </b-collapse>
            </b-card>
        
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-2 variant="outline-primary">
                  Load a crawl
                </b-button>
              </b-card-header>
              <b-collapse 
                id="accordion-2" 
                accordion="my-accordion" 
                role="tabpanel" 
                @show="$refs.CrawlLoader.updateLimit(0)">
                <b-card-body>
                  <crawl-loader 
                    ref="CrawlLoader"
                    class="mt-3" 
                    @update-limit="passLimit">
                  </crawl-loader>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>

        </b-col>
      </b-row>
    </b-modal>    
  `,  
}