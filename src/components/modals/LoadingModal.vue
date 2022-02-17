<template>
  <div id="loading-modal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 v-if="percent < 100" class="modal-title">Loading ...</h5>
          <h5 v-else class="modal-title">Loading complete!</h5>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div class="progress">
                <div
                  class="progress-bar bg-primary"
                  :style="'width: ' + percent + '%'"
                  role="progressbar"
                  :aria-valuenow="loaded"
                  aria-valuemin="0"
                  :aria-valuemax="total"
                >
                  {{ percent }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="percent === 100" class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Proceed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    percent() {
      return Math.round((this.loaded / this.total) * 100);
    },
  },
  props: ["loaded", "total"],
};
</script>