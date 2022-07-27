export default {
  get: (key) => browser.storage.local.get(key),

  set: (value) => browser.storage.local.set(value),
};