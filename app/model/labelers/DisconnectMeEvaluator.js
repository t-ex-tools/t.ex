var DisconnectMeEvaluator = function(mParser) {
  let parser = new mParser();

  let isThirdParty = (r) => {
    try {
      let source = new URL(r.source);
      let target = new URL(r.url);
      return source.hostname !== target.hostname;
    } catch (err) {
      return false;
    }    
  }  

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

      let domain = new URL(r.url).hostname.split(".").slice(-2).join("."); // TODO: not properly
      let res = parser.rule(domain);
      return {
        isLabeled: res.length > 0,
        rule: (res.length > 0) ? domain: null,
        request: r,
        type: res,
      };
    }
  };

};