import Storage from "../storage/Storage.js";

/**
 * The key at which the websites lists array is stored in the key-value store.
 */
const key = "lists";

/**
 * Interface to create / read / update / and delete website lists.
 * WEBSITE_LIST - must be an object containing two properties: "name" and "urls".
 * e.g. { "name": "Website List 1", "urls": [ "http://01.example.com", "http://02.example.com", ... ] }
 */
export default {
  
  /**
   * A function to retrieve all website lists from the storage
   * or an empty array in case no lists have been stored so far.
   * @param {Function} handler - Callback to pass the retrieved lists to.
   */
  all(handler) {
    Storage
      .get(key)
      .then((res) => {
        let lists = (res.lists) ? res.lists : [];
        handler(lists);
      });
  },

  /**
   * A (private) function to write lists to the storage. 
   * Not intended to be used externally.
   * @param {Array<WEBSITE_LIST>} lists - A value that is written to the storage for the key "lists".
   * @param {Function} handler - Callback to pass the updated website lists array to.
   */
  save(lists, handler) {
    Storage
      .set({ [key]: lists })
      .then(() => handler(lists));
  },

  /**
   * A function to retrieve the i-th website list.
   * @param {Number} index - Index of the desired website list.
   * @param {Function} handler - Callback to pass the desired website list to.
   */
  get(index, handler) {
    this.all((lists) => {
      handler(lists[index]);
    });
  },

  /**
   * A function to override the i-th website list with a new value.
   * @param {Number} index  - Index of the website to be overriden.
   * @param {WEBSITE_LIST} list - The new value of the i-th website list.
   * @param {Function} handler - Callback to pass the updated website lists array to.
   */
  set(index, list, handler) {
    this.all((lists) => {
      lists[index] = list;
      this.save(lists, handler);
    });

  },

  /**
   * A function to append a website list to the existing website lists array.
   * @param {WEBSITE_LIST} list - The website list to be added.
   * @param {Function} handler - Callback to pass the updated website lists array to.
   */
  add(list, handler) {
    this.all((lists) => {
      lists.push(list);
      this.save(lists, handler);
    });
  },

  /**
   * A function to remove the i-th website list from the existing website lists array.
   * @param {Number} index - The index of the website list to be removed.
   * @param {Function} handler - Callback to pass the updated website lists array to.
   */
  remove(index, handler) {
    this.all((lists) => {
      lists.splice(index, 1);
      this.save(lists, handler);
    });
  },

};