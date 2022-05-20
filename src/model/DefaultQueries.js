import Data from "./Data.js";
import Util from "./Util.js";
import validator from "validator";
import psl from "psl";

var DefaultQueries = (() => {

  let none = {
    id: Util.randomString(),
    label: "None",
    members: [{
      label: "None",
      filter: () => true,
    }]
  };

  let isTP = (r) => {
    let transformed = (r.interface)
      ? ChunksPreprocessor.transform.js(r)
      : ChunksPreprocessor.transform.http(r);

    let url = psl.get(new URL(transformed.url).hostname);
    let domain = undefined;
    if (transformed.domain) {
      domain = (validator.isURL(transformed.domain)) 
        ? psl.get(new URL(transformed.domain).hostname)
        : transformed.domain;
    }
    
    return url !== domain;
  };

  let fptp = {
    id: Util.randomString(),
    label: "FP v. TP",
    members: [{
      label: "First-party",
      filter: (r) => !isTP(r),
    }, {
      label: "Third-party",
      filter: (r) => isTP(r),
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
      return [none, fptp].concat(defaultGroups);
    }
  }

})();

export default DefaultQueries;