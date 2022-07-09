<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <b>Export</b>
      </div>
    </div>

    <div 
      v-if="!dataLoaded" 
      class="row"
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
          id="types"
          class="accordion"
        >
          <div 
            v-for="(type, index) in types" 
            :key="index" 
            class="accordion-item"
          >
            <h2 
              :id="'heading-' + index"
              class="accordion-header"
            >
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapse-' + index"
                aria-expanded="true"
                :aria-controls="'collapse-' + index"
              >
                {{ labels.types[type] }}
              </button>
            </h2>
            <div
              :id="'collapse-' + index"
              class="accordion-collapse collapse"
              :aria-labelledby="'heading-' + index"
              data-bs-parent="#types"
            >
              <div class="accordion-body">
                <div
                  v-for="(group, i) in groups(type)"
                  :key="i"
                  class="table-responsive mb-3"
                >
                  <b>{{ group.label }}</b>
                  <table class="table table-hover align-middle mt-1">
                    <thead>
                      <th scope="col">
                        Feature
                      </th>
                      <th scope="col">
                        Description
                      </th>
                      <th
                        v-for="q, j in DefaultQueries.groups()"
                        :key="j"
                        scope="col"
                        class="text-center"
                      >
                        {{ q.label }}
                      </th>
                      <th 
                        class="text-end"
                        scope="col"
                      >
                        Data
                      </th>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="(feature, j) in group.featureGroup" 
                        :key="j"
                      >
                        <td style="width: 15%">
                          {{ feature.name }}
                        </td>
                        <td style="width: 30%">
                          {{ feature.subtitle }}
                        </td>
                        <td
                          v-for="q, k in DefaultQueries.groups()"
                          :key="k"
                        >
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input mx-auto"
                              :name="k"
                              type="checkbox"
                              role="switch"
                              @change="query(feature.path, q, $event)"
                            >
                          </div>                          
                        </td>
                        <td>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input float-end"
                              :name="feature.path"
                              type="checkbox"
                              role="switch"
                              @change="select"
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <button
          class="btn btn-outline-primary float-end"
          type="button"
          :disabled="Object.keys(queries).length === 0 || !dataLoaded"
          data-bs-toggle="modal"
          :data-bs-target="'#loading-modal-' + suffix"
          @click="statistics"
        >
          <i class="bi bi-download me-2" />
          <small>
            Export statistics
          </small>
        </button>

        <button
          class="btn btn-outline-primary float-end me-2"
          type="button"
          :disabled="features.length === 0 || !dataLoaded"
          data-bs-toggle="modal"
          :data-bs-target="'#loading-modal-' + suffix"
          @click="download(true)"
        >
          <i class="bi bi-download me-2" />
          <small>Export {{ features.length }} features</small>
        </button>

        <button
          v-for="(type, index) in types"
          :key="index"
          class="btn btn-outline-primary float-end me-2"
          type="button"
          :disabled="!dataLoaded"
          data-bs-toggle="modal"
          :data-bs-target="'#loading-modal-' + suffix"
          @click="
            () => {
              selected = index;
              download(false);
            }
          "
        >
          <i class="bi bi-download me-2" />
          <small>Export {{ labels.types[type] }}</small>
        </button>
      </div>
    </div>

    <loading-modal 
      :suffix="suffix"
      :loaded="view.loaded"
      :total="view.total"
    />
  </div>
</template>

<script>
import FeatureExtractor from "../../model/FeatureExtractor.js";
import LoadingModal from "../modals/LoadingModal.vue";
import Data from "../../model/Data.js";
import Util from "../../model/Util.js";
import DefaultQueries from "../../model/DefaultQueries.js";
import { toRaw } from "vue";
import Statistics from "../../model/Statistics.js";

