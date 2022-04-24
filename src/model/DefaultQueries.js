import Data from "./Data.js";
import Util from "./Util.js";

var DefaultQueries = (() => {

  let none = {
    id: Util.randomString(),
    label: "None",
    members: [{
      label: "None",
      filter: () => true,
    }]
  };
  
  let defaultGroups = [];
  Data.blocklists((lists) => {
    defaultGroups = lists
      .filter((l) => l.active)
      .map((l, i) => ({
        id: Util.randomString(),
        label: l.name,
        members: [{
          label: "Labeled by",
          filter: (r) => r.labels[i].isLabeled
        }, {
          label: "Not labeled by",
          filter: (r) => !r.labels[i].isLabeled
        }]
      }));
  });

  return {
    groups: () => {
      return [none].concat(defaultGroups);
    }
  }

})();

export default DefaultQueries;