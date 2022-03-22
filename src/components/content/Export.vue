<template>
  <div class="row mb-3">
    <div class="col">
      <b>Export</b>
    </div>
  </div>

  <div class="row mb-3">
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
      }
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
  methods: {
    groups(type) {
      return FeatureExtractor
        .navigation()
        .filter((f) => f.featureGroup[0].path.split(".").shift() === type);
    },
    select(e) {
      console.log(e.target.name, e.target.checked)
    }
  }
};
</script>