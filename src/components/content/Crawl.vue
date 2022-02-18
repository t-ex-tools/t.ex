<template>
  <div>
    <div class="row">
      <div class="col">
        <b>Crawls</b>
      </div>
      <div class="col">
        <button 
          class="btn btn-outline-primary float-end" 
          data-bs-toggle="modal"
          data-bs-target="#crawl-modal"
          @click="select(null)"
        >
          <i class="bi bi-plus-circle me-2"></i>
          <small>Create crawl</small>
        </button>
      </div>
    </div>
    <div class="row pb-5">
      <div class="col">

        <div v-if="alert.visible" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>{{ alert.message }}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        <div class="card mt-3"
          v-for="crawl, index in crawl.all"
          :key="index" 
          :header="crawl.name" 
          :sub-title="'#' + crawl.tag"
        >
          <div class="card-header">
            <h5 class="card-title float-start">
              {{ crawl.name }} <small>({{ crawl.tag }})</small>
            </h5>
            <div class="float-end">
              <button 
                class="btn btn-outline-secondary me-2" 
                data-bs-toggle="modal"
                data-bs-target="#crawl-modal"
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
            <p><b>Number of websites:</b> {{ Object.values(crawl.urls).length }}</p>
            <p><b>Conducted crawls:</b></p>
            <!--
            <b-pagination pills
              v-if="crawlStats[crawl.tag] && crawlStats[crawl.tag].length > perPage"
              v-model="currentPage[index]"
              :total-rows="(crawlStats[crawl.tag]) ? crawlStats[crawl.tag].length : 0"
              :per-page="perPage"
              :aria-controls="'requests-table-' + index"
              align="center"
              :limit="perPage">
            </b-pagination>
            <b-table striped hover
              :id="'requests-table-' + index"
              :items="stats[crawl.tag]"
              :current-page="currentPage[index]" 
              :per-page="perPage">
            </b-table>
            -->
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
    <crawl-modal 
      :crawl="crawl.selected"
      :tags="this.crawl.tags"
      @save-crawl="save"
    >
    </crawl-modal>
    <confirm-modal
      title="Delete crawl"
      text="Are you sure that you want to delete this crawl?"
      @ok="rm"
    >
    </confirm-modal>
  </div>  
</template>

<script>
import CrawlModal from "../modals/CrawlModal.vue";
import Crawler from "../../model/Crawler.js";
import ConfirmModal from "../modals/ConfirmModal.vue";

export default {
  components: {
    CrawlModal,
    ConfirmModal
  },
  data: () => {
    return {
      crawl: {
        all: [],
        tags: [],
        selected: null,
        info: {}
      },
      alert: {
        visible: false,
        message: "",
      },
      activeCrawl: -1,
    }
  },
  mounted() {
    chrome.storage.local.get("crawls")
      .then((res) => {
        this.crawl.all = (res.crawls) ? Object.values(res.crawls) : [];
        this.crawl.tags = this.crawl.all.map((c) => c.tag);
        chrome.storage.local.get(Object.values(this.crawl.tags))
          .then((r) => {
            this.crawl.info = Object
              .keys(r)
              .reduce((acc, val) => {
                acc[val] = r[val]
                  .map((e) => {
                    e.doneAt = new Date(e.doneAt).toLocaleString();
                    e.startedAt = new Date(e.startedAt).toLocaleString();
                    return e;
                  });
                return acc;
              }, {})
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
    select: function(index) {
      this.crawl.selected = null;
      this.$nextTick(function() {
        this.crawl.selected = this.crawl.all[index];
      });
    },
    save(crawl) {
      if (this.crawl.selected) {
        let index = this.crawl.all.indexOf(this.crawl.selected);
        this.crawl.all[index] = crawl;
      } else {
        this.crawl.all.push(crawl);
        this.crawl.tags.push(crawl.tag);
      }
      this.store("Crawl successfully saved.");
    },
    rm() {
      let index = this.crawl.all.indexOf(this.crawl.selected);
      this.crawl.all.splice(index, 1);
      this.store("Crawl successfully deleted.");
    },
    store(msg) {
      chrome.storage.local.set({ crawls: this.crawl.all })
        .then(() => {
          this.alert.message = msg;
          this.alert.visible = true;
          setTimeout(() => this.alert.visible = false, 2500);
        });
    }
    /*
    handleStartCrawl: function(index) {
      this.$bvModal.msgBoxConfirm("Are you sure?")
        .then((value) => {
          if (!value) {
            return;
          }
          
          this.activeCrawl = index;
          Crawler.startCrawl(this.crawls[index]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    */
  },
}
</script>