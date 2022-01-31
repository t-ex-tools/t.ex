var MyListParser = function() {
  let rules = [];

  return {
    parse: (list) => rules = list.split("\r\n"),

    rules: () => rules, 
  };

};