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
    <div class="row pb-5">
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

        <div
          class="card mt-3"
          v-for="(list, index) in lists.all"
          :key="index"
          :header="list.name"
          :sub-title="'#' + list.tag"
        >
          <div class="card-header d-flex align-items-end">
            <h5 class="card-title me-auto">
              {{ list.name }} <small>({{ list.tag }})</small>
            </h5>
            <div>
              <button
                class="btn btn-outline-secondary me-2"
                data-bs-toggle="modal"
                data-bs-target="#website-lists-modal"
                @click="select(index)"
              >
                <i class="bi bi-pencil me-2"></i>
                <small>Edit</small>
              </button>
              <button
                class="btn btn-outline-danger"
                data-bs-toggle="modal"
                data-bs-target="#confirm-modal"
                @click="select(index)"
              >
                <i class="bi bi-x-circle me-2"></i>
                <small>Delete</small>
              </button>
            </div>
          </div>

          <div class="card-body">
            <p>
              <b>Number of websites:</b> {{ Object.values(list.urls).length }}
            </p>
            <p><b>Conducted crawls:</b></p>
          </div>
          <!--
          <template #footer>
            <div class="text-right">
              <div class="row">
                <b-div class="col-8">
                  <div v-if="activeCrawl === index" class="text-left">
                    <h6>Crawl running ...</h6>
                    <b-progress :value="tabsCompleted" :max="tabsToFinish" show-progress animated></b-progress>
                  </div>
                </div>
                <div class="col-4">
                  <b-button variant="outline-primary" @click="handleStartCrawl(index)">
                    <b-icon icon="play"></b-icon> Run crawl
                  </b-button>       
                </div>
              </div>
            </div>
          </template>
          -->
        </div>
      </div>
    </div>
    <website-lists-modal
      :list="lists.selected"
      :tags="this.lists.tags"
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
import Crawler from "../../model/Crawler.js";
import ConfirmModal from "../modals/ConfirmModal.vue";

export default {
  components: {
    WebsiteListsModal,
    ConfirmModal,
  },
  data: () => {
    return {
      lists: {
        all: [],
        tags: [],
        selected: null,
        info: {},
      },
      alert: {
        visible: false,
        message: "",
      },
      activeCrawl: -1,
    };
  },
  mounted() {
    chrome.storage.local.get("lists").then((res) => {
      this.lists.all = res.lists ? Object.values(res.lists) : [];
      this.lists.tags = this.lists.all.map((c) => c.tag);
      chrome.storage.local.get(Object.values(this.lists.tags)).then((r) => {
        this.lists.info = Object.keys(r).reduce((acc, val) => {
          acc[val] = r[val].map((e) => {
            e.doneAt = new Date(e.doneAt).toLocaleString();
            e.startedAt = new Date(e.startedAt).toLocaleString();
            return e;
          });
          return acc;
        }, {});
      });
    });

    /*
    window.addEventListener("crawler:crawlStatus", function(e) {
      self.tabsCompleted = e.detail.crawlStatus.tabsCompleted; 
      self.tabsToFinish = e.detail.crawlStatus.tabsToFinish;
      (e.detail.crawlStatus.doneAt !== 0) ?
        setTimeout(() => {
          (self.crawlStats[e.detail.crawlStatus.tag]) ?
            self.crawlStats[e.detail.crawlStatus.tag].push(e.detail.crawlStatus) :
            self.crawlStats[e.detail.crawlStatus.tag] = [e.detail.crawlStatus];

          self.activeCrawl = -1;
          self.tabsCompleted = 0;
          self.tabsToFinish = 1;
          self.toast("Crawl complete", "Websites have been crawled successfully.", "success")
        }, 5 * 1000) :
        null;
    });
    */
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
        this.lists.tags.push(list.tag);
      }
      this.store("Website list successfully saved.");
    },
    rm() {
      let index = this.lists.all.indexOf(this.lists.selected);
      this.lists.all.splice(index, 1);
      this.store("Website list successfully deleted.");
    },
    store(msg) {
      chrome.storage.local.set({ lists: this.lists.all }).then(() => {
        this.alert.message = msg;
        this.alert.visible = true;
        setTimeout(() => (this.alert.visible = false), 2500);
      });
    },
    /*
    handleStartCrawl: function(index) {
      this.$bvModal.msgBoxConfirm("Are you sure?")
        .then((value) => {
          if (!value) {
            return;
          }
          
          this.activeCrawl = index;
          Crawler.startCrawl(this.listss[index]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    */
  },
};
</script>