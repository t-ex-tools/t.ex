<template>
  <div
    id="init-modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Load recorded data
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
              <div
                v-if="indexes.length > 0"
                id="init-modal-accordion"
                class="accordion"
                role="tablist"
              >
                <div
                  v-for="(option, index) in options"
                  :key="index"
                  class="accordion-item"
                >
                  <h2
                    :id="'heading-' + index"
                    class="accordion-header"
                  >
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="'#item-' + index"
                      aria-expanded="true"
                      :aria-controls="'item-' + index"
                    >
                      {{ option.label }}
                    </button>
                  </h2>

                  <div
                    :id="'item-' + index"
                    class="accordion-collapse collapse"
                    :class="{ show: index === 0 }"
                    :aria-labelledby="'heading-' + index"
                    data-bs-parent="#init-modal-accordion"
                  >
                    <div class="accordion-body">
                      <component
                        :is="option.component"
                        :indexes="indexes"
                        @update-limit="setBoundaries"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="card card-body bg-warning"
              >
                No data recorded yet.
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
            Cancel
          </button>

          <button
            v-if="indexes.length > 0"
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="handleOk"
          >
            Load data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LimitSlider from "./init-modal/LimitSlider.vue";
import CrawlLoader from "./init-modal/CrawlLoader.vue";
import { markRaw } from "vue";
import Data from "../../model/Data.js";

export default {
  components: {
    LimitSlider,
    CrawlLoader
  },
  emits: ["data"],
  data: () => {
    return {
      suffix: "init-modal",
      options: [
        {
          label: "Select time range",
          component: markRaw(LimitSlider),
        },        
        {
          label: "Load crawl",
          component: markRaw(CrawlLoader),
        }
      ],
      boundaries: {
        dataTag: "last",
        lower: 0,
        upper: 0
      },
      indexes: [],
    };
  },
  mounted() {    
    browser.storage.local.get(["indexes"])
      .then((res) => {
        this.setIndexes(res.indexes);
      });

    const self = this;
    let elem = document.getElementById("init-modal");
    elem.addEventListener("show.bs.modal", function() {
      browser.storage.local.get(["indexes"])
        .then((res) => {
          self.setIndexes(res.indexes);
        });
    });
  },
  methods: {
    setIndexes(indexes) {
      this.indexes = indexes ? indexes.sort() : [];
      if (this.indexes.length > 0) {
        this.boundaries.upper = Date.now();
        this.boundaries.lower = this.indexes[this.indexes.length - 1];
      }
    },
    setBoundaries(boundaries) {
      this.boundaries = boundaries;
      console.debug("Boundaries retrieved " + JSON.stringify(this.boundaries));
    },
    handleOk() {
      let i = this.indexes
        .filter((t) => t >= this.boundaries.lower && t <= this.boundaries.upper)
        .map((t) => t.toString());
      
      this.$emit("data", {
        tag: this.boundaries.dataTag,
        length: i.length
      });        
      Data.setIndexes(i);
    },
  },
};
</script>