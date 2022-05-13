var BlocklistsFeatures = (() => {

  let features = Blocklists
    .filter((l) => l.active)
    .map((l, i) => {
      return {
        ["http.labels." + i + ".isLabeled"]: {
          title: "Labeled by " + l.name,
          subtitle: "Whether a request matches a rule of " + l.name,
          impl: (r) => r.labels[i].isLabeled,
          lom: 1,
          cardinalityType: 1
        }, 
        ["http.labels." + i + ".rule"]: {
          title: l.name + " rules",
          subtitle: "Matched rules of " + l.name,
          impl: (r) => r.labels[i].rule,
          lom: 1,
          cardinalityType: 1
        }, 
        ["http.labels." + i + ".type"]: {
          title: "Type of " + l.name + " rules",
          subtitle: "The rule category of " + l.name + ", if applicable",
          impl: (r) => r.labels[i].type,
          lom: 1,
          cardinalityType: 1
        }
      };
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