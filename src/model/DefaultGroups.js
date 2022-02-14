import Util from "../model/Util.js";

let defaultGroups = 
  [
    "EasyList", 
    "EasyPrivacy", 
    "Disconnect.me"
  ].map((e, i) => ({
    label: e,
    members: [{
      id: Util.randomString(),
      label: "Labeled by",
      filter: (r) => r.labels[i].isLabeled
    }, {
      id: Util.randomString(),
      label: "Not labeled by",
      filter: (r) => !r.labels[i].isLabeled
    }]
  }));

export default [{
  label: "All",
  members: [{
    id: Util.randomString(),
    label: "All requests",
    filter: () => true,
  }]}, 
].concat(defaultGroups);