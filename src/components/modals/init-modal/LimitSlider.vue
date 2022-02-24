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
      class="form-range mt-1"
      v-model="limit"
      type="range"
      min="0"
      :max="indexes.length - 1"
      @change="updateLimit"
    />
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
  data: () => {
    return {
      limit: 0,
    };
  },
  props: ["indexes"],
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