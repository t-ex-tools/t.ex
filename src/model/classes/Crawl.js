import Storage from "../storage/Storage";

/**
 * The key at which the crawls array is stored in the key-value store.
 */
const key = "crawls";

/**
 * An object (CRAWL_LOG), which represents a crawl log.
 */
const empty = {
  tag: "",
  crawl: "",
  startedAt: 0,
  doneAt: 0,
  tabsOpen: 0,
  tabsOpened: 0,
  tabsCompleted: 0,
  tabsToFinish: 0,
  tabsNotResponding: 0,
  version: browser.runtime.getManifest().version,
};

/**
 * Interface to create and read crawls logs.
 */
export default {

  /**
   * A function to initialize an empty crawl log.
   * @returns {CRAWL_LOG} An empty crawl log.
   */
  log() {
    return { ...empty };
  },
  
  /**
   * A function to retrieve all crawls from the storage
   * or an empty array in case no crawls have been conducted so far.
   * @param {Function} handler - Callback to pass the retrieved crawls to.
   */
   all(handler) {
    Storage
      .get(key)
      .then((res) => {
        let crawls = (res.crawls) ? res.crawls : [];
        handler(crawls);
      });
  },

  /**
   * A (private) function to write crawls to the storage. 
   * Not intended to be used externally.
   * @param {Array<CRAWL_LOG>} crawls - A value that is written to the storage for the key "crawls".
   * @param {Function} handler - Callback to pass the saved crawls array to.
   */
  save(crawls, handler) {
    Storage
      .set({ [key]: crawls })
      .then(() => handler(crawls));
  },

  /**
   * A function to append a crawls log to the existing crawls array.
   * @param {CRAWL_LOG} crawl - The crawls log to be added.
   * @param {Function} handler - Callback to pass the crawls array to.
   */
  add(crawl, handler) {
    this.all((crawls) => {
      crawls.push(crawl);
      this.save(crawls, handler);
    });
  },

};