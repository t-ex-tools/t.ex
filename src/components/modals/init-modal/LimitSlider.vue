<template>
  <div>
    <div>
      Configure the lower bound to determine the time range of HTTP http to
      load. The upper bound is always configured as the present.
    </div>
    <div class="mt-3">
      <span>{{ new Date(indexes[indexes.length - 1]).toDateString() }}</span>
      <span class="float-end">{{ new Date(indexes[0]).toDateString() }}</span>
    </div>
    <input
      id="limit-range"
      v-model="limit"
      class="form-range mt-1"
      type="range"
      min="0"
      :max="indexes.length - 1"
      @change="updateLimit"
    >
    <div class="mt-2">
      Load request between
      <b>
        {{
          new Date(indexes[indexes.length - 1 - limit]).toDateString() +
            ", " +
            new Date(indexes[indexes.length - 1 - limit]).toLocaleTimeString()
        }}
      </b>
      and now.
    </div>
  </div>
</template>

<script>
export default {
  props: {
    indexes: {
      type: Array,
      default: () => []
    },
  },
  emits: ["update-limit"],
  data: () => {
    return {
      limit: 0,
    };
  },
  mounted() {
    const self = this;
    
    let c = document.getElementById("init-modal-accordion");
    c.addEventListener("show.bs.collapse", function(e) {
      if (e.target.id === "item-0") {
        self.updateLimit();
      }
    });
  },
  methods: {
    updateLimit: function () {
      this.$emit("update-limit", {
        lower: this.indexes[this.indexes.length - 1 - this.limit],
        upper: Date.now(),
        dataTag: new Date(
          this.indexes[this.indexes.length - 1 - this.limit]
        ).toLocaleDateString(),
      });
    },
  },
};
</script>