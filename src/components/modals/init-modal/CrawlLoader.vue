<template>
  <div>
    <div>
      Load the recorded data of a specific crawl you've conducted. Only one
      crawl can be loaded at the same time.
    </div>

    <select
      v-if="options.length > 0"
      class="form-select"
      aria-label="Default select example"
      size="5"
      @update="updateLimit"
    >
      <option v-for="(option, index) in options" :key="index" :value="index">
        {{ option.label }}
      </option>
    </select>

    <div class="card card-body bg-light mt-2" v-else>No crawls yet.</div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      selected: 0,
      crawls: [],
      options: [],
    };
  },
  props: [],
  mounted() {
    chrome.storage.local.get("crawls", (result) => {
      let crawls = (result.crawls) ? Object.values(result.crawls) : [];
      let tags = crawls.map((c) => c.tag);
      chrome.storage.local.get(Object.values(tags), (r) => {
        crawls = Object.values(r).reduce((acc, val) => acc.concat(val), []);
        this.options = crawls.map((c, i) => ({
          label: c.tag + " " + new Date(c.startedAt).toLocaleString(),
          startedAt: c.startedAt,
          doneAt: c.doneAt,
          value: i,
        }));
      });
    });
  },
  methods: {
    updateLimit: function (checked) {
      this.options[checked]
        ? this.$emit("update-limit", {
            lower: this.options[checked].startedAt,
            upper: this.options[checked].doneAt,
            dataTag: this.options[checked].label
              .replace(/\:/g, "-")
              .replace(/\,\s/g, "_"),
          })
        : null;
    },
  },
};
</script>