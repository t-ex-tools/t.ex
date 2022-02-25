<template>
  <div
    id="website-lists-modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Create or edit website list
          </h5>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div
                v-for="(input, index) in inputs"
                :key="index"
                class="mb-3"
              >
                <label
                  :for="'website-lists-modal-input-' + index"
                  class="form-label"
                >{{
                  input.label
                }}</label>
                <textarea
                  v-if="input.type === 'textarea'"
                  :id="'website-lists-modal-input-' + index"
                  v-model="vList[input.key]"
                  class="form-control"
                  :class="{
                    'is-valid': valid[input.key],
                    'is-invalid': !valid[input.key],
                  }"
                  :placeholder="input.placeholder"
                />
                <input
                  v-else
                  :id="'website-lists-modal-input-' + index"
                  v-model="vList[input.key]"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-valid': valid[input.key],
                    'is-invalid': !valid[input.key],
                  }"
                  :placeholder="input.placeholder"
                >
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
            v-if="valid['name'] && valid['urls']"
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
const empty = { name: "", urls: "" };

export default {
  props: {
    list: {
      type: Object,
      default: () => {}
    }
  },
  emits: ["save-list"],
  data: () => {
    return {
      inputs: [
        {
          key: "name",
          label: "Name",
          placeholder: "Enter a name for the list.",
          type: "text",
        },
        {
          key: "urls",
          label: "Websites",
          placeholder: "Enter the URLs to list in a new line each.",
          type: "textarea",
        },
      ],
      vList: {...empty},
    };
  },
  computed: {
    valid() {
      return {
        name: this.nameValid(this.vList.name),
        urls: this.urlsValid(this.vList.urls),
      };
    },
  },
  watch: {
    list: function (n) {
      this.vList = (n) ? {...n} : {...empty}
    },
  },
  methods: {
    clearInputs: function () {
      this.vList = {...empty};
    },
    handleOk: function () {
      this.$emit("save-list", this.vList);
      this.clearInputs();
    },
    nameValid(value) {
      return value.length > 0;
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