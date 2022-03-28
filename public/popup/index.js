document.getElementById("app-btn").onclick = () => 
  browser.tabs.create({url: browser.runtime.getURL("index.html")});

document.getElementById("flush-btn").onclick = () => 
  browser.runtime.sendMessage({ flush: true });