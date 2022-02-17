<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">T.EX</a>
      <div class="d-flex">
        <button
          class="btn btn-primary p-1 me-2"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#init-modal"
        >
          <i class="bi bi-gear me-2"></i>
          <small>Load data</small>
        </button>

        <button
          class="btn btn-primary p-1"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#settings-modal"
        >
          <i class="bi bi-gear me-2"></i>
          <small>Settings</small>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data: () => {
    return {};
  },
  props: [],
};
</script>