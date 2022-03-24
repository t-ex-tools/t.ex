<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <b>Features</b>
      </div>
    </div>
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
    <div
      v-if="noData"
      class="row mb-3"
    >
      <div class="col">
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>
            No data loaded yet. Use the <b>Load data</b> 
            button at the top right to load data.
          </strong>  
        </div>
      </div>
    </div>    
    <div 
      v-if="!noData"
      class="row"
    >
      <div class="col">
        <button
          class="btn btn-outline-primary float-end"
          type="button"
          @click="download"
        >
          <i class="bi bi-table me-2" />
          <small>Export CSV</small>
        </button>        
      </div>
    </div>
    <div 
      v-if="!noData"
      class="row"
    >
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
          :headings="headings"
          :items="table"
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
    dataTag: {
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
    noData() {
      return Object.values(this.http).length === 0 && 
        Object.values(this.js).length === 0;
    },
    percent() {
      return Math.round((this.loading.loaded / this.loading.total) * 100);
    },
    headings() {
      return ["Value"].concat(
        this.queries
        .default[this.queries.selected]
        .members
          .map((e) => e.label)
      );
    },
    // TODO: watch this.data deep
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
  },
  watch: {
    http: {
      deep: true,
      handler: function() {
        this.reset();
      }
    },
    js: {
      deep: true,
      handler: function() {
        this.reset();
      }
    },        
    feature: {
      immediate: true,
      handler: function() {
        this.reset();
      }
    },
    queries: {
      deep: true,
      handler: function() {
        this.reset();
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
    reset() {
      this.data = {};
      this.query();      
    },
    query() {
      let type = this.feature.split(".")[0];

      Statistics.query(
        this[type],
        type,
        this.queries.default[this.queries.selected],
        this.feature,
        (data) => {
          this.data = data;
        }
      );
    },
    download() {
      let csv = [this.headings]
        .concat(this.table)
        .map((row) => {
          return row
            .map((h) => '"' + h.toString().replace(/"/g, '\\\"') + '"')
            .join(",");
        })
        .join("\n");

      chrome.downloads.download({
        filename: 
          this.dataTag
          + "-"
          + this.feature
          + "-" 
          + this.queries.default[this.queries.selected].label 
          + ".csv",
        url: URL.createObjectURL(
            new Blob([csv], { type: "data:application/csv;charset=utf-8" })
          )
      });

    }
  },
};
</script>