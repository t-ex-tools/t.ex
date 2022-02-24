<template>
  <div :id="this.id()" class="mt-3">
    <div>
      <button
        class="btn btn-outline-primary float-end"
        @click="exportData"
      >
        <i class="bi bi-table me-2"></i>
        <small>Export CSV</small>
      </button>
    </div>
    <div v-for="(l, i) in labels" :key="l">
      <div :id="'filter-' + i + '-' + id()" class="float-left mr-2"></div>
      <span :id="'values-filter-' + i + '-' + id()" class="float-left"></span>
    </div>
    <div class="clearfix"></div>
    <div id="filter-string-search" class="mb-3"></div>
    <div :id="'chart-' + id()"></div>
    <div>
      <small v-for="(t, i) in totals" :key="i">
        <i>{{ labels[i] }} {{ t }} http; </i>
      </small>
    </div>
    <div>
      <small v-for="(s, i) in shares" :key="i">
        <i>
          {{ shares[i].count }} ({{ shares[i].percentage }}%)
          {{ feature.title }}
          in {{ labels[i] }};
        </i>
      </small>
    </div>
  </div>
</template>

<script>
import Util from "../../model/Util.js";

export default {
  props: ["feature", "totals", "labels", "rawData", "dataTag"],
  data() {
    return {
      Util: Util,
      dashboard: null,
      filter: null,
      chart: null,
      data: null,
      shares: [],
      options: {
        showRowNumber: false,
        page: "enable",
        pageSize: 20,
        width: "100%",
        height: window.innerHeight - 125,
      },
    };
  },
  watch: {
    labels: function (n, o) {
      JSON.stringify(n) !== JSON.stringify(o) ? this.initialize() : null;
    },
    rawData: function (n) {
      google.visualization && this.dashboard && this.chart && this.filter
        ? this.process(n)
        : null;
    },
  },
  mounted() {
    google.charts.setOnLoadCallback(this.initialize);
  },
  methods: {
    id: function () {
      return "canvas-" + this._uid;
    },
    initialize: function () {
      this.dashboard = new google.visualization.Dashboard(
        document.getElementById(this.id())
      );

      this.chart = new google.visualization.ChartWrapper({
        chartType: "Table",
        containerId: "chart-" + this.id(),
        options: this.options,
      });

      /*
      google.visualization.events.addListener(this.chart, "select", () => {
        let s = this.chart.getChart().getSelection()[0];
        console.log(s, this.chart.getDataTable().getFormattedValue(s.row, 0));
        this.$root.addGroup(this.labels[s.column-1], this.feature.index, this.chart.getDataTable().getFormattedValue(s.row, 0));
      });
      */

      this.filter = this.labels
        .map(
          (l, i) =>
            new google.visualization.ControlWrapper({
              controlType: "NumberRangeFilter",
              containerId: "filter-" + i + "-" + this.id(),
              options: {
                filterColumnLabel: l,
                ui: {
                  showRangeValues: false,
                  step: 0.001,
                  cssClass: "d-inline",
                },
              },
            })
        )
        .concat([
          new google.visualization.ControlWrapper({
            controlType: "StringFilter",
            containerId: "filter-string-search",
            options: {
              filterColumnIndex: 0,
              ui: {
                cssClass: "d-inline",
              },
            },
          }),
        ]);

      this.filter.slice(0, this.filter.length - 1).forEach((f) => {
        google.visualization.events.addListener(f, "statechange", (e) => {
          let x = f.getState();
          document.querySelector("#values-" + e.container.id).innerHTML =
            "[" + x.lowValue + ", " + x.highValue + "]";
        });
      });

      this.dashboard.bind(this.filter, this.chart);
      this.process(this.rawData);
    },
    process(n) {
      this.shares = n.map((row) => Object.keys(row).length);
      let total = this.shares.reduce((acc, val) => acc + val, 0);
      this.shares = this.shares.map((e) => ({
        count: e,
        percentage: total === 0 ? 0 : ((e / total) * 100).toFixed(2),
      }));

      this.data = new google.visualization.DataTable(
        Util.toJsLiteral(n, this.labels, this.totals)
      );
      this.data.sort({ column: 1, desc: true });
      this.dashboard.draw(this.data, this.options);
    },
    exportData() {
      let csv = google.visualization.dataTableToCsv(this.data);
      let totals =
        this.totals
          .map((t, i) => '"' + this.labels[i] + '=","' + t + '"')
          .join(",") + "\r\n";
      csv = totals + csv;
      chrome.downloads.download({
        filename:
          this.dataTag +
          "-" +
          this.feature.title +
          "-" +
          this.labels.join("_") +
          ".csv",
        url: URL.createObjectURL(
          new Blob([csv], { type: "data:application/csv;charset=utf-8" })
        ),
      });
    },
  },
};
</script>