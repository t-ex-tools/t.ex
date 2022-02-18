<template>
  <div class="card card-body">
    <ul class="nav nav-pills flex-column">
      <b>Navigation</b>
      <li class="nav-item" v-for="route in staticRoutes" :key="route.name">
        <router-link class="nav-link" :to="route.path">
          {{ route.name }}
        </router-link>
      </li>

      <hr />

      <b>Statistics</b>
      <li
        class="nav-item dropdown"
        v-for="(g, index) in FeatureExtractor.navigation()"
        :key="index"
      >
        <a
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          href="#"
          role="button"
          aria-expanded="false"
          >{{ g.label }}</a
        >
        <ul class="dropdown-menu">
          <li v-for="feature in g.featureGroup" :key="feature.name">
            <router-link class="dropdown-item" :to="feature.path">
              {{ feature.name }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import FeatureExtractor from "../model/FeatureExtractor.js";
import Base from "./Base.vue";
import Graph from "./content/Graph.vue";
import WebsiteLists from "./content/WebsiteLists.vue";
import Overview from "./content/Overview.vue";
import Blocklists from "./content/Blocklists.vue";

export default {
  data: () => {
    return {
      FeatureExtractor: FeatureExtractor,
      staticRoutes: [
        {
          path: "/",
          name: "Start",
          component: Overview,
        },
      ].concat(
        [
          {
            path: "/blocklists",
            name: "Labeling",
            component: Blocklists,
          },
          {
            path: "/graph",
            name: "Network",
            component: Graph,
          },
          {
            path: "/website-lists",
            name: "Website Lists",
            component: WebsiteLists,
          },
        ].sort((a, b) => a.name.localeCompare(b.name))
      ),
      routes: [],
    };
  },
  props: ["groups", "selectedIndex", "dataTag"],
  created() {
    this.routes = this.staticRoutes.concat(
      FeatureExtractor.features().map((f) => {
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
            let index = this.groups[this.selectedIndex]
              ? this.selectedIndex
              : 0;
            return {
              queries: this.groups[index].members,
              feature: f,
              featureInfo: featureInfo,
              tabIndex: index,
              dataTag: this.dataTag,
            };
          },
        };
      })
    );
    this.$emit("routes-changed", this.routes);
  },
};
</script>