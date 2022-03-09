import Util from "../model/Util.js";

let defaultGroups = 
  [
    "EasyList", 
    "EasyPrivacy", 
    "Disconnect.me"
  ].map((e, i) => ({
    id: Util.randomString(),
    label: e,
    members: [{
      label: "Labeled by",
      filter: (r) => r.labels[i].isLabeled
    }, {
      label: "Not labeled by",
      filter: (r) => !r.labels[i].isLabeled
    }]
  }));

export default [{
  id: Util.randomString(),
  label: "All",
  members: [{
    label: "All http",
    filter: () => true,
  }]}, 
].concat(defaultGroups);