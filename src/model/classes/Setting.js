import Storage from "../storage/Storage.js";
import config from "../config/Settings.js";

/**
 * The key at which the settings array is stored in the key-value store.
 */
const key = "settings";

/**
 * Interface to read and update settings.
 */
export default {

  /**
   * A function to initialize an empty crawl log.
   * @returns {CRAWL_LOG} An empty crawl log.
   */
  config() {
    return config;
  },

  /**
   * A function to initialize an empty crawl log.
   * @returns {CRAWL_LOG} An empty crawl log.
   */
   default() {
    let res = Object
      .keys(config)
      .map((key) => ({ [key]: config[key].default }))
      .reduce((acc, val) => Object.assign(acc, val), {});
    return res;
  },  
  
  /**
   * A function to retrieve all settings from the storage
   * or an empty object in case no settings have been set so far.
   * @param {Function} handler - Callback to pass the retrieved settings to.
   */
   all(handler) {
    Storage
      .get(key)
      .then((res) => {
        let settings = (res.settings) ? res.settings : this.default();
        handler(settings);
      });
  },

  /**
   * A (private) function to write settings to the storage. 
   * Not intended to be used externally.
   * @param {Object} settings - A value that is written to the storage for the key "settings".
   * @param {Function} handler - Callback to pass the saved settings object to.
   */
  save(settings, handler) {
    Storage
      .set({ [key]: settings })
      .then(() => handler(settings));
  },

  /**
   * A function to retrieve a single or multiple settings.
   * @param {Number} index - Index of the desired website list.
   * @param {Function} handler - Callback to pass the desired website list to.
   */
   get(requested, handler) {
    this.all((settings) => {
      let res = requested
        .map((key) => ({
          [key]: (settings[key])
            ? (settings[key])
            : (config[key].default)
        }))
        .reduce((acc, val) => 
          Object.assign(acc, val),
          {}
        );
      handler(res);
    });
  },

  set(key, value, handler) {
    this.all((settings) => {
      settings[key] = value;
      this.save(settings, handler);
    });
  },

};