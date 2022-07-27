import WebsiteLists from "../pages/WebsiteLists.vue";
import Overview from "../pages/Overview.vue";
import Blocklists from "../pages/Blocklists.vue";
import Crawls from "../pages/Crawls.vue";
import DataSet from "../pages/DataSet.vue";
import Export from "../pages/Export.vue";
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