<template>
  <div class="pb-5">
    <div v-if="Object.values(data) === 0" class="row">
      <div class="col">
        <div class="card card-body m-2">No results found.</div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col">
        <tab-bar
          :queries="queries.default"
          :selected-index="queries.selected"
          @tabs-changed="() => null"
          @tab-removed="() => null"
        />
        <div v-if="loading.isLoading" class="progress">
          <div
            class="progress-bar bg-primary"
            :style="'width: ' + percent + '%'"
            role="progressbar"
            :aria-valuenow="loading.loaded"
            aria-valuemin="0"
            :aria-valuemax="loading.total"
          >
            {{ percent }}%
          </div>
        </div>
        <div>
          {{ JSON.stringify(table) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Statistics from "../model/Statistics.js";
import DefaultQueries from "../model/DefaultQueries.js";
import TabBar from "./TabBar.vue";

const empty = { isLoading: false, loaded: 0, total: 0 };

export default {
  components: {
    TabBar,
  },
  props: {
    http: {
      type: Array,
      default: () => [],
    },
    js: {
      type: Array,
      default: () => [],
    },
    feature: {
      type: String,
      default: () => "",
    },
    featureInfo: {
      type: Object,
      default: () => {},
    },
    tag: {
      type: String,
      default: () => "",
    },
  },
  data: () => {
    return {
      queries: {
        default: DefaultQueries,
        selected: 1,
      },
      loading: { ...empty },
      data: {}
    };
  },
  computed: {
    percent() {
      return Math.round((this.loading.loaded / this.loading.total) * 100);
    },
    table() {
      let rows = Object
        .values(this.data)
        .map((e) => Object.keys(e.data[this.feature]))
        .reduce((acc, val) => [...new Set(acc.concat(val))], []);
      
      return rows
        .map((e) => {
          let v = Object
            .values(this.data)
            .map((el) => 
              (el.data[this.feature][e])
              ? el.data[this.feature][e]
              : 0
            );
          return [e, ...v];
        });
    }
  },
  watch: {
    feature: {
      immediate: true,
      handler: function (n) {
        Statistics.query(
          Object.values(this.http),
          this.queries.default[this.queries.selected],
          n,
          (data) => this.data = data
        );
      },
    },
  },
  mounted() {
    window.addEventListener("statistics:loading:update", (e) => {
      if (e.detail.loaded === e.detail.total) {
        this.loading = { ...empty };
      } else {
        this.loading.isLoading = true;
        this.loading.loaded = e.detail.loaded;
        this.loading.total = e.detail.total;
      }
    });
  },
  methods: { },
};
</script>