export default {
  components: {
    LoadingModal,
  },
  props: {
    dataLoaded: {
      type: Boolean,
      default: () => false
    },    
    dataTag: {
      type: String,
      default: () => "",
    },
  },
  data: () => {
    return {
      suffix: "export",
      FeatureExtractor,
      DefaultQueries,
      labels: {
        types: {
          http: "HTTP/S requests & responses",
          js: "JavaScript API accesses",
        },
      },
      view: {
        loaded: 0,
        total: -1,
      },
      selected: 0,
      features: [],
      queries: {},
      data: {},
      memoryLimit: 250 * 1000000,
    };
  },
  computed: {
    types() {
      return [
        ...new Set(
          FeatureExtractor.features().map((f) => f.split(".").shift())
        ),
      ];
    },
  },
  mounted() {
    const self = this;
    let c = document.getElementById("types");
    c.addEventListener("show.bs.collapse", function (e) {
      let tmp = e.target.id.split("-").pop();
      if (self.selected !== tmp) {
        self.selected = tmp;
        self.features = [];
        self.queries = {};
        [...document.querySelectorAll(".form-check-input")].forEach(
          (n) => (n.checked = false)
        );
      }
    });

    window.addEventListener("statistics:loading:update", (e) => {
      this.view.loaded = e.detail.loaded;
      this.view.total = e.detail.total;
    });
  },
  methods: {
    nest(base, names) {
      for (var i = 0; i < names.length; i++) {
        base = base[names[i]] = base[names[i]] || {};
      }
    },
    groups(type) {
      return FeatureExtractor.navigation().filter(
        (f) => f.featureGroup[0].path.split(".").shift() === type
      );
    },
    select(e) {
      if (e.target.checked) {
        this.features.push(e.target.name);
      } else {
        this.features.splice(this.features.indexOf(e.target.name), 1);
      }
    },
    query(feature, query, e) {
      if (!this.queries[feature]) {
        this.queries[feature] = [];
      }
      
      if (e.target.checked) {
        this.queries[feature].push(query);
      } else {
        let index = this.queries[feature].findIndex((q) => q.id === query.id);
        this.queries[feature].splice(index, 1);
      }
    },
    statistics() {
      Statistics.query(
        this.types[this.selected],
        toRaw(this.queries),
        (info) => {
          let query = DefaultQueries.groups().find((q) => q.id === info.query);
          
          if (info.loaded !== info.total) {
            return
          }

          if (!this.data[info.query]) {
            this.data[info.query] = { [info.group]: { [info.feature]: info.data } };
          } else {
            this.data[info.query][info.group] = { [info.feature]: info.data };
          }
          
          
          if (info.group !== query.members.length - 1) {
            return;
          }

          let headings = Util.headings(query); 
          
          Util
            .options()
            .forEach((option) => {
              Util.download(
                Util.csv(
                  headings,
                  Util.table(
                    headings,
                    this.data[info.query],
                    info.feature,
                    option.impl
                  )
                ),
                'csv',
                this.dataTag,
                info.feature,
                option.slug,
                query.label
              )
            });

          /*
          * TODO:
          * 1. Data to Table
          * 2. Table different representations (e.g. % of total)
          * 3. Download each table
          */
        }
      )
    },
    download(transformed) {
      let type = this.types[this.selected];

      let batch = [];
      let n = 0;

      Data.stream(type, (chunk, loaded, total) => {
        this.view.loaded = loaded;
        this.view.total = total;

        if (chunk === null) {
          return;
        }

        if (transformed) {
          chunk = chunk.map((d) => {
            let output = this.features.reduce((acc, f) => {
              let path = f.split(".").slice(1);
              let last = path.pop();

              // https://stackoverflow.com/a/39249367
              // from Laurens' answer on Aug 31, 2016 at 12:14
              let obj = path.reduce((o, key) => (o[key] = o[key] || {}), acc);
              obj[last] = this.FeatureExtractor.extract(f, d);
              acc.labels = d.labels;

              return acc;
            }, {});
            return output;
          });
        }

        batch = batch.concat(chunk);
        if (this.memoryLimit <= Util.memorySizeOf(batch) || loaded === total) {
          let filename = this.dataTag + 
            "/" + 
            type + 
            "/" +
            type + 
            "." + 
            n + 
            ".json";

          this.file(filename, [ ...batch ]);
          n++;
          batch = [];
        }
      });
    },
    file: function (filename, payload) {
      browser.downloads.download({
        filename: filename,
        url: URL.createObjectURL(
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        ),
      });
    },
  },
};
</script>