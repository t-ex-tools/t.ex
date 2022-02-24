<template>
  <div class="row mb-3">
    <div class="col">
      <b>Crawls</b>
    </div>
  </div>

  <div v-if="!valid.lists" class="row mb-3">
    <div class="col">
      <div
        class="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        <strong>No website list created yet. Create a website list first!</strong>  
      </div>
    </div>
  </div>

  <div class="row mb-3">
    <div class="col">
      <div class="card border-primary">
        <div class="card-header bg-primary text-white">
          Run crawl
        </div>
        <div class="card-body">
          <div class="row d-flex align-items-center">
            <div class="col-3">
              <input 
                type="text" 
                class="form-control"
                :class="{ 'is-valid': valid.tag, 'is-invalid': !valid.tag }"
                placeholder="AlexaTop10kUS-run-01"
                v-model="crawl.tag"
                :disabled="!valid.lists"
              >     
            </div>
            <div class="col-3">
              <select 
                class="form-select" 
                :class="{ 'is-valid': valid.list, 'is-invalid': !valid.list }"
                v-model="crawl.list"
                :disabled="!valid.lists"
              >
                <option 
                  v-for="list, index in lists" 
                  :key="index" 
                  :value="index"
                >
                  {{ list.name }}
                </option>
              </select>              
            </div>
            <div class="col-1">
              <button
                type="button"
                class="btn btn-outline-danger"
                data-bs-toggle="modal"
                data-bs-target="#confirm-modal"                
                :disabled="!valid.tag || !valid.list || !valid.lists"
              >
                <i class="bi bi-play-circle"></i>
              </button>
            </div>
            <div class="col-5">
              <div 
                v-if="running" 
                class="progress">
                <div
                  class="progress-bar" 
                  role="progressbar" 
                  :style="'width: ' + percent + '%'" 
                  :aria-valuenow="percent" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {{ percent }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>

    <confirm-modal
      title="Start crawl"
      text="Are you sure that you want to start this crawl?"
      @ok="Crawler.start(crawl.tag, lists[crawl.list])"
    >
    </confirm-modal>
  </div>

  <div v-if="this.crawls.length > 0" class="row">
    <div class="col">
      <table class="table table-hover align-middle mt-3">
        <thead>
          <th scope="col">Tag</th>
          <th scope="col">Started</th>
          <th scope="col">Finished</th>
          <th scope="col">Tabs opened</th>
          <th scope="col">Tabs completed</th>
        </thead>
        <tbody>
          <tr 
            v-for="(crawl, index) in crawls.slice(view.page * view.window, (view.page + 1) * view.window)"
            :key="index"
          >
            <td>{{ crawl.tag }}</td>
            <td>{{ new Date(crawl.startedAt).toLocaleString() }}</td>
            <td>{{ new Date(crawl.doneAt).toLocaleString() }}</td>
            <td>{{ crawl.tabsOpened }}</td>
            <td>{{ crawl.tabsCompleted }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else class="row mt-3">
    <div class="col">
      <div class="card card-body">
        No crawls conducted yet.
      </div>
    </div>
  </div>

  <div v-if="crawls.length > 0" class="d-flex">
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
</template>

<script>
import ConfirmModal from "../modals/ConfirmModal.vue";
import Crawler from "../../model/Crawler.js";

export default {
  components: {
    ConfirmModal
  },
  props: ["http"],
  data: () => {
    return {
      Crawler,
      crawls: [],
      crawl: {
        tag: "",
        list: 0,
      },
      lists: [],
      log: {},
      view: {
        page: 0,
        window: 5,
      },
    }
  },
  computed: {
    first() {
      return this.view.page === 0;
    },
    last() {
      return Object.values(this.crawls).length <= ((this.view.page + 1) * this.view.window)
    },
    valid() {
      return {
        tag: this.crawl.tag.length > 0,
        list: this.crawl.list < Object.values(this.lists).length,
        lists: Object.values(this.lists).length > 0
      };
    },
    percent() {
      return Math.round((this.log.tabsCompleted / this.log.tabsToFinish) * 100);
    },
    running() {
      return this.log.hasOwnProperty("startedAt")
        && this.log.startedAt > 0
        && this.log.hasOwnProperty("doneAt")
        && this.log.doneAt === 0;
    }
  },
  mounted() {
    chrome.storage.local.get(["crawls", "lists"])
      .then((res) => {
        this.crawls = (res.crawls) ? res.crawls : [];
        this.lists = (res.lists) ? res.lists : [];
      }); 
    
    const self = this;
    window.addEventListener("crawler:log", function(e) {
      self.log = e.detail.log;
      if (e.detail.log.doneAt > 0) {
        self.crawls.push(e.detail.log);
        self.log = {};
      }
    });
  }
}
</script>