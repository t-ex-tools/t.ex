<template>
  <div>
    <ul class="nav nav-tabs">
      <li v-for="(g, i) in groups" :key="i" class="nav-item">
        <a class="nav-link active" aria-current="page" href="#">
          {{ g.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import FeatureExtractor from "../model/FeatureExtractor.js";

export default {
  data: () => {
    return {
      index: 0,
    };
  },
  props: ["groups", "selectedIndex"],
  watch: {
    index: function (newIndex) {
      this.$emit("tabs-changed", newIndex);
    },
  },
  created() {
    this.index = this.selectedIndex;
  },
  methods: {
    // TODO: enable selection from TableChart and BoxPlot
    addGroup: function (group, featureIndex, value) {
      let feature = FeatureExtractor.features()[featureIndex];
      let i = this.selectedIndex;

      let label =
        group + " - " + FeatureExtractor.info(feature).title + " = " + value;

      let prevFilter = this.groups[i].members.find(
        (e) => e.label === group
      ).filter;

      let filter = (r) => {
        let f = FeatureExtractor.extract(feature)(r);
        let b =
          typeof f === "object"
            ? f.find((e) => FeatureExtractor.encode(e) === value)
            : f === value;
        return prevFilter(r) && b;
      };

      // this.groups.push({label: label, members: [{label: label, filter: filter}]});
    },
    tabChanged: function (currentTabs, previousTabs) {
      currentTabs.length > previousTabs.length
        ? previousTabs.length > 0
          ? (this.index = currentTabs.length - 1)
          : (this.index = 0)
        : null;

      this.$emit("tabs-changed", this.index);
    },
  },
};
</script>

<style scoped>
.tab-text {
  max-width: 200px;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.remove-tab-btn {
  color: darkgray;
}
.remove-tab-btn:hover {
  color: red;
}
</style>