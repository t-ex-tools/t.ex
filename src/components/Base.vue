<template>
  <div class="pb-5">
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
          <!--
          <table-chart
            v-if="featureInfo.lom <= 2"
            :feature="featureInfo"
            :totals="totals"
            :labels="labels"
            :raw-data="rawData"
            :data-tag="dataTag"
          />
          <box-plot
            v-else
            :feature="featureInfo"
            :totals="totals"
            :labels="labels"
            :raw-data="rawData"
          />
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Statistics from "../model/Statistics.js";

export default {
  props: {
    queries: {
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
    tab: {
      type: Number,
      default: () => 0
    },
    tag: {
      type: String,
      default: () => ""
    },
  },
  data: () => {
    return {
      loading: {
        isLoading: false,
        current: 0,
        max: 1,
      },
      instances: null,
      results: null,
      totals: null,
      labels: null,
      rawData: null,
    };
  },
  watch: {
    queries: {
      immediate: true,
      handler: async function () {
        this.startQuery();
      },
    },
    feature: {
      immediate: false,
      handler: async function () {
        this.startQuery();
      },
    },
  },
  mounted() {
    window.addEventListener("statistics:update", (e) => {
      if (e.detail.currentChunk === e.detail.numberOfChunks) {
        this.loading = { isLoading: false, current: 0, max: 1 };
      } else {
        this.loading.isLoading = true;
        this.loading.current = e.detail.currentChunk;
        this.loading.max = e.detail.numberOfChunks;
      }
      this.update();
    });
  },
  methods: {
    startQuery: function () {
      this.loading.isLoading = true;
      this.instances = this.setInstances(this.queries);
    },
    update: function () {
      this.results = this.setResults();
      this.labels = this.instances.map((e) => e.label);
      this.rawData = this.results.map((e) => e.data[this.feature]);
      this.totals = this.results.map((e) => e.count);
    },
    setInstances: function (queries) {
      // TODO: we query multiple times, however member can be complementary, i.e. result of first evaluation can be used for second query
      return queries.map((q, i) => ({
        label: q.label,
        statistics: Statistics.query(q.filter, this.feature, q.id),
      }));
    },
    setResults: function () {
      return this.instances.map((i) => i.statistics.get());
    },
  },
};
</script>