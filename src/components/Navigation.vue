<template>
<div>
  <b-nav vertical>
    <b>General</b>  
    <b-nav-item 
      v-for="route in staticRoutes" 
      v-bind:key="route.name" 
      v-bind:to="route.path">
      {{route.name}}
    </b-nav-item>
    
    <hr />
    
    <b>Features</b>
    <b-nav-item-dropdown
      v-for="(g, index) in FeatureExtractor.navigation()"
      v-bind:key="index"
      v-bind:text="g.label"
      toggle-class="nav-link-custom"
      right>
      <b-dropdown-item 
        v-for="feature in g.featureGroup" 
        v-bind:key="feature.name" 
        v-bind:to="feature.path">
        {{feature.name}}
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </b-nav>
</div>  
</template>

<script>
import FeatureExtractor from "../model/FeatureExtractor.js";
import Base from "./Base.js";
import RequestsTable from "./content/RequestsTable.js";
import Graph from "./content/Graph.js";
import Crawl from "./content/Crawl.js";
import JsTable from "./content/JsTable.js";
import Overview from "./content/Overview.js";
import Blocklists from "./content/Blocklists.js";

export default {
  data: () => {
    return {
      FeatureExtractor: FeatureExtractor,
      staticRoutes: [{
        path: "/",
        name: "Overview",
        component: Overview,
      }, {
        path: "/requests",
        name: "Requests",
        component: RequestsTable,
      }, {
        path: "/js",
        name: "JS",
        component: JsTable,
      }, {
        path: "/blocklists",
        name: "Blocklists",
        component: Blocklists,
      }, {
        path: "/graph",
        name: "Graph",
        component: Graph,
      }, {
        path: "/crawl",
        name: "Crawl",
        component: Crawl,
      }],
      routes: [],
    }
  },
  components: {
    "Base": Base,
    "Graph": Graph,
    "Crawl": Crawl,
    "RequestsTable": RequestsTable,
  },
  props: ["groups", "selectedIndex", "dataTag"],
  created() {
    this.routes = this.staticRoutes.concat(FeatureExtractor.features().map((f) => {
      let featureInfo = FeatureExtractor.info(f);
      return {
        path: "/" + f,
        name: featureInfo.title,
        component: Base,
        props: () => {
          // NOTE:  When a tab is closed, activate-tab event is fired twice.
          //        Once with wrong old index and once with corrected index,
          //        thus the unnecessary check if group exists at index,
          //        while assuming there is always a group at index = 0.
          let index = (this.groups[this.selectedIndex]) ? this.selectedIndex : 0;
          return {
            queries: this.groups[index].members,
            feature: f,
            featureInfo: featureInfo,
            tabIndex: index,
            dataTag: this.dataTag,
          };
        },
      };
    }));
  },
  watch: {
    routes: function (routes) {
      this.$emit("routes-changed", routes);
    },
  },
}
</script>