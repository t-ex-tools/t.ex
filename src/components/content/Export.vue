<template>
  <div class="row mb-3">
    <div class="col">
      <b>Export</b>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <div class="accordion" id="types">
        <div v-for="(type, index) in types" :key="index" class="accordion-item">
          <h2 class="accordion-header" :id="'heading-' + index">
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
            :class="{ show: index === 0 }"
            :aria-labelledby="'heading-' + index"
            data-bs-parent="#types"
          >
            <div class="accordion-body">

              <div 
                v-for="group, i in groups(type)"
                :key="i" 
                class="table-responsive mb-3"
              >
                <b>{{ group.label }}</b>
                <table
                  class="table table-hover align-middle mt-1"
                >
                  <thead>
                    <th scope="col">
                      Feature
                    </th>
                    <th scope="col">
                      Description
                    </th>
                    <th class="text-end" scope="col">
                      Switch
                    </th>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="feature, j in group.featureGroup"
                      :key="j"
                    >
                      <td style="width: 30%">{{ feature.name }}</td>
                      <td style="width: 55%">{{ feature.subtitle }}</td>
                      <td style="width: 15%">
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
        class="btn btn-outline-light float-end"
        type="button"
        @click="download"
      >
        <i class="bi bi-download me-2" />
        <small>Export data</small>
      </button>
    </div>
  </div>

</template>

<script>
import FeatureExtractor from "../../model/FeatureExtractor.js";

export default {
  data: () => {
    return {
      FeatureExtractor,
      labels: {
        types: {
          http: "HTTP/S requests & responses",
          js: "JavaScript API accesses"
        }
      },
      selected: 0,
      features: [],
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
    c.addEventListener("show.bs.collapse", function(e) {
      let tmp = e.target.id.split("-").pop();
      if (self.selected !== tmp) {
        self.features = [];
        [...document.querySelectorAll(".form-check-input")]
          .forEach((n) => n.checked = false);
      }
    });
  },
  methods: {
    groups(type) {
      return FeatureExtractor
        .navigation()
        .filter((f) => f.featureGroup[0].path.split(".").shift() === type);
    },
    select(e) {
      if (e.target.checked) {
        this.features.push(e.target.name);
      } else {
        this.features.splice(this.features.indexOf(e.target.name), 1);
      }
    },
    download() {
      console.log(this.features);
      // TODO: get impl()
      // TODO: labeledStream()
      // TODO: determine output object
      // TODO: chunk properly
      // TODO: download file
    }
  }
};
</script>