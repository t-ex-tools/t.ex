<template>
  <div class="row">
    <div class="col">
      <b>Blocklists</b>
      
    </div>
  </div>  
</template>

<script>
import Util from "../../model/Util.js";

export default {
  components: {
  },
  props: ["http", "dataTag"],
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
    /*
    this.loading.isLoading = true;
    Util.labeledStream(this.http, (chunk, current, total) => {
      this.numOfRequests = total;
      if (current === total) {
        this.loading = {isLoading: false, current: 0, max: 1};
      } else {
        this.loading.current = current;
        this.loading.max = total;
      }
      (chunk) ? this.processChunk(chunk) : null;
    });
    */
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