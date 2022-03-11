<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="card card-body mb-3">
          <div class="fw-bold">
            {{ featureInfo.title }}
          </div>
          <div>
            {{ featureInfo.subtitle }}
          </div>
        </div>
      </div>
    </div>    
    <div class="row">
      <div class="col">
        <tab-bar
          :queries="queries.default"
          :selected-index="queries.selected"
          @tabs-changed="(i) => queries.selected = i"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <div 
          v-if="loading.isLoading" 
          class="progress"
        >
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
      </div>
    </div>
    <div class="row">
      <div class="col">
        <data-table
          :headings="headings()"
          :items="table(data)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Statistics from "../model/Statistics.js";
import DefaultQueries from "../model/DefaultQueries.js";
import TabBar from "./TabBar.vue";
import DataTable from "./DataTable.vue";

const empty = { isLoading: false, loaded: 0, total: 0 };

export default {
  components: {
    TabBar,
    DataTable
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
    }
  },
  watch: {
    feature: {
      immediate: true,
      handler: function () {
        this.data = {};
        this.query();
      }
    },
    queries: {
      deep: true,
      handler: function() {
        this.data = {};
        this.query();
      }
    }
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
  methods: {
    headings() {
      return this.queries.default[this.queries.selected].members.map((e) => e.label);
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
    },
    query() {
      Statistics.query(
        Object.values(this.http), // TODO: for some features this.js
        this.queries.default[this.queries.selected],
        this.feature,
        (data) => {
          this.data = data;
        }
      );
    }
  },
};
</script>