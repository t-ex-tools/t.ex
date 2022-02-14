import BarChart from "./charts/BarChart.js";
import BoxPlot from "./charts/BoxPlot.js";
import TableChart from "./charts/TableChart.js";
import Statistics from "../model/Statistics.js";

export default {
  components: {
    "TableChart": TableChart,
    "BarChart": BarChart,
    "BoxPlot": BoxPlot,
  },
  props: [
    "queries", 
    "feature", 
    "featureInfo", 
    "tabIndex",
    "dataTag"
  ],
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
    }
  },
  watch: {
    queries: {
      immediate: true,
      handler: async function() {
        this.startQuery();
      },
    },
    feature: {
      immediate: false,
      handler: async function() {
        this.startQuery();
      },
    }
  },
  mounted() {
    window.addEventListener("statistics:update", (e) => {
      if (e.detail.currentChunk === e.detail.numberOfChunks) {
        this.loading = {isLoading: false, current: 0, max: 1};
      } else {
        this.loading.isLoading = true;
        this.loading.current = e.detail.currentChunk;
        this.loading.max = e.detail.numberOfChunks;
      }
      this.update();
    });
  },
  methods: {
    startQuery: function() {
      this.loading.isLoading = true;
      this.instances = this.setInstances(this.queries);
    },
    update: function() {
      this.results = this.setResults();
      this.labels = this.instances.map((e) => e.label);
      this.rawData = this.results.map((e) => e.data[this.feature]);
      this.totals = this.results.map((e) => e.count);
    },
    setInstances: function(queries) {
      // TODO: we query multiple times, however member can be complementary, i.e. result of first evaluation can be used for second query
      return queries.map((q, i) => ({label: q.label, statistics: Statistics.query(q.filter, this.feature, q.id)}));
    },
    setResults: function() {
      return this.instances.map((i) => i.statistics.get())
    },
  },
  template: /*html*/`
    <div class="pb-5">
      <b-row v-if="results === null">
        <b-col cols="12">
          <b-card class="m-2" title="No results found."></b-card>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="12">
          <b-card class="m-2" v-bind:title="featureInfo.title" v-bind:sub-title="featureInfo.subtitle">
            <b-progress show-progress animated
              v-if="loading.isLoading" 
              v-bind:value="loading.current" 
              v-bind:max="loading.max">
            </b-progress>
            <table-chart
              v-if="featureInfo.lom <= 2"
              v-bind:feature="featureInfo"
              v-bind:totals="totals"
              v-bind:labels="labels" 
              v-bind:rawData="rawData"
              v-bind:dataTag="dataTag">
            </table-chart>
            <box-plot 
              v-else
              v-bind:feature="featureInfo"
              v-bind:totals="totals"
              v-bind:labels="labels" 
              v-bind:rawData="rawData">
            </box-plot>
            </b-card>      
          </b-card> 
        </b-col>
      </b-row>
    </div>
  `,
}