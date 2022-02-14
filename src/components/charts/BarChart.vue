<template>
<div :id="this.id()">
  <div v-for="(l, i) in labels" v-bind:key="l">
    <b-icon icon="circle-fill" scale="0.65" v-bind:style="'color:' + Util.color(i)"></b-icon>
    <div :id="'filter-' + i + '-' + id()" style="display: inline"></div>
  </div>
  <div :id="'chart-' + id()"></div>
  <div>
    <small v-for="(t, i) in totals" v-bind:key="i">
      <i>{{labels[i] + " " + t + " requests; "}}</i>
    </small>
  </div>
</div>
</template>

<script>
import Util from "../../model/Util.js";

// NOTE: deprecated to be removed
export default {
  props: ["feature", "totals", "labels", "rawData"],
  data () {
    return {
      Util: Util,
      dashboard: null,
      filter: null,
      chart: null,
      data: null,
      options: {
        legend: "none",
        theme: "maximized",
        height: window.innerHeight - 225,
        animation: {
          startup: true,
          duration: 800,
          easing: "inAndOut",
        },
        bar: {
          groupWidth: 100,
        },
      },
    }
  },
  watch: {
    labels: function(n, o) {
      (JSON.stringify(n) !== JSON.stringify(o)) ? this.initialize() : null;
    },
    rawData: function(n, o) {
      (google.visualization && this.dashboard && this.chart && this.filter) ? 
        this.preprocess(n) : null;
    },
  },
  mounted () {
    google.charts.setOnLoadCallback(this.initialize);
  },
  methods: {
    id: function() {
      return "canvas-" + this._uid;
    },
    initialize: function() {
      this.dashboard = new google.visualization.Dashboard(document.getElementById(this.id()));

      this.chart = new google.visualization.ChartWrapper({
        chartType: "ColumnChart",
        containerId: "chart-" + this.id(),
        options: this.options,
      });

      google.visualization.events.addListener(this.chart, "select", () => {
        let s = this.chart.getChart().getSelection()[0];
        this.$root.addGroup(this.labels[s.column-1], this.feature.index, this.chart.getDataTable().getFormattedValue(s.row, 0));
      });
      
      this.filter = this.labels.map((l, i) => new google.visualization.ControlWrapper({
        controlType: "NumberRangeFilter",
        containerId: "filter-" + i + "-" + this.id(),
        options: {
          filterColumnLabel: l,
          ui: {
            step: 0.01,
            cssClass: "d-inline",
          },
        },
        state: {
          lowValue: 2.0,
          highThumbAtMaximum: true,
        },
      }));

      this.dashboard.bind(this.filter, this.chart);
    },
    preprocess(n) {
      let d = Object.entries(n.reduce((acc, col, index) => {
          Object.keys(col).forEach((key) => {
            (!acc[key]) ? acc[key] = new Array(n.length).fill(0) : null;
            acc[key][index] = col[key];
          })
          return acc;
        }, {}))
        .map((e) => [e[0], ...e[1]]);

      let j = {
        cols: [{id: "feature", label: "Feature", type: "string"}, ...this.labels.map((f) => ({id: f, label: f, type: "number"}))],
        rows: d.map((e) => ({
          c: e.map((v, i) => 
            (i > 0) ? 
              (this.totals[i-1] > 0) ? {v: v * 100 / this.totals[i-1]} : {v: 0} 
            : {v: v})
          })
        ),
      };

      this.data = new google.visualization.DataTable(j);
      this.dashboard.draw(this.data, this.options);
    },
  },
}
</script>