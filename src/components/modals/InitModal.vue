<template>
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

    <div v-if="showDataPicker" class="row">
      <div class="col">

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

      </div>
    </div>
  </b-modal>  
</template>

<script>
import LimitSlider from "./init-modal/LimitSlider.vue";
import CrawlLoader from "./init-modal/CrawlLoader.vue";

export default {
  components: {
    "LimitSlider": LimitSlider,
    "CrawlLoader": CrawlLoader,
  },
  data: () => {
    return {
      modalShown: false,
      showDataPicker: false,
      callback: null,
    }
  },
  mounted() {
  },
  methods: {
    showModal(showDataPicker, callback) {
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
      this.callback();
    },
  },
}
</script>