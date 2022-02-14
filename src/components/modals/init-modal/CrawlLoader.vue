<template>
  <div>
    <h6>Load a crawl</h6>
    <b-form-text id="password-hint">
      Load the recorded data of a specific crawl you've conducted.
      Only one crawl can be loaded at the same time.
    </b-form-text>      
    <b-form-group class="mt-3">
      <b-form-radio-group buttons stacked
        v-model="selected"
        v-bind:options="options"
        name="radio-btn-stacked"
        button-variant="outline-primary"
        @change="updateLimit">
      </b-form-radio-group>
    </b-form-group>      
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      selected: 0,
      crawls: [],
      options: [],
    }
  },
  props: [],
  mounted() {
    chrome.storage.local.get("crawls", (result) => {
      let crawls = result.crawls || [];

      let tags = crawls.map((c) => c.tag);
      chrome.storage.local.get(tags, (r) => {
        crawls = Object.values(r).reduce((acc, val) => acc.concat(val), []);
        this.options = crawls.map((c, i) => ({
          text: c.tag + " " + new Date(c.startedAt).toLocaleString(),
          startedAt: c.startedAt,
          doneAt: c.doneAt,
          value: i,
        }));
      });
    });
  },
  methods: {
    updateLimit: function(checked) {
      (this.options[checked]) ?
        this.$emit("update-limit", {
          lower: this.options[checked].startedAt, 
          upper: this.options[checked].doneAt,
          dataTag: 
            this.options[checked].text
              .replace(/\:/g, "-")
              .replace(/\,\s/g, "_"),
        })
        : null;
    }
  },
}
</script>