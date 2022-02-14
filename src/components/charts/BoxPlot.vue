<template>
  <div :id="this.id()"></div>
</template>

<script>
import Statistics from "../../model/Statistics.js";
import Util from "../../model/Util.js";


// TODO: rename to linechart
export default {
  props: ["feature", "totals", "labels", "rawData"],
  data () {
    return {
      chart: null,
      data: null,
      options: {
        theme: "maximized",
        height: window.innerHeight - 225,
        hAxis: {
          logScale: true,
        },
        animation: {
          startup: true,
          duration: 800,
          easing: "inAndOut",
        },
      }
    }
  },
  watch: {
    rawData: function(n) {
      (google.visualization && this.chart) ? this.process(n) : null;
    },
  },
  mounted () {
    google.charts.setOnLoadCallback(() => {
      this.chart = new google.visualization.AreaChart(document.getElementById(this.id()));
      this.process(this.rawData);
    });
  },
  methods: {
    id: function() {
      return "canvas-" + this._uid;
    },
    process(n) {
      this.data = new google.visualization.DataTable(Util.toJsLiteral(n, this.labels, this.totals, "number"));
      this.chart.draw(this.data, this.options);
    },
  },
}
</script>