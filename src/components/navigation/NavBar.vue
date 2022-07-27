<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a
        class="navbar-brand"
        href="#"
      >
        T.EX - The Transparency EXtension
        <span class="small">
          v{{ browser.runtime.getManifest().version }}
        </span>
      </a>
      <div class="d-flex">
        <button
          class="btn btn-dark me-2"
          type="button"
          :disabled="!dataLoaded"
          @click="$emit('reset')"
        >
          <i class="bi bi-arrow-clockwise me-2" />
          <small>Reset</small>
        </button>

        <button
          class="btn btn-dark me-2"
          type="button"
          :disabled="dataLoaded"
          data-bs-toggle="modal"
          data-bs-target="#init-modal"
        >
          <i class="bi bi-file-earmark-text me-2" />
          <small v-if="!dataLoaded">Load data</small>
          <small v-else>
            {{ 
              (dataTag.length > max) 
                ? dataTag.slice(0, 32) + " ..." 
                : dataTag
            }} 
            ({{ dataLength }} chunks)
          </small>
        </button>

        <button
          class="btn btn-dark"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#settings-modal"
        >
          <i class="bi bi-gear me-2" />
          <small>Settings</small>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    dataTag: {
      type: String,
      default: () => ""
    },
    dataLength: {
      type: Number,
      default: () => 0
    },
    dataLoaded: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ["reset"],
  data: () => {
    return {
      browser,
      max: 32 
    };
  },
};
</script>

<style scoped>
.navbar {
  background: rgb(0,0,0);
  background: linear-gradient(45deg, rgba(0,0,0,1) 0%, rgba(30,9,121,1) 50%, rgba(0,134,255,1) 100%);
}

.small {
  font-size: 8pt;
}
</style>