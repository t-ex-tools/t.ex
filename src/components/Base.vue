<template>
  <div class="pb-5">

    <tab-bar
      :groups="groups.default"
      :selected-index="groups.selectedIndex"
      @tabs-changed="() => null"
      @tab-removed="() => null"
    >
    </tab-bar>

    <div
      v-if="results === null"
      class="row"
    >
      <div class="col">
        <div class="card card-body m-2">
          No results found.
        </div>
      </div>
    </div>

    <div
      v-else
      class="row"
    >
      <div class="col">
        <div
          class="card card-body m-2"
          :title="featureInfo.title"
          :sub-title="featureInfo.subtitle"
        >
          <div
            v-if="loading.isLoading"
            class="progress"
          >
            <div
              class="progress-bar bg-primary"
              :style="'width: ' + loading.current + '%'"
              role="progressbar"
              :aria-valuenow="loading.current"
              aria-valuemin="0"
              :aria-valuemax="loading.max"
            >
              {{ loading.current }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Statistics from "../model/Statistics.js";
import defaultGroups from "../model/DefaultGroups.js";

export default {
  props: {
    http: {
      type: Array,
      default: () => []
    },
    js: {
      type: Array,
      default: () => []
    },
    feature: {
      type: String,
      default: () => ""
    },
    featureInfo: {
      type: Object,
      default: () => {}
    },
    tag: {
      type: String,
      default: () => ""
    },
  },
  data: () => {
    return {
      groups: {
        default: defaultGroups,
        selectedIndex: 0
      },
      loading: {
        isLoading: false,
        current: 0,
        max: 1,
      },
    };
  },
  watch: {
    feature: {
      immediate: false,
      handler: async function () {
        // TODO: in case feature changes issue new query
      },
    },
  },
  mounted() {
    // TODO: query

    window.addEventListener("statistics:update", (e) => {
      if (e.detail.currentChunk === e.detail.numberOfChunks) {
        this.loading = { isLoading: false, current: 0, max: 1 };
      } else {
        this.loading.isLoading = true;
        this.loading.current = e.detail.currentChunk;
        this.loading.max = e.detail.numberOfChunks;
      }
      
    });
  },
  methods: {
  },
};
</script>