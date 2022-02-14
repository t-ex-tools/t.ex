import FeatureExtractor from "../model/FeatureExtractor.js";

export default {
  data: () => {
    return {
      index: 0,
    }
  },
  props: ["groups", "selectedIndex"],
  watch: {
    index: function(newIndex) {
      this.$emit("tabs-changed", newIndex);
    }
  },
  created() {
    this.index = this.selectedIndex;
  },
  methods: {
    // TODO: enable selection from TableChart and BoxPlot
    addGroup: function(group, featureIndex, value) {
      let feature = FeatureExtractor.features()[featureIndex];
      let i = this.selectedIndex;

      let label = group + " - " +
        FeatureExtractor.info(feature).title + " = " + 
        value;

      let prevFilter = this.groups[i].members.find((e) => e.label === group).filter;

      let filter = (r) => {
        let f = FeatureExtractor.extract(feature)(r);
        let b = (typeof f === "object") ? f.find((e) => FeatureExtractor.encode(e) === value) : f === value;
        return prevFilter (r) && b;
      }

      this.groups.push({label: label, members: [{label: label, filter: filter}]});
    },
    tabChanged: function(currentTabs, previousTabs) {
      (currentTabs.length > previousTabs.length) ? 
        (previousTabs.length > 0) ? this.index = currentTabs.length-1 : this.index = 0 :
        null;
      
      this.$emit("tabs-changed", this.index);
    },    
  },
  template: /*html*/`
    <div>
      <b-tabs content-class="mt-3" @changed="tabChanged" v-model="index">
        <b-tab v-for="(g, i) in groups" v-bind:key="i">
          <template #title>
            <span class="tab-text" v-b-tooltip.hover v-bind:title="g.label">{{g.label}}</span>
            <b-icon v-if="groups.length > 1" icon="x-circle-fill" scale="0.95" class="remove-tab-btn ml-3" @click="$emit('tab-removed', i)"></b-icon>
            <b-icon v-if="groups.length === 1" icon="circle-fill" scale="0.95" class="ml-3" style="color: darkgray;"></b-icon>
          </template>
        </b-tab>
      </b-tabs>    
    </div>
  `,
}