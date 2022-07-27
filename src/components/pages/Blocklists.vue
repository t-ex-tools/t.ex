<template>
  <div>
    <div class="row">
      <div class="col">
        <b>Labeling</b>
      </div>
    </div>
    <div
      v-if="lists.length > 0"
      class="row"
    >
      <div class="col">
        <table class="table table-hover align-middle mt-3">
          <thead>
            <th
              v-for="heading, index in Object.keys(lists[0])"
              :key="index" 
              scope="col"
            >
              {{ heading.charAt(0).toUpperCase() + heading.slice(1) }}
            </th>
          </thead>
          <tbody>
            <tr 
              v-for="list, index in lists"
              :key="index"
              scope="row"
            >
              <td
                v-for="v, i in Object.values(list)"
                :key="i"
                :style="'width: ' + (100 / Object.values(list).length).toFixed(2) + '%'"
              >
                {{ v }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TODO: EasyList & EasyPrivacy -->
  </div>
</template>

<script>
import model from "../../model/index.js";

export default {
  data: () => {
    return {
      lists: []
    }
  },
  mounted() {
    model.Data.blocklists((lists) => this.lists = lists);
  }
}
</script>