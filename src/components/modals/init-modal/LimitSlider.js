export default {
  data: () => {
    return {
      indexes: [],
      limit: 0,
    }
  },
  props: [],
  mounted() {
    chrome.storage.local.get("indexes", (result) => {
      this.indexes = result.indexes || this.indexes;
      this.limit = 0;
      this.updateLimit();
    });
  },
  methods: {
    updateLimit: function() {
      this.$emit("update-limit", {
        lower: this.indexes[(this.indexes.length-1)-this.limit], 
        upper: Date.now(),
        dataTag: new Date(this.indexes[(this.indexes.length-1)-this.limit]).toLocaleDateString(),
      });
    }
  },
  template: /*html*/`
    <div>
      <h6>Select time range</h6>
      <b-form-text id="password-hint">
        Configure the lower bound to determine the time range of HTTP requests to load. 
        The upper bound is always configured as the present.
      </b-form-text>
      <div class="mt-3">
        <span>{{new Date(indexes[indexes.length-1]).toDateString()}}</span>
        <span class="float-right">{{new Date(indexes[0]).toDateString()}}</span>
      </div>
      <b-form-input 
        id="limit-range" 
        class="mt-1" 
        v-model="limit" 
        type="range" 
        min="0" 
        v-bind:max="indexes.length-1"
        @change="updateLimit">
      </b-form-input>
      <div class="mt-2">
        Load request between 
        <b>
        {{ 
          new Date(indexes[(indexes.length-1)-limit]).toDateString() + ", " +
          new Date(indexes[(indexes.length-1)-limit]).toLocaleTimeString() 
        }}
        </b>
        and now.
      </div>
    </div>   
  `,  
}