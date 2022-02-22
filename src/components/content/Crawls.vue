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
  <div class="row">
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
</template>

<script>
import ConfirmModal from "../modals/ConfirmModal.vue";
import Crawler from "../../model/Crawler.js";

export default {
  components: {
    ConfirmModal
  },
  props: ["requests"],
  data: () => {
    return {
      Crawler,
      crawls: [],
      crawl: {
        tag: "",
        list: 0,
      },
      lists: [],
      log: {}
    }
  },
  computed: {
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
    
    window.addEventListener("crawler:log", function(e) {
      this.log = e.detail.log;
      if (e.detail.log.doneAt > 0) {
        this.crawls.push(e.detail.log);
        this.log = {};
      }
    });
  },
  methods: { 
  },
}
</script>