import API from "./Interfaces.js";

export default (() => {

  let inject = (w) => {
    API.interfaces().forEach((api) => {
      let x = null;
      if (api.label === "window") {
        x = w;
      } else {
        if (w.hasOwnProperty(api.label)) {
          x = w[api.label].prototype;
        } else {
          return;
        }
      }

      api.properties.forEach((p) => {
        let pd = Object.getOwnPropertyDescriptor(x, p);
        if (!pd) {
          return;
        }

        Object.defineProperty(x, p, {
          get: function () {
            let result = pd.get.apply(this);

            window.dispatchEvent(new CustomEvent("js", {
              detail: evt({
                interface: api.label,
                property: p,
                method: "get",
                result: srlzRslt(result)
              })
            }));

            return result;
          },
          set: function () {
            window.dispatchEvent(new CustomEvent("js", {
              detail: evt({
                interface: api.label,
                property: p,
                method: "set",
                arguments: Array.from(arguments)
              })
            }));

            pd.set.apply(this, arguments);
          }
        });
      });

      api.methods.forEach((m) => {
        let om = x[m];
        if (!om) {
          return;
        }

        Object.defineProperty(x, m, {
          value: function () {
            let result = om.apply(this, arguments);

            window.dispatchEvent(new CustomEvent("js", {
              detail: evt({
                interface: api.label,
                method: m,
                arguments: Array.from(arguments),
                result: srlzRslt(result)
              })
            }));

            return result;
          }
        });
      });
    });
  };

  let injectMethods = () => {
    API.elementMethods.forEach((m) => {
      let om = Document.prototype[m];
      Object.defineProperty(Document.prototype, m, {
        value: function () {
          return om.apply(this, arguments);
        }
      });
    });
  };

  let parseStack = (stack) => {
    // https://stackoverflow.com/a/3809435
    // from Daveo's answer on Sep 28, 2010 at 3:15
    let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig;
    let match = stack.match(re);

    return (match)
      ? [...new Set(
        match.map((s) => {
          let url = s.split(":");
          return url[0] + ":" + url[1];
        })
      )][0]
      : null;
  };

  let evt = (e) => {
    let url = parseStack((new Error()).stack);
    return Object.assign({
      url: (url) ? url : window.location.href,
      source: window.location.href,
      type: "script",
      timeStamp: Date.now()
    }, e);
  };

  let srlzRslt = (result) => {
    if (result &&
      typeof result === "object" &&
      result.toString) {
      result = result.toString();
    }

    return result;
  }

  return {
    inject: (w) => {
      try {
        inject(window);
        injectMethods();
      } catch (err) {
        console.log(err)
      }
    }
  };

})();