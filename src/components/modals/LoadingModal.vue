<template>
  <div
    :id="'loading-modal-' + suffix"
    class="modal"
    tabindex="-1"
    data-bs-backdrop="static" 
    data-bs-keyboard="false"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5
            v-if="percent < 100"
            class="modal-title"
          >
            Loading ...
          </h5>
          <h5
            v-else
            class="modal-title"
          >
            Loading complete!
          </h5>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div
                v-if="total > 0"
                class="progress"
              >
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

              <div
                v-else
                class="alert alert-warning show"
                role="alert"
              >
                <strong>Error: received total = 0</strong>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="percent === 100"
          class="modal-footer"
        >
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    suffix: {
      type: String,
      default: () => ""
    },
    loaded: {
      type: Number,
      default: () => 0
    },
    total: {
      type: Number,
      default: () => 0
    }
  },
  computed: {
    percent() {
      return Math.round((this.loaded / this.total) * 100);
    },
  },
};
</script>