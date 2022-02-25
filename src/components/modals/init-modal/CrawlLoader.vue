<template>
  <div>
    <div>
      Load the recorded data of a specific crawl you've conducted. Only one
      crawl can be loaded at the same time.
    </div>

    <select
      v-if="crawls.length > 0"
      v-model="selected"
      class="form-select"
      size="5"
      @change="updateLimit"
    >
      <option
        v-for="(option, index) in crawls"
        :key="index"
        :value="index"
      >
        {{ option.tag }} ({{ new Date(option.startedAt).toLocaleString() }})
      </option>
    </select>

    <div
      v-else
      class="card card-body bg-light mt-2"
    >
      No crawls yet.
    </div>
  </div>
</template>

<script>
export default {
  emits: ["update-limit"],
  data: () => {
    return {
      selected: 0,
      crawls: [],
    };
  },
  mounted() {
    chrome.storage.local.get("crawls")
      .then((res) => {
        this.crawls = (res.crawls) ? res.crawls : [];
      });
  },
  methods: {
    updateLimit: function () {
      this.$emit("update-limit", {
        lower: this.crawls[this.selected].startedAt,
        upper: this.crawls[this.selected].doneAt,
        dataTag: this.crawls[this.selected].tag
      });
    },
  },
};
</script>