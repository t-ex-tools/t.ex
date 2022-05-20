var BlocklistsFeatures = (() => {

  let suffix = (label) => " (" + label.toUpperCase() + ")";

  let features = Blocklists
    .filter((l) => l.active)
    .map((l, i) => {
      return ["http", "js"]
        .map((label) => ({
          [label + ".labels." + i + ".isLabeled"]: {
            title: "Labeled by " + l.name + suffix(label),
            subtitle: "Whether a data item matches a rule of " + l.name,
            impl: (r) => r.labels[i].isLabeled,
            lom: 1,
            cardinalityType: 1
          }, 
          [label + ".labels." + i + ".rule"]: {
            title: l.name + " rules" + suffix(label),
            subtitle: "Matched rules of " + l.name + suffix(label),
            impl: (r) => r.labels[i].rule,
            lom: 1,
            cardinalityType: 1
          }, 
          [label + ".labels." + i + ".type"]: {
            title: "Type of " + l.name + " rules" + suffix(label),
            subtitle: "The rule category of " + l.name + ", if applicable",
            impl: (r) => r.labels[i].type,
            lom: 1,
            cardinalityType: 1
          }, 
          [label + ".labels." + i + ".cached"]: {
            title: "Cached " + l.name + " results" + suffix(label),
            subtitle: "Whether a result of " + l.name + " was cached or not",
            impl: (r) => r.labels[i].type.includes("(cached)"),
            lom: 1,
            cardinalityType: 1
          }
        }))
        .reduce((acc, val) => 
          Object.assign(acc, val),
          {}
        );
    });

  return {
    features: () => features
      .reduce((acc, val) => 
        Object.assign(acc, val), 
        {}
      ),
  };

})();

export default BlocklistsFeatures;