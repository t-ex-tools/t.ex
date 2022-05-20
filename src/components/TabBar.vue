<template>
  <div>
    <ul 
      class="nav nav-tabs" 
      role="tablist"
    >
      <li
        v-for="(q, i) in queries"
        :key="i"
        class="nav-item"
        role="presentation"
      >
        <button
          :class="{ 'nav-link': true, 'active': i === selectedIndex}"
          aria-current="page"
          role="tab"
          @click="$emit('tabs-changed', i)"
        >
          {{ q.label }}

          <div 
            v-if="isLoading && i === selectedIndex" 
            class="spinner-border spinner-border-sm" 
            role="status"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    queries: {
      type: Array,
      default: () => []
    },
    selectedIndex: {
      type: Number,
      default: () => 0
    },
    isLoading: {
      type: Boolean,
      default: () => false
    }    
  },
  emits: ["tabs-changed"]
};
</script>

<style scoped>
.tab-text {
  max-width: 200px;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.remove-tab-btn {
  color: darkgray;
}
.remove-tab-btn:hover {
  color: red;
}
</style>