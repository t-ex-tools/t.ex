<template>

  <div id="loading-modal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Loading ...</h5>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div class="progress">
                <div
                  class="progress-bar bg-primary"
                  :style="'width: ' + loaded + '%'"
                  role="progressbar"
                  :aria-valuenow="loaded"
                  aria-valuemin="0"
                  :aria-valuemax="total"
                >
                  {{ loaded }}
                </div>
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
  data: () => {
    return {
      modalShown: false,
    }
  },
  props: ["loaded", "total"],
  watch: {
    immediate: true,
    loaded: {
      handler: function(n) {
        (n >= this.total) ? this.resetModal() : null;
      },
    },
  },
  methods: {
    showModal() {
      this.modalShown = true;
    },
    resetModal() {
      this.modalShown = false;
    },
  },
}
</script>