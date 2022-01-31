var DdgRadarEvaluator = function(mParser) {
  let parser = new mParser();

  return {
    parser: () => parser,

    isLabeled: (r) => {
      if (!isThirdParty(r)) {
        return {
          isLabeled: false,
          rule: null,
          request: r,
          type: null,
        };        
      }

      let entry = parser.rule(new URL(r.url).hostname); 
      for (source of entry) {
        for (resource of source.resources) {
          try {
            if (new RegExp(resource.rule).test(r.url)) {
              return {
                isLabeled: true,
                rule: resource.rule,
                request: r,
              };
            }
          } catch (err) {
          }
        }
      }
      return {
        isLabeled: false,
        rule: null,
        request: r,
      };
    }
  };

};