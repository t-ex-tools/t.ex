var DisconnectMeParser = function() {
  let rules = {};

  return {
    parse: (list) => {
      list = JSON.parse(list);
      Object
        .keys(list.categories)
        .forEach((category) => {
          rules[category] = {};
          list.categories[category]
            .forEach((entity) => {
              Object.keys(entity)
                .forEach((service) => {
                  let url = Object.keys(entity[service])[0]; // NOTE: always a single domain
                  entity[service][url]
                    .forEach((host) => {
                      (!rules[category][host]) ?
                        rules[category][host] = ""
                        : null;
                    })
                })
            })
        })
    },

    rule: (domain) => {
      return Object
        .keys(rules)        
        .filter((category) => rules[category][domain] === "")
    }
  };

};