<template>
  <div>
    <div class="row">
      <div class="col">
        <b>Crawls</b>
      </div>
    </div>    
    <div class="row">
      <div class="col">
        <button class="btn btn-outline-primary float-end" data-bs-toggle="modal"
            data-bs-target="#crawl-modal">
          <i icon="bi bi-plus-circle me-2"></i>
          <small>Create crawl</small>
        </button>
      </div>
    </div>
    <div class="row pb-5">
      <div class="col">
        <div class="card mt-3"
          v-for="crawl, index in crawls"
          :key="index" 
          :header="crawl.name" 
          :sub-title="'#' + crawl.tag"
        >
          <div class="card-header">
            <h5 class="card-title">{{ crawl.name }}</h5>
            <h6 class="card-subtitle">{{ crawl.tag }}</h6>
          </div>

          <div class="card-body">
            <p><b>Number of websites:</b> {{crawl.urls.length}}</p>
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
                  <b-button variant="outline-secondary" @click="editCrawl(crawl, index)">
                    <b-icon icon="pencil"></b-icon> Edit
                  </b-button>
                  <b-button variant="outline-danger" @click="deleteCrawl(index)">
                    <b-icon icon="trash"></b-icon> Delete
                  </b-button>          
                </div>
              </div>
            </div>
          </template>
          -->
        </div>
      </div>
    </div>
    <crawl-modal  @save-crawl="saveCrawl"></crawl-modal>
  </div>  
</template>

<script>
import CrawlModal from "../modals/CrawlModal.vue";
import Crawler from "../../model/Crawler.js";

export default {
  components: {
    "CrawlModal": CrawlModal,
  },
  data: () => {
    return {
      currentPage: [],
      crawls: [],
      crawlStats: {},
      activeCrawl: -1,
      tabsCompleted: 0,
      tabsToFinish: 1,
      perPage: 3,
    }
  },
  computed: {
    stats: function() {
      return Object.keys(this.crawlStats)
        .reduce((acc, val) => {
          acc[val] = this.crawlStats[val]
            .map((e) => {
              e.doneAt = new Date(e.doneAt).toLocaleString();
              e.startedAt = new Date(e.startedAt).toLocaleString();
              return e;
            });
          return acc;
        }, {})
    }
  },
  mounted() {
    const self = this;
    chrome.storage.local.get("crawls", (result) => {
      self.crawls = result.crawls || [];
      self.currentPage = new Array(self.crawls.length).fill(1);

      let tags = self.crawls.map((c) => c.tag);
      chrome.storage.local.get(tags, (r) => {
        this.crawlStats = r;
      });
    });

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
  },
  methods: {
    handleCreateModal: function() {
      this.$refs.CrawlModal.showModal(true, {}, this.crawls.map((c) => c.tag));
    },
    saveCrawl(result) {
      let index = result.crawl.index;
      delete result.crawl.index;
      result.crawl.urls = result.crawl.urls.split(/\r\n|\r|\n/g);
      
      chrome.storage.local.set({crawls: (result.createMode) ? 
        (this.crawls.push(result.crawl), this.crawls) :
        (this.crawls.splice(index, 1, result.crawl), this.crawls)
      }, () => {
        this.toast("Crawl saved", "Crawl saved successfully.", "success");
        this.$refs.CrawlModal.clearInputs();
      });
    },
    editCrawl(crawl, index) {
      let obj = {...crawl};
      obj.index = index;
      obj.urls = crawl.urls.join("\r\n");
      this.$refs.CrawlModal.showModal(false, obj, this.crawls.map((c) => c.tag));
    },
    deleteCrawl(index) {
      this.$bvModal.msgBoxConfirm("Are you sure?")
        .then((value) => {
          if (!value) {
            return;
          }

          this.crawls.splice(index, 1);
          chrome.storage.local.set({crawls: this.crawls}, () => {
            this.toast("Crawl deleted", "Crawl deleted successfully.", "danger");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toast: function(title, message, variant) {
      this.$bvToast.toast(message, {
        toaster: "b-toaster-bottom-right",
        title: title,
        autoHideDelay: 5000,
        appendToast: true,
        variant: variant,
      });
    },
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
  },
}
</script>