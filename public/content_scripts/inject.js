let mainScript = document.createElement("script");
mainScript.setAttribute("type", "module");
mainScript.setAttribute("src", browser.runtime.getURL("content_scripts/index.js"));

let root = document.documentElement || document.head || document.body;
root.insertBefore(mainScript, root.firstChild);

let events = [];
window.addEventListener("cs", (e) => {
  if (e.detail === null) {
    return;
  } else {
    events.push(e.detail)
  }
});

let emit = (callback) => {
  try {
    browser.runtime.sendMessage(
      browser.runtime.id, 
      { js: [...events] }
    ).then(() => {
      if (callback) {
        callback();
      }
    });
    events = [];
  } catch (err) {
    console.log(err);
  }
}

browser.runtime
  .onMessage
  .addListener((msg, sender, response) => {
    if (msg.close) {
      emit(response);
    }
    return true;
  });

window.addEventListener("beforeunload", emit());