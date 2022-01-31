var EasyListParser = function() {
  let rules = [];
  let index = {err: []};
  let exceptionIndex = {err: []};

  const matchAddressPart = /^(?!(\||\@))/;
  const matchDomain = /^\|\|/
  const matchExactDomain = /^\|(?!(\|))/
  const matchException = /^\@\@/;
  const matchRegExp = /^\/.+\/\$/;

  let indexByUrl = (rule, i, symbol, target) => {
    if (rule && rule.startsWith(symbol)) {
      try {
        if (rule.includes("*")) {
          throw "error";
        }

        let url = new URL(encodeURI(rule
          .replace(symbol, "https://")
          .replace("^", "")
        ));

        (target[url.hostname]) ?
        target[url.hostname].push(i)
          : target[url.hostname] = [i];
      } catch(err) {
        target.err.push(i);
      }
    }
  }

  let parseList = (list) => {
    rules = list
      .split("\n")
      .slice(1)
      .filter((rule) => !(
        rule.startsWith("!") ||
        rule.match(/\#(\@?|\??|\$?)\#/) ||
        rule.match(matchRegExp) ||
        rule === ""
      ))
      .map((rule, i) => {
        let pRule = rule.split("$");        
        let options = parseOptions(pRule[1]);
        regExp = toRegExp(pRule[0], (options && options["match-case"]));

        indexByUrl(pRule[0], i, "||", index);
        indexByUrl(pRule[0], i, "@@||", exceptionIndex);

        return {
          rule: rule,
          parsedRule: regExp,
          options: options,
        };
      });
  };

  let parseOptions = (optionsPart) => {
    let options = (optionsPart) ?
      optionsPart
        .split(",")
        .map((option) => {
          let kv = option.split("=");
          let result = {};
          result[kv[0]] = (kv[1]) ? kv[1].split("|") : [];
          return result; 
        })
        .reduce((acc, val) => {
          let key = Object.keys(val)[0];
          acc[key] = val[key];
          return acc;
        }, {})
      : null;
    return options;
  };  

  // NOTE:  taken from Takano et al.
  //        doi: 10.13052/jsn2445-9739.2017.006
  let toRegExp = (rule, matchCase) => {
    return new RegExp(rule
      .replace("@@", "")
      .replace("||", "")
      .replace(/\*+/g, "*") 
      .replace(/\^\|$/, "^")
      .replace(/\W/g, "\\$&")
      .replace(/\\\*/g, ".*")
      .replace(/\\\^/g, "(?:[\\x00-\\x24\\x26-\\x2C\\x2F\\x3A-\\x40\\x5B-\\x5E\\x60\\x7B-\\x7F]|$)")
      .replace(/^\\\|\\\|/, "^[\\w\\-]+:\\/+(?!\\/)(?:[^\\/]+\\.)?")
      .replace(/^\\\|/, "^")
      .replace(/\\\|$/, "$")
      .replace(/^(\.\*)/, "")
      .replace(/(\.\*)$/, ""),
      (matchCase) ? "" : "i"
    );
  };

  return {
    parse: (list) => parseList(list),

    rules: (index) => rules[index],

    index: (hostname, isException) => (isException) ? 
      exceptionIndex[hostname] || []
      : index[hostname] || [],

    byAddressPart: () => rules
      .filter((r) => r.rule.match(matchAddressPart)),

    byDomain: () => rules
      .filter((r) => r.rule.match(matchDomain)),
    
    byExactDomain: () => rules
      .filter((r) => r.rule.match(matchExactDomain)),

    byException: () => rules
      .filter((r) => r.rule.match(matchException)),    
  };

};