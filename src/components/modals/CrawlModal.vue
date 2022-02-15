<template>
  <b-modal 
    ref="crawl-modal"
    v-model="modalShown"
    title="Create crawl"
    header-bg-variant="primary"
    header-text-variant="light"
    @ok="handleOk">
    <div class="row">
      <div class="col">
        <b-form-group 
          v-if="!createMode"
          label="Index:" 
          label-for="crawl-index">
          <b-form-input 
            id="crawl-index" 
            v-model="crawl.index"
            disabled>
          </b-form-input>
        </b-form-group>
        
        <b-form-group 
          label="Name:" 
          label-for="crawl-name">
          <b-form-input 
            id="crawl-name" 
            v-model="crawl.name"
            :state="nameValid"
            placeholder="Enter a name for the crawl.">
          </b-form-input>
        </b-form-group>

        <b-form-group 
          label="Tag:" 
          label-for="crawl-tag">
          <b-form-input 
            id="crawl-tag" 
            v-model="crawl.tag"
            :state="tagValid" 
            placeholder="Enter a tag for the crawl.">
          </b-form-input>
        </b-form-group>

        <b-form-group 
          label="URLs:" 
          label-for="crawl-urls">
          <b-form-textarea
            id="crawl-urls"
            v-model="crawl.urls"
            :state="urlsValid"
            placeholder="Enter the URLs to crawl each in a new line."
            rows="4"
            max-rows="8">
          </b-form-textarea>
        </b-form-group>
      </div>
    </div>
  </b-modal>  
</template>

<script>
export default {
  data: () => {
    return {
      crawl: {index: "", name: "", tag: "", urls: ""},
      createMode: false,
      modalShown: false,
      existingTags: [],
    }
  },
  computed: {
    nameValid() {
      return this.crawl.name.length > 0;
    },
    tagValid() {
      return this.crawl.tag.length > 0 && this.existingTags.indexOf(this.crawl.tag) === -1;
    },
    urlsValid() {
      for (let url of this.crawl.urls.split(/\r\n|\r|\n/g)) {
        try {
          (url.startsWith("https://") || url.startsWith("http://")) ?
            new URL(url) : 
            new URL("https://" + url);
        } catch(err) {
          return false;
        }
      }
      return true;
    },
  },
  methods: {
    showModal: function(createMode, crawl, existingTags) {
      this.createMode = createMode;
      if (!createMode) {
        this.crawl = crawl;
      }
      this.modalShown = true;
      this.existingTags = existingTags;
    },
    resetModal: function() {
      this.modalShown = false;
    },
    clearInputs: function() {
      this.crawl = {index: "", name: "", tag: "", urls: ""};
    },
    handleOk: function() {
      if (!this.nameValid || !this.tagValid || !this.urlsValid) {
        return;
      }
      this.$emit("save-crawl", {crawl: {...this.crawl}, createMode: this.createMode});
    },
  },
}
</script>