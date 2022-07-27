<template>
  <div 
    v-if="items.length > 0" 
    class="table-responsive"
  >
    <table class="table table-sm table-hover align-middle">
      <thead>
        <tr>
          <th
            v-for="(heading, index) in headings"
            :key="index"
            scope="col"
            @click="sort"
          >
            {{ heading }}
            <i
              v-if="view.sort.by === index"
              :class="{
                bi: true,
                'bi-caret-up-fill': view.sort.asc,
                'bi-caret-down-fill': !view.sort.asc,
              }"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(row, index) in page"
          :key="index"
          scope="row"
        >
          <td
            v-for="(col, idx) in row"
            :key="idx"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="col"
            :style="idx === 0 ? 'width: 50%' : ''"
          >
            {{
              idx === 0 && col.length >= view.max
                ? col.slice(0, view.max) + " ..."
                : col
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr scope="row">
          <td
            v-for="sum, index in items[items.length-1]"
            :key="index"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="sum"            
          >
            {{ sum }}
          </td>
        </tr>
      </tfoot>
    </table>

    <div class="d-flex">
      <button
        class="btn me-auto"
        :class="{ 'btn-secondary': first, 'btn-outline-primary': !first }"
        :disabled="first"
        @click="view.page--"
      >
        <i class="bi bi-arrow-left-circle" />
      </button>
      <button
        class="btn"
        :class="{ 'btn-secondary': last, 'btn-outline-primary': !last }"
        :disabled="last"
        @click="view.page++"
      >
        <i class="bi bi-arrow-right-circle" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headings: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      view: {
        page: 0,
        window: 15,
        max: 64,
        sort: {
          by: 0,
          asc: true,
        },
      },
    };
  },
  computed: {
    first() {
      return this.view.page === 0;
    },
    last() {
      return this.items.length <= (this.view.page + 1) * this.view.window;
    },
    page() {
      return [...this.items.slice(0, -1)]
        .sort((a, b) =>
          this.view.sort.by === 0
            ? this.sortString(a, b)
            : this.sortNumber(a, b)
        )
        .slice(
          this.view.page * this.view.window,
          (this.view.page + 1) * this.view.window
        );
    }
  },
  watch: {
    items() {
      this.view.page = 0;
      this.view.sort.by = 0;
      this.view.sort.asc = true;
    },
  },
  methods: {
    sort(e) {
      this.view.page = 0;
      if (this.view.sort.by === e.target.cellIndex) {
        this.view.sort.asc = !this.view.sort.asc;
      } else {
        this.view.sort.by = e.target.cellIndex;
        this.view.sort.asc = true;
      }
    },
    sortString(a, b) {
      return this.view.sort.asc
        ? a[this.view.sort.by].localeCompare(b[this.view.sort.by])
        : b[this.view.sort.by].localeCompare(a[this.view.sort.by]);
    },
    sortNumber(a, b) {
      return this.view.sort.asc
        ? a[this.view.sort.by] - b[this.view.sort.by]
        : b[this.view.sort.by] - a[this.view.sort.by];
    },
  },
};
</script>

<style scoped>
th {
  cursor: pointer;
}
</style>