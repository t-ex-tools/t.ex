<template>
  <div>
    <ul class="nav nav-tabs">
      <li
        v-for="(g, i) in groups"
        :key="i"
        class="nav-item"
      >
        <a
          class="nav-link active"
          aria-current="page"
          href="#"
        >
          {{ g.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import FeatureExtractor from "../model/FeatureExtractor.js";

export default {
  props: {
    groups: {
      type: Array,
      default: () => []
    },
    selectedIndex: {
      type: Number,
      default: () => 0
    }
  },
  emits: ["tabs-changed"],
  data: () => {
    return {
      index: 0,
    };
  },
  watch: {
    index: function (newIndex) {
      this.$emit("tabs-changed", newIndex);
    },
  },
  created() {
    this.index = this.selectedIndex;
  },
  methods: {
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