<template>
  <div>
    <div class="row">
      <div class="col">
        <b>Stats</b>
        <div>
          <div class="row">
            <div class="col">
              <small> Requests size (%) of {{ max / 1000000 }}MB: </small>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="progress">
                <div
                  :class="'progress-bar' + 'bg-' + color(percent(requestsSize))"
                  :style="'width: ' + percent(requestsSize) + '%'"
                  role="progressbar"
                  :aria-valuenow="requestsSize"
                  aria-valuemin="0"
                  :aria-valuemax="max"
                >
                  {{ percent(requestsSize) }}%
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button
                class="btn btn-outline-primary mt-2 mb-3 float-right"
                type="button"
                @click="triggerDownload('requests', requests)"
              >
                <i class="bi bi-download me-2"></i>
                <small>Export requests</small>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div class="row">
            <div class="col">
              <small> JS events size (%) of {{ max / 1000000 }}MB: </small>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="progress">
                <div
                  :class="'progress-bar' + 'bg-' + color(percent(jsSize))"
                  :style="'width: ' + percent(jsSize) + '%'"
                  role="progressbar"
                  :aria-valuenow="jsSize"
                  aria-valuemin="0"
                  :aria-valuemax="max"
                >
                  {{ percent(jsSize) }}%
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button
                class="btn btn-outline-primary mt-2 mb-3 float-right"
                type="button"
                @click="triggerDownload('js', js)"
              >
                <i class="bi bi-download me-2"></i>
                <small>Export JS events</small>
              </button>
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
  data: () => {
    return {
      max: 768 * 1000000,
      warningAt: 75,
      dangerAt: 95,
    };
  },
  props: ["requests", "js"],
  computed: {
    requestsSize() {
      return Util.memorySizeOf(this.requests);
    },
    jsSize() {
      return Util.memorySizeOf(this.js);
    },
  },
  methods: {
    percent(size) {
      return (size / this.max) * 100;
    },
    color(percent) {
      return this.warningAt <= percent
        ? this.dangerAt <= percent
          ? "danger"
          : "warning"
        : "success";
    },
    triggerDownload(label, dataSource) {
      this.$emit("trigger-download", { label: label, dataSource: dataSource });
    },
  },
  mounted() {},
};
</script>