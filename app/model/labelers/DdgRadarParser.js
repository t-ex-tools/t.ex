var DdgRadarParser = function() {
  let rules = {};

  return {
    parse: (list) => rules = JSON.parse(list),

    rule: (hostname) => {
      let domain = hostname.replace("www.", "");
      return (rules[domain]) ? 
        rules[domain] 
        : (rules[hostname]) ?
          rules[hostname]
          : [];
    }, 
  };

};