import Util from "../model/Util.js";

export default [{
  label: "All",
  members: [{
    id: Util.randomString(),
    label: "All requests",
    filter: () => true,
  }]}, 
];