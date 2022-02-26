let mainScript = document.createElement("script");
mainScript.setAttribute("type", "module");
mainScript.setAttribute("src", chrome.runtime.getURL("src/content_scripts/index.js"));

let root = document.documentElement || document.head || document.body;
root.insertBefore(mainScript, root.firstChild);

window.addEventListener("cs", (e) => {
  try {
    chrome.runtime.sendMessage(chrome.runtime.id, {js: JSON.parse(e.detail)});
  } catch (err) {
    console.log(err);
  }
});