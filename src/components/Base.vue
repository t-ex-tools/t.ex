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
      v-if="!dataLoaded"
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
      v-if="dataLoaded"
      class="row"
    >
      <div class="col">
        <select
          v-model="values.selected"
          class="form-select" 
          aria-label="Values"
        >
          <option
            v-for="option, index in values.options"
            :key="index"
            :value="index"
            :selected="index === values.selected"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
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
      v-if="dataLoaded"
      class="row my-3"
    >
      <div class="col">
        <tab-bar
          :queries="queries.default"
          :selected-index="queries.selected"
          :is-loading="loading.processing"
          @tabs-changed="(i) => {
            queries.selected = i;
            loading.processing = true;
          }"
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
            :style="'width: ' + progress + '%'"
            role="progressbar"
            :aria-valuenow="loading.loaded"
            aria-valuemin="0"
            :aria-valuemax="loading.total"
          >
            {{ progress }}%
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <data-table
          :headings="headings"
          :items="table()"
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

const empty = { isLoading: false, processing: false, loaded: 0, total: 0 };

let percent = (dividend, divisor) => 
  ((dividend / divisor) * 100).toFixed(2);

export default {
  components: {
    TabBar,
    DataTable,
  },
  props: {
    dataLoaded: {
      type: Boolean,
      default: () => false,
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
        default: DefaultQueries.groups(),
        selected: 0,
      },
      loading: { ...empty },
      data: {},
      values: {
        selected: 0,
        options: [{
          label: "Display counts",
          slug: "counts",
          impl: (row, idx, rows) => row 
        }, {
          label: "Display % of rows",
          slug: "percentage-of-rows",
          impl: (row, idx, rows) => 
            row
              .map((cell, i) => (i === 0)
                ? cell
                : percent(cell, row[row.length-1])
              )
        }, {
          label: "Display % of columns",
          slug: "percentage-of-columns",
          impl: (row, idx, rows) => 
            row
              .map((cell, i) => (i === 0)
                ? cell
                : percent(cell, rows[rows.length-1][i])
              )
        }, {
          label: "Display % of total",
          slug: "percentage-of-total",
          impl: (row, idx, rows) => 
            row
              .map((cell, i) => (i === 0)
                ? cell
                : percent(cell, rows[rows.length-1][row.length-1])
              )
        }]
      },
    };
  },
  computed: {
    progress() {
      return Math.round((this.loading.loaded / this.loading.total) * 100);
    },
    headings() {
      return ["Value"]
        .concat(
          this.queries.default[this.queries.selected].members.map(
            (e) => e.label
          )
        )
        .concat(["#"]);
    },
  },
  watch: {
    dataLoaded() {
      this.reset();
    },
    feature: {
      immediate: true,
      handler: function () {
        this.reset();
      },
    },
    queries: {
      deep: true,
      handler: function () {
        this.reset();
      },
    },
  },
  mounted() {
    window.addEventListener("statistics:loading:update", (e) => {
      if (e.detail.loaded === e.detail.total) {
        this.loading = { ...empty };
      } else {
        this.loading.processing = true;
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
        type,
        this.queries.default[this.queries.selected],
        this.feature,
        (data) => {
          this.loading.processing = false;
          this.data = data;
        }
      );
    },
    table() {
      if (Object.keys(this.data).length === 0) {
        return;
      }

      let rows = Object.values(this.data)
        .map((e) => Object.keys(e.data[this.feature]))
        .reduce((acc, val) => [...new Set(acc.concat(val))], [])
        .map((e) => {
          let v = Object.values(this.data).map((el) =>
            el.data[this.feature][e] ? el.data[this.feature][e] : 0
          );
          return [e, ...v];
        });

      rows.forEach((row) => row.push(Statistics.sum(row.slice(1))));

      rows.push(
        this.headings.map((col, idx) =>
          idx === 0 ? "#" : Statistics.sum(rows.map((e) => e[idx]))
        )
      );

      rows = rows.map(this.values.options[this.values.selected].impl);

      return rows;
    },
    download() {
      let csv = [this.headings]
        .concat(this.table())
        .map((row) => {
          return row
            .map((h) => '"' + h.toString().replace(/"/g, '\\"') + '"')
            .join(",");
        })
        .join("\n");

      browser.downloads.download({
        filename:
          this.dataTag +
          "/" +
          this.feature +
          "/" +
          this.feature +
          "." +
          this.values.options[this.values.selected].slug +
          "-" +
          this.queries.default[this.queries.selected].label +
          ".csv",
        url: URL.createObjectURL(
          new Blob([csv], { type: "data:application/csv;charset=utf-8" })
        ),
      });
    },
  },
};
</script>