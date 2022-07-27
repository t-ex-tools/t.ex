import WebsiteLists from "../components/content/WebsiteLists.vue";
import Overview from "../components/content/Overview.vue";
import Blocklists from "../components/content/Blocklists.vue";
import Crawls from "../components/content/Crawls.vue";
import DataSet from "../components/content/DataSet.vue";
import Export from "../components/content/Export.vue";
import { markRaw } from "vue";

export default [
  {
    path: "/",
    label: "Start",
    component: markRaw(Overview),
  },
  {
    path: "/website-lists",
    label: "Website Lists",
    component: markRaw(WebsiteLists),
  },
  {
    path: "/crawls",
    label: "Crawls",
    component: markRaw(Crawls),
  },
  {
    path: "/labeling",
    label: "Labeling",
    component: markRaw(Blocklists),
  },
  {
    path: "/data",
    label: "Data set",
    component: markRaw(DataSet),
  },
  {
    path: "/export",
    label: "Export",
    component: markRaw(Export),
  }                
];