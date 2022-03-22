<template>
  <div class="card card-body">
    <div class="row">
      <div class="col">
        <b>Stats</b>
        <div
          v-for="(dataType, index) in ['http', 'js']"
          :key="index"
        >
          <div class="row">
            <div class="col">
              <small>
                {{ dataType.charAt(0).toUpperCase() + dataType.slice(1) }} size
                (%) of {{ max / 1000000 }}MB:
              </small>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="progress">
                <div
                  :class="
                    'progress-bar ' + 'bg-' + color(percent(size(dataType)))
                  "
                  :style="'width: ' + percent(size(dataType)) + '%'"
                  role="progressbar"
                  :aria-valuenow="size(dataType)"
                  aria-valuemin="0"
                  :aria-valuemax="max"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Util from "../model/Util.js";

export default {
  props: {
    http: {
      type: Array,
      default: () => []
    },
    js: {
      type: Array,
      default: () => []
    }
  },
  data: () => {
    return {
      max: 8 * 1000000,
      warningAt: 75,
      dangerAt: 95,
    };
  },
  methods: {
    size(dataType) {
      return Util.memorySizeOf(this[dataType]);
    },
    percent(size) {
      return Math.round((size / this.max) * 100);
    },
    color(percent) {
      return this.warningAt <= percent
        ? this.dangerAt <= percent
          ? "danger"
          : "warning"
        : "success";
    }
  },
};
</script>