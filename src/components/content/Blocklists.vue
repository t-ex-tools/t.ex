<template>
  <b-row>
    <b-col>
      <b>Blocklists</b>
      <b-progress show-progress animated
        v-if="loading.isLoading" 
        v-bind:value="loading.current" 
        v-bind:max="loading.max">
      </b-progress>

      <p v-if="numOfRequests !== 0">
        <small>Number of HTTP requests: N{{(loading.isLoading) ? "≈" : "="}}{{numOfRequests}}</small>
      </p>

      <b-button 
        v-if="countsItems.length > 0"
        variant="outline-primary" 
        class="mb-3 float-right" 
        @click="exportData('Overall', 'Labels', countsItems)">
        <b-icon icon="table"></b-icon> Export CSV
      </b-button>
      <b-table striped hover 
        v-bind:items="countsItems">
      </b-table>

      <div class="accordion" role="tablist">
        <b-card no-body class="mb-1"
          v-for="list, index in Object.keys(rules)" v-bind:key="index">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle="'accordion-' + index" variant="outline-primary">
              {{list}}
            </b-button>
          </b-card-header>
          <b-collapse
            v-bind:id="'accordion-' + index"
            accordion="my-accordion"
            role="tabpanel">
            <b-card-body>
              <div v-if="rulesItems[index].length > 0">
                <b>Rules</b>

                <b-button 
                  variant="outline-primary" 
                  class="mb-3 float-right" 
                  @click="exportData(list, 'Rules', rulesItems[index])">
                  <b-icon icon="table"></b-icon> Export CSV
                </b-button>

                <b-table striped hover
                  v-bind:id="'blocklist-rules-' + index"
                  v-bind:items="rulesItems[index]"
                  sort-by="count"
                  sort-desc="true"
                  v-bind:current-page="currentRulesPage[index]"
                  v-bind:per-page="perPage">
                </b-table>

                <b-pagination pills
                  v-if="rulesItems[index] && rulesItems[index].length > perPage"
                  v-model="currentRulesPage[index]"
                  v-bind:total-rows="(rulesItems[index]) ? rulesItems[index].length : 0"
                  v-bind:per-page="perPage"
                  v-bind:aria-controls="'blocklist-rules-' + index"
                  align="center"
                  v-bind:limit="perPage">
                </b-pagination>                
              </div>

              <div v-if="typesItems[index].length > 0">
                <b>Types</b>

                <b-button 
                  variant="outline-primary" 
                  class="mb-3 float-right" 
                  @click="exportData(list, 'Types', typesItems[index])">
                  <b-icon icon="table"></b-icon> Export CSV
                </b-button>

                <b-table striped hover
                  v-bind:id="'blocklist-types-' + index"
                  v-bind:items="typesItems[index]"
                  sort-by="count"
                  sort-desc="true"
                  v-bind:current-page="currentTypesPage[index]"
                  v-bind:per-page="perPage">
                </b-table>                
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-col>
  </b-row>  
</template>

<script>
import Util from "../../model/Util.js";

export default {
  components: {
  },
  props: ["requests", "dataTag"],
  data: () => {
    return {
      loading: {
        isLoading: false,
        current: 0,
        max: 1,
      },
      counts: {},
      countsItems: [],
      rules: {},
      rulesItems: [],
      types: {},
      typesItems: [],
      currentRulesPage: [],
      currentTypesPage: [],
      perPage: 5,
      numOfRequests: 0,
    }
  },
  mounted() {
    this.loading.isLoading = true;
    Util.labeledStream(this.requests, (chunk, current, total) => {
      this.numOfRequests = total;
      if (current === total) {
        this.loading = {isLoading: false, current: 0, max: 1};
      } else {
        this.loading.current = current;
        this.loading.max = total;
      }
      (chunk) ? this.processChunk(chunk) : null;
    });
  },
  methods: {
    processChunk: function(chunk) {
      chunk
        .forEach((r, index) => 
          r.labels
            .forEach((label, i) => {
              if (label.isLabeled) {
                (this.counts[label.blocklist]) ? 
                  this.counts[label.blocklist]++ 
                  : this.counts[label.blocklist] = 1;             
              }

              (!this.rules[label.blocklist]) ? this.rules[label.blocklist] = {} : null;
              (label.rule) ?
                (this.rules[label.blocklist][label.rule]) ? 
                  this.rules[label.blocklist][label.rule]++ 
                  : this.rules[label.blocklist][label.rule] = 1
                : null;
              
              (!this.types[label.blocklist]) ? this.types[label.blocklist] = {} : null;  
              (label.type) ?
                (typeof label.type === "object") ?
                  label.type.forEach((type) => {
                    (this.types[label.blocklist][type]) ?
                      this.types[label.blocklist][type]++ 
                      : this.types[label.blocklist][type] = 1                    
                  })
                  : (this.types[label.blocklist][label.type]) ?
                    this.types[label.blocklist][label.type]++ 
                    : this.types[label.blocklist][label.type] = 1
                : null;

              if (index === chunk.length-1 && 
                  i === r.labels.length-1) {
                    this.countsItems = [this.counts, this.toPercent()];
                    this.rulesItems = this.toTable(this.rules);
                    this.typesItems = this.toTable(this.types);
                  }
            })
          )
    },
    toPercent: function() {
      let result = {}
      for (let key of Object.keys(this.counts)) {
        result[key] = ((this.counts[key] / this.numOfRequests) * 100).toFixed(2);
      }
      return result;
    },
    toTable: function(map) {
      return Object
        .keys(map)
        .map((list) => 
          Object.entries(map[list])
            .map((pair) => 
              ({
                value: pair[0], 
                count: pair[1], 
                percent: ((pair[1] / this.counts[list]) * 100).toFixed(2),
                ofTotal: ((pair[1] / this.numOfRequests) * 100).toFixed(2),
              })
            )
          );
    },
    exportData(list, label, table) {
      table.unshift(
        Object.keys(table[0])
          .reduce((acc, val) => 
            (acc[val] = val, acc), {})
        );
      let csv = table
        .map((row) => 
          Object.values(row)
            .map((value) => 
              '"' + value + '"'
            ).join(",")
          ).join("\r\n");
      csv = '"N=",' + this.numOfRequests + "\r\n" + csv;
      chrome.downloads.download({
        filename: 
          this.dataTag
          + "-"
          + list 
          + "-" 
          + label 
          + ".csv",
        url: URL.createObjectURL(new Blob([csv], {type: "data:application/csv;charset=utf-8"})),
      });
    },    
  },
}
</script>