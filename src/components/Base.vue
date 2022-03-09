<template>
  <div class="pb-5">
    <tab-bar
      :groups="groups.default"
      :selected-index="groups.selectedIndex"
      @tabs-changed="() => null"
      @tab-removed="() => null"
    />

    <div
      v-if="false"
      class="row"
    >
      <div class="col">
        <div class="card card-body m-2">
          No results found.
        </div>
      </div>
    </div>

    <div
      v-else
      class="row"
    >
      <div class="col">
        <div
          class="card card-body m-2"
          :title="featureInfo.title"
          :sub-title="featureInfo.subtitle"
        >
          <div
            v-if="loading.isLoading"
            class="progress"
          >
            <div
              class="progress-bar bg-primary"
              :style="'width: ' + loading.loaded + '%'"
              role="progressbar"
              :aria-valuenow="loading.loaded"
              aria-valuemin="0"
              :aria-valuemax="loading.total"
            >
              {{ loading.loaded }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Statistics from "../model/Statistics.js";
import Util from "../model/Util.js";
import defaultGroups from "../model/DefaultGroups.js";
import TabBar from "./TabBar.vue";

const empty = { isLoading: false, loaded: 0, total: 0 };

export default {
  components: {
    TabBar
  },
  props: {
    http: {
      type: Array,
      default: () => []
    },
    js: {
      type: Array,
      default: () => []
    },
    feature: {
      type: String,
      default: () => ""
    },
    featureInfo: {
      type: Object,
      default: () => {}
    },
    tag: {
      type: String,
      default: () => ""
    },
  },
  data: () => {
    return {
      groups: {
        default: defaultGroups,
        selectedIndex: 0
      },
      loading: { ...empty },
    };
  },
  watch: {
    feature: {
      immediate: false,
      handler: function () {
        // TODO: in case feature changes issue new query
        // Statistics.query(this.http, this.groups.default[this.selectedIndex], this.feature, Util.randomString())
      },
    },
  },
  mounted() {
    // TODO: query
    Statistics.query(Object.values(this.http), this.groups.default[this.selectedIndex], this.feature, Util.randomString())
    
    window.addEventListener("statistics:loading:update", (e) => {
      if (e.detail.loaded === e.detail.total) {
        this.loading = { ...empty };
      } else {
        this.loading.isLoading = true;
        this.loading.loaded = e.detail.loaded;
        this.loading.total = e.detail.total;
      }
    });
  },
  methods: {
  },
};
</script>