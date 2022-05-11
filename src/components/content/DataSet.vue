<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <b>Data set</b>
      </div>
    </div>

    <div
      v-if="!dataLoaded"
      class="row mb-3"
    >
      <div class="col">
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>
            No data loaded yet. Use the <b>Load data</b> 
            button at the top right to load data.
          </strong>  
        </div>
      </div>
    </div>    

    <div class="row">
      <div class="col">
        <div 
          v-if="loading.isLoading" 
          class="progress"
        >
          <div
            class="progress-bar bg-primary"
            :style="'width: ' + percent + '%'"
            role="progressbar"
            :aria-valuenow="loading.loaded"
            aria-valuemin="0"
            :aria-valuemax="loading.total"
          >
            {{ percent }}%
          </div>
        </div>

        <table class="table align-middle mt-3">
          <thead>
            <tr>
              <th scope="col">
                Data set name
              </th>
              <th scope="col">
                No. chunks
              </th>
              <th scope="col">
                No. HTTP/S requests & responses
              </th>
              <th scope="col">
                No. JavaScript API access events
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ dataTag }}</td>
              <td>{{ dataLength }}</td>
              <td>{{ sizes.http.toLocaleString("en-US") }}</td>
              <td>{{ sizes.js.toLocaleString("en-US") }}</td>
            </tr>
          </tbody>
        </table>        
      </div>
    </div>
  </div>
</template>

<script>
import Data from "../../model/Data.js";

export default {
  props: {
    dataTag: {
      type: String,
      default: () => ""
    },
    dataLength: {
      type: Number,
      default: () => 0
    },
    dataLoaded: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => {
    return {
      loading: { 
        isLoading: false, 
        loaded: 0, 
        total: 0 
      },
      sizes: {
        http: 0,
        js: 0
      }
    }
  },
  computed: {
    percent() {
      return Math.round((this.loading.loaded / this.loading.total) * 100);
    }
  },
  watch: {
    dataLoaded() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      Data.chunks((chunks, loaded, total) => {
        this.loading.isLoading = true;
        this.loading.loaded = loaded;
        this.loading.total = total;

        this.sizes.http += chunks
          .reduce((acc, val) => acc += val.http.size, 0);
        this.sizes.js += chunks
          .reduce((acc, val) => acc += val.js.size, 0);

        if (loaded === total) {
          this.loading.isLoading = false;
          this.loading.loaded = 0;
          this.loading.total = -1;
        }
      });      
    }
  }
};
</script>