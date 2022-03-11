<template>
  <div 
    v-if="items.length > 0" 
    class="table-responsive"
  >
    <!-- TODO: CSV Export of table -->
    <table class="table table-sm table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">
            Value
          </th>
          <th 
            v-for="heading, index in headings"
            :key="index"
            scope="col"
          >
            {{ heading }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row, index in page"
          :key="index"
          scope="row"
        >
          <td
            v-for="col, idx in row"
            :key="idx"
            data-bs-toggle="tooltip" 
            data-bs-placement="top" 
            :title="col"
          >
            {{ 
              (idx === 0 && col.length >= view.max) 
                ? col.slice(0, view.max) + " ..."
                : col 
            }}
          </td>
        </tr>
      </tbody>
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
        class="btn "
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
      default: () => []
    }
  },
  data: () => {
    return {
      view: {
        page: 0,
        window: 15,
        max: 64
      },
    };
  },
  computed: {
    first() {
      return this.view.page === 0;
    },
    last() {
      return this.items.length <= ((this.view.page + 1) * this.view.window);
    },
    page() {
      return this.items.slice(this.view.page * this.view.window, (this.view.page + 1) * this.view.window);
    }
  },
  methods: {
  },
};
</script>