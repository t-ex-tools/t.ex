<template>
  <div id="init-modal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Load recorded data</h5>
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
              <div id="init-modal-accordion" class="accordion" role="tablist">
                <div
                  v-for="(option, index) in options"
                  :key="index"
                  class="accordion-item"
                >
                  <h2 class="accordion-header" :id="'heading-' + index">
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="'#item-' + index"
                      aria-expanded="false"
                      :aria-controls="'item-' + index"
                    >
                      {{ option.label }}
                    </button>
                  </h2>

                  <div
                    :id="'item-' + index"
                    class="accordion-collapse collapse"
                    :aria-labelledby="'heading-' + index"
                    data-bs-parent="#init-modal-accordion"
                  >
                    <div class="accordion-body">
                      <component
                        :is="option.component"
                        class="mt-3"
                        @update-limit="setBoundaries"
                      >
                      </component>
                    </div>
                  </div>
                </div>
              </div>
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
import LimitSlider from "./init-modal/LimitSlider.vue";
import CrawlLoader from "./init-modal/CrawlLoader.vue";

export default {
  components: {
    LimitSlider: LimitSlider,
    CrawlLoader: CrawlLoader,
  },
  data: () => {
    return {
      options: [
        {
          label: "Select time range",
          component: LimitSlider,
        },
        {
          label: "Load crawl",
          component: CrawlLoader,
        },
      ],
      boundaries: {
        lower: 0,
        upper: 0,
      }
    };
  },
  mounted() {},
  methods: {
    getChunks: function (indexes) {
      let keys = indexes
        .filter((e) => this.boundaries.lower <= e && e <= this.boundaries.upper)
        .map((e) => e.toString());

      this.chunks.total = keys.length;
      for (let i = 0; i * this.chunks.windowSize < keys.length; i++) {
        chrome.storage.local.get(
          keys.slice(
            i * this.chunks.windowSize,
            i * this.chunks.windowSize + this.chunks.windowSize
          ),
          (chunks) => {
            Object.values(chunks).forEach((chunk, index) => {
              this.data.requests.push(chunk.requests);
              this.js.push(chunk.js);
              this.chunks.loaded = i * this.chunks.windowSize + (index + 1);
            });
          }
        );
      }
    },    
    setBoundaries(boundaries) {

      // TODO: retrieve indexes to load from LimitSlider
      // TODO: retrieve boundaries from CrawlLoader
      this.$emit("set-tag", boundaries.dataTag);
      delete boundaries.dataTag;
      this.boundaries = limit;
    },
    handleOk(e) {
      // TODO: load data & propagate to parent
    },
  },
};
</script>