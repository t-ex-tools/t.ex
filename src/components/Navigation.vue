<template>
  <b>Navigation</b>
  <div class="card card-body mt-3">
    <ul class="nav nav-pills flex-column">
      <li
        v-for="route in staticRoutes"
        :key="route.name"
        class="nav-item"
      >
        <router-link
          class="nav-link"
          :to="route.path"
        >
          {{ route.name }}
        </router-link>
      </li>

      <b class="mt-3">Features</b>
      <li
        v-for="(g, index) in FeatureExtractor.navigation()"
        :key="index"
        class="nav-item dropdown"
      >
        <a
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          href="#"
          role="button"
          aria-expanded="false"
        >{{ g.label }}</a>
        <ul class="dropdown-menu">
          <li
            v-for="feature in g.featureGroup"
            :key="feature.name"
          >
            <router-link
              class="dropdown-item"
              :to="feature.path"
            >
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
import WebsiteLists from "./content/WebsiteLists.vue";
import Overview from "./content/Overview.vue";
import Blocklists from "./content/Blocklists.vue";
import Crawls from "./content/Crawls.vue";
import Export from "./content/Export.vue";
import { markRaw } from "vue";

export default {
  props: {
    dataTag: {
      type: String,
      default: () => ""
    }
  },
  emits: ["routes-changed"],
  data: () => {
    return {
      FeatureExtractor: FeatureExtractor,
      staticRoutes: [
        {
          path: "/",
          name: "Start",
          component: markRaw(Overview),
        },
        {
          path: "/website-lists",
          name: "Website Lists",
          component: markRaw(WebsiteLists),
        },
        {
          path: "/crawls",
          name: "Crawls",
          component: markRaw(Crawls),
        },
        {
          path: "/labeling",
          name: "Labeling",
          component: markRaw(Blocklists),
        },
        {
          path: "/export",
          name: "Export",
          component: markRaw(Export),
        }                
      ],
      routes: [],
    };
  },
  created() {
    this.routes = this.staticRoutes.concat(
      FeatureExtractor.features().map((f) => {
        let featureInfo = FeatureExtractor.info(f);
        return {
          path: "/" + f,
          name: featureInfo.title,
          component: markRaw(Base),
          props: () => {
            return {
              feature: f,
              featureInfo: featureInfo,
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