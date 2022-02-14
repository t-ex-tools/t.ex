import Util from "../../model/Util.js";

export default {
  data: () => {
    return {
      items: [],
      currentPage: 1,
      perPage: 10,
    }
  },
  props: ["requests"],
  watch: {
    requests: {
      immediate: true,
      handler() {
        Util.stream(this.requests, (chunk) => {
          this.items = this.items.concat(chunk);
        });
      },
    },
  },
  mounted() {
  },
  template: /*html*/`
    <div>
      <b-pagination pills
        v-model="currentPage"
        v-bind:total-rows="items.length"
        v-bind:per-page="perPage"
        aria-controls="requests-table"
        align="center"
        limit="10">
      </b-pagination>
      <b-table striped hover fixed stacked small
        id="requests-table"
        class="text-break"
        v-bind:items="items"
        v-bind:current-page="currentPage"
        v-bind:per-page="perPage">
      </b-table>    
    </div>
  `,
}