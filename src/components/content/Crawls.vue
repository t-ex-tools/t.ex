<template>
  <div class="row">
    <div class="col">
      <b>Crawls</b>
      
    </div>
  </div>    
</template>

<script>
import Crawler from "../../model/Crawler.js";

export default {
  props: ["requests"],
  data: () => {
    return {
    }
  },
  mounted() {
    /*
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
    */    
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
}
</script>