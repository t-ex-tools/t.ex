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
import model from "../../../model/index.js";

export default {
  emits: ["update-limit"],
  data: () => {
    return {
      selected: 0,
      crawls: [],
    };
  },
  mounted() {
    const self = this;
    self.load();

    let elem = document.getElementById("init-modal");
    elem.addEventListener("show.bs.modal", function() {
      self.load();
    });

    let c = document.getElementById("init-modal-accordion");
    c.addEventListener("show.bs.collapse", function(e) {
      if (e.target.id === "item-1") {
        self.updateLimit();
      }
    });
  },
  methods: {
    load: function() {
      model.Storage.get("crawls")
      .then((res) => {
        this.crawls = (res.crawls) ? res.crawls : [];
      });
    },
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