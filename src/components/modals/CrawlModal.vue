<template>
  <div id="crawl-modal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create or edit crawl</h5>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div v-for="(input, index) in inputs" :key="index" class="mb-3">
                <label :for="'crawl-modal-input-' + index" class="form-label">{{
                  input.label
                }}</label>
                <textarea
                  v-if="input.type === 'textarea'"
                  class="form-control"
                  :class="{
                    'is-valid': valid[input.key],
                    'is-invalid': !valid[input.key],
                  }"
                  :id="'crawl-modal-input-' + index"
                  :placeholder="input.placeholder"
                  v-model="vCrawl[input.key]"
                ></textarea>
                <input
                  v-else
                  type="text"
                  class="form-control"
                  :class="{
                    'is-valid': valid[input.key],
                    'is-invalid': !valid[input.key],
                  }"
                  :id="'crawl-modal-input-' + index"
                  :placeholder="input.placeholder"
                  v-model="vCrawl[input.key]"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="clearInputs"
          >
            Cancel
          </button>
          <button
            v-if="valid['name'] && valid['tag'] && valid['urls']"
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="handleOk"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      inputs: [
        {
          key: "name",
          label: "Name",
          placeholder: "Enter a name for the crawl.",
          type: "text",
        },
        {
          key: "tag",
          label: "Tag",
          placeholder: "Enter a tag for the crawl.",
          type: "text",
        },
        {
          key: "urls",
          label: "Websites",
          placeholder: "Enter the URLs to crawl each in a new line.",
          type: "textarea",
        },
      ],
      vCrawl: { name: "", tag: "", urls: "" },
    };
  },
  props: ["crawl", "tags"],
  computed: {
    valid() {
      return {
        name: this.nameValid(this.vCrawl.name),
        tag: this.tagValid(this.vCrawl.tag),
        urls: this.urlsValid(this.vCrawl.urls),
      };
    },
  },
  methods: {
    clearInputs: function () {
      this.vCrawl = { name: "", tag: "", urls: "" };
    },
    handleOk: function () {
      this.$emit("create-crawl", this.vCrawl);
      this.clearInputs();
    },
    nameValid(value) {
      return value.length > 0;
    },
    tagValid(value) {
      return value.length > 0 && this.tags.indexOf(value) === -1;
    },
    urlsValid(value) {
      for (let url of value.split(/\r\n|\r|\n/g)) {
        try {
          url.startsWith("https://") || url.startsWith("http://")
            ? new URL(url)
            : new URL("https://" + url);
        } catch (err) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>