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
                  <h2 class="accordion-header" :id="'heading-' + index">
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
                      >
                      </component>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="card card-body bg-warning">
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
            data-bs-toggle="modal"
            data-bs-target="#loading-modal"
            @click="handleOk"
          >
            Load data
          </button>
        </div>
      </div>
    </div>
  </div>
  <loading-modal :loaded="chunks.loaded" :total="chunks.total"> </loading-modal>
</template>

<script>
import LimitSlider from "./init-modal/LimitSlider.vue";
import CrawlLoader from "./init-modal/CrawlLoader.vue";
import LoadingModal from "./LoadingModal.vue";
import config from "../../assets/settings.json";

export default {
  components: {
    LimitSlider,
    CrawlLoader,
    LoadingModal,
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
      chunks: {
        chunksAtOnce: config.chunksAtOnce.default,
        loaded: 0,
        total: -1,
      },
      boundaries: {
        lower: 0,
        upper: 0,
      },
      indexes: [],
    };
  },
  mounted() {
    chrome.storage.local.get(["indexes", "settings"]).then((res) => {
      this.indexes = res.indexes ? res.indexes.sort() : [];
      if (this.indexes.length > 0) {
        (this.boundaries.upper = Date.now()),
          (this.boundaries.lower = this.indexes[this.indexes.length - 1]);
      }

      if (res.settings) {
        this.chunks.chunksAtOnce = res.settings.hasOwnProperty("chunksAtOnce")
          ? res.settings.chunksAtOnce
          : this.chunks.chunksAtOnce;
      }
    });
  },
  methods: {
    load: function (indexes) {
      this.chunks.total = indexes.length;
      for (let i = 0; i * this.chunks.chunksAtOnce < indexes.length; i++) {
        chrome.storage.local
          .get(
            indexes.slice(
              i * this.chunks.chunksAtOnce,
              (i + 1) * this.chunks.chunksAtOnce
            )
          )
          .then((chunks) => {
            Object.values(chunks).forEach((chunk, index) => {
              this.$emit("data", chunk);
              this.chunks.loaded = i * this.chunks.chunksAtOnce + (index + 1);
            });
          });
      }
    },
    setBoundaries(boundaries) {
      this.$emit("set-tag", boundaries.dataTag);
      delete boundaries.dataTag;
      this.boundaries = boundaries;
    },
    handleOk() {
      let i = this.indexes
        .filter((t) => t >= this.boundaries.lower && t <= this.boundaries.upper)
        .map((t) => t.toString());
      this.load(i);
    },
  },
};
</script>