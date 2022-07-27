<template>
  <div>
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
                src="@/assets/images/icon-data-collection.svg"
                class="img-fluid p-1"
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
                  <!-- eslint-disable-next-line -->
                  <router-link to="/website-lists">lists of websites</router-link>
                  to be
                  <!-- eslint-disable-next-line -->
                  <router-link to="/crawls">crawled</router-link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-1">
              <img
                src="@/assets/images/icon-data-labeling.svg"
                class="img-fluid"
                alt=""
              >
            </div>
            <div class="col-md-11">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  Data labeling
                </h5>
                <p class="card-text">
                  Learn about
                  <!-- eslint-disable-next-line -->
                  <router-link to="/labeling">blocklists</router-link>
                  used to label the data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-1">
              <img
                src="@/assets/images/icon-data-inspection.svg"
                class="img-fluid"
                alt=""
              >
            </div>
            <div class="col-md-11">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  Data inspection
                </h5>
                <p class="card-text">
                  Use T.EX to inspect collected data like
                  <!-- eslint-disable-next-line -->
                  <router-link to="/http.url.hostname">requests to hosts</router-link>
                  or
                  <!-- eslint-disable-next-line -->
                  <router-link to="/http.url.query.values">query parameters</router-link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-1">
              <img
                src="@/assets/images/icon-data-export.svg"
                class="img-fluid p-1"
                alt=""
              >
            </div>
            <div class="col-md-11">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  Data export
                </h5>
                <p class="card-text">
                  <!-- eslint-disable-next-line -->
                  <router-link to="/export">Export data</router-link>
                  to further process it in external tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>