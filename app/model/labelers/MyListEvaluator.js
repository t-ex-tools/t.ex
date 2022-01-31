var MyListEvaluator = function(mParser) {
  let parser = new mParser();

  return {
    parser: () => parser,

    isLabeled: (r) => {
      for (let keyword of parser.rules()) {
        if (r.url.includes(keyword)) {
          return {
            isLabeled: true,
            rule: keyword,
            request: r,
          };
        }
      }
      return {
        isLabeled: false,
        rule: null,
        request: r,
      };;
    }
  };

};