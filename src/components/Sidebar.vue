<template>
<div>
  <div class="row">
    <div class="col">
      <b>Stats</b>
      <div>
        <div class="row">
          <div class="col">
            <small>
              Requests size (%) of {{max / 1000000}}MB:
            </small>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-progress show-progress
              v-bind:value="requestsSize" 
              v-bind:max="max"
              v-bind:variant="color(requestsSize)">
            </b-progress>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-button 
              class="mt-2 mb-3 float-right" 
              variant="outline-primary" 
              title="Export requests" 
              @click="triggerDownload('requests', requests)">
              <b-icon icon="download"></b-icon> 
              <small>Export requests</small>
            </b-button>
          </div>
        </div>
      </div>
      <div>
        <div class="row">
          <div class="col">
            <small>
              JS events size (%) of {{max / 1000000}}MB:
            </small>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-progress show-progress
              v-bind:value="jsSize" 
              v-bind:max="max"
              v-bind:variant="color(jsSize)">
            </b-progress>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-button 
              class="mt-2 mb-3 float-right" 
              variant="outline-primary" 
              title="Export JS events" 
              @click="triggerDownload('js', js)">
              <b-icon icon="download"></b-icon> 
              <small>Export JS events</small>
            </b-button>
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
    }
  },
  props: ["requests", "js"],
  computed: {
    requestsSize() {
      return Util.memorySizeOf(this.requests);
    },
    jsSize() {
      return Util.memorySizeOf(this.js);
    }
  },
  methods: {
    color(size) {
      let percent = (size / this.max) * 100;
      return (this.warningAt <= percent) ?
        (this.dangerAt <= percent) ?
          "danger"
          : "warning"
        : "success";
    },
    triggerDownload(label, dataSource) {
      this.$emit("trigger-download", {label: label, dataSource: dataSource})
    },
  },
  mounted() {
  },
}
</script>