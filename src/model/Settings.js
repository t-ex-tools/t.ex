export default {
  darkMode: {
    label: "Dark Mode",
    description: "Enable dark mode for less illuminated night shifts.",
    type: "checkbox",
    default: false,
    handler: (value) => {
      let link = document.getElementById("bootstrap-theme"); 
      link.href = (value) 
        ? "/css/bootstrap-night.css"
        : "/css/bootstrap.min.css";
    }
  },
  backgroundRecording: {
    label: "Background recording",
    description: "Enable background recording of HTTP/S and JavaScript data.",
    type: "checkbox",
    default: false
  },
  httpBody: {
    label: "HTTP Body",
    description: "Record data that was transmitted in the HTTP body",
    type: "checkbox",
    default: false
  },
  tabsAtOnce: {
    label: "Tabs at once",
    description: "Max. number of tabs opened simultaneously during a crawl",
    type: "number",
    default: 20
  },
  tabTtl: {
    label: "Tab TTL",
    description: "Time-to-live of a tab for websites that load too long during a crawl (in seconds)",
    type: "number",
    default: 60
  },
  chunkSize: {
    label: "Chunk size",
    description: "Max. number of HTTP requests contained in a single chunk",
    type: "number",
    default: 2500
  },
  jsChunkSize: {
    label: "JS Chunk size",
    description: "Max. number of JavaScript events contained in a single chunk",
    type: "number",
    default: 15000
  }
}