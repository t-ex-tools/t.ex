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
  template: /*html*/`
    <b-modal 
      ref="loading-modal"
      title="Loading ..."
      header-bg-variant="primary"
      header-text-variant="light"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      hide-footer
      v-model="modalShown">
      <b-row>
        <b-col>
          <b-progress animated 
            class="mb-3"
            v-bind:value="loaded" 
            v-bind:max="total">
          </b-progress>
        </b-col>
      </b-row>
    </b-modal>    
  `,  
}