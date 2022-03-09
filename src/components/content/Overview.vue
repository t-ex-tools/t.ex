<template>
  <div class="row mb-3">
    <div class="col">
      <b>Overview</b>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-1">
            <img
              src="@/assets/icon-data-collection.svg"
              class="img-fluid"
              alt=""
            >
          </div>
          <div class="col-md-11">
            <div class="card-body">
              <h5 class="card-title fw-bold">
                Data collection
              </h5>
              <p class="card-text">
                You can use T.EX to collect data by specifying
                <router-link to="/website-lists">
                  lists of websites
                </router-link>
                to be
                <router-link to="/crawls">
                  crawled.
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Util from "../../model/Util.js";

export default {
  props: {
    http: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>