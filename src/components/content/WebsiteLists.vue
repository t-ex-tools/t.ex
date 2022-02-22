<template>
  <div>
    <div class="row">
      <div class="col">
        <b>Website Lists</b>
      </div>
      <div class="col">
        <button
          class="btn btn-outline-primary float-end"
          data-bs-toggle="modal"
          data-bs-target="#website-lists-modal"
          @click="select(null)"
        >
          <i class="bi bi-plus-circle me-2"></i>
          <small>Create list</small>
        </button>
      </div>
    </div>
    <div v-if="lists.all.length > 0" class="row">
      <div class="col">
        <div
          v-if="alert.visible"
          class="alert alert-success alert-dismissible fade show mt-3"
          role="alert"
        >
          <strong>{{ alert.message }}</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>

        <table class="table table-hover align-middle mt-3">
          <thead>
            <th scope="col">Name</th>
            <th scope="col">URLs</th>
            <th scope="col">Actions</th>
          </thead>
          <tbody>
            <tr 
              v-for="(list, index) in lists.all.slice(view.page * view.window, (view.page + 1) * view.window)"
              :key="index"
            >
              <td>{{ list.name }}</td>
              <td>{{ urlInfo[index] }}</td>
              <td>
                <button
                  class="btn btn-outline-secondary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#website-lists-modal"
                  @click="select(view.page * view.window + index)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-outline-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#confirm-modal"
                  @click="select(view.page * view.window + index)"
                >
                  <i class="bi bi-x-circle"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="row mt-3">
      <div class="col">
        <div class="card card-body">
          No website lists created yet.
        </div>
      </div>
    </div>

    <div v-if="lists.all.length > 0" class="d-flex">
      <button
        class="btn me-auto"
        :class="{ 'btn-secondary': first, 'btn-outline-primary': !first }"
        @click="view.page--"
        :disabled="first"
      >
        <i class="bi bi-arrow-left-circle"></i>
      </button>
      <button
        class="btn "
        :class="{ 'btn-secondary': last, 'btn-outline-primary': !last }"
        @click="view.page++"
        :disabled="last"
      >
        <i class="bi bi-arrow-right-circle"></i>
      </button>
    </div>

    <website-lists-modal
      :list="lists.selected"
      @save-list="save"
    >
    </website-lists-modal>

    <confirm-modal
      title="Delete website list"
      text="Are you sure that you want to delete this website list?"
      @ok="rm"
    >
    </confirm-modal>
  </div>
</template>

<script>
import WebsiteListsModal from "../modals/WebsiteListsModal.vue";
import ConfirmModal from "../modals/ConfirmModal.vue";

export default {
  components: {
    WebsiteListsModal,
    ConfirmModal,
  },
  data: () => {
    return {
      view: {
        page: 0,
        window: 5,
        preview: 5
      },
      lists: {
        all: [],
        selected: null,
      },
      alert: {
        visible: false,
        message: "",
      }
    };
  },
  computed: {
    first() {
      return this.view.page === 0;
    },
    last() {
      return this.lists.all.length <= ((this.view.page + 1) * this.view.window)
    },
    urlInfo() {
      return this.lists.all
        .map((l) => {
          let urls = l.urls.split(/\r\n|\r|\n/g);
          return (urls.length <= this.view.preview) ?
            urls.join(", ")
            : urls.slice(0, this.view.preview).join(", ") + " and " + (urls.length - this.view.preview) + " more.";
        });
    }
  },
  mounted() {
    chrome.storage.local.get("lists").then((res) => {
      this.lists.all = res.lists ? Object.values(res.lists) : [];
    });
  },
  methods: {
    select: function (index) {
      this.lists.selected = null;
      this.$nextTick(function () {
        this.lists.selected = this.lists.all[index];
      });
    },
    save(list) {
      if (this.lists.selected) {
        let index = this.lists.all.indexOf(this.lists.selected);
        this.lists.all[index] = list;
      } else {
        this.lists.all.push(list);
      }
      this.store("Website list successfully saved.");
    },
    rm() {
      let index = this.lists.all.indexOf(this.lists.selected);
      this.lists.all.splice(index, 1);
      this.store("Website list successfully deleted.");
      if (!this.first && this.last) {
        this.view.page--;
      }
    },
    store(msg) {
      chrome.storage.local.set({ lists: this.lists.all }).then(() => {
        this.alert.message = msg;
        this.alert.visible = true;
        setTimeout(() => (this.alert.visible = false), 2500);
      });
    }
  },
};
</script>