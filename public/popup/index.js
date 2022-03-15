document.getElementById("app-btn").onclick = () => 
  chrome.tabs.create({url: chrome.runtime.getURL("index.html")});

document.getElementById("flush-btn").onclick = () => 
  chrome.runtime.sendMessage({ flush: true });