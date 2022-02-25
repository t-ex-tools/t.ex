import API from "./interfaces.js";

let inject = (w) => {
  API.interfaces(w).forEach((api) => {
    api.properties.forEach((p) => {
      let pd = Object.getOwnPropertyDescriptor(api.interface, p);
      if (!pd) {
        return;
      }

      Object.defineProperty(api.interface, p, {
        get: function () {
          let result = pd.get.apply(this);
          window.dispatchEvent(new CustomEvent("js", {
            detail: {
              interface: api.label,
              property: p,
              method: "get",
              result: result,
              stack: parseStack((new Error()).stack),
              url: window.location.href,
              timeStamp: Date.now()
            }
          }));
          return result;
        },
        set: function () {
          window.dispatchEvent(new CustomEvent("js", {
            detail: {
              interface: api.label,
              property: p,
              method: "set",
              arguments: arguments,
              stack: parseStack((new Error()).stack),
              url: window.location.href,
              timeStamp: Date.now()
            }
          }));
          pd.set.apply(this, arguments);
        }
      });
    });

    api.methods.forEach((m) => {
      let om = api.interface[m];
      if (!om) {
        return;
      }

      Object.defineProperty(api.interface, m, {
        value: function () {
          let result = om.apply(this, arguments);
          window.dispatchEvent(new CustomEvent("js", {
            detail: {
              interface: api.label,
              method: m,
              arguments: arguments,
              result: result,
              stack: parseStack((new Error()).stack),
              url: window.location.href,
              timeStamp: Date.now()
            }
          }));
          return result;
        }
      });
    });
  });
};

let injectIframe = (elem) => {
  try {
    (elem && elem.tagName.toUpperCase() === "IFRAME" && elem.contentWindow) ?
      inject(elem.contentWindow) :
      null;
  } catch (err) {
    console.log(err);
  }
};

let parseStack = (stack) => {
  // https://stackoverflow.com/a/3809435
  let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig;
  let match = stack.match(re);
  return (match) ? [...new Set(match
    .map((s) => {
      let url = s.split(":");
      return url[0] + ":" + url[1];
    }))
  ] : [];
};

try {
  inject(window);
} catch (err) {
  console.log(err)
}

API.elementMethods.forEach((m) => {
  let om = Document.prototype[m];
  Object.defineProperty(Document.prototype, m, {
    value: function () {
      let elem = om.apply(this, arguments);
      let elemType = Object.prototype.toString.call(elem);

      if (elemType === "[object HTMLCollection]" || elemType === "[object NodeList]") {
        for (let e of elem) {
          injectIframe(e)
        }
      } else {
        injectIframe(elem);
      }

      return elem;
    }
  });
});

let events = [];
window.addEventListener("js", (e) => {
  events.push(e.detail);
});

window.addEventListener("beforeunload", () => {
  window.dispatchEvent(new CustomEvent("cs", { detail: JSON.stringify(events) }));
});