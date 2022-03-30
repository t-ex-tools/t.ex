<template>
  <div>
    <div class="row">
      <div class="col">
        <b>Labeling</b>
      </div>
    </div>
    <div class="row">
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
              <td>{{ list.name }}</td>
              <td>{{ list.version }}</td>
              <td>
                <a 
                  :href="list.url"
                  target="_blank"
                >
                  {{ list.url }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      lists: [{
        name: "EasyList",
        version: "latest",
        url: "https://easylist.to/easylist/easylist.txt"
      }, {
        name: "EasyPrivacy",
        version: "latest",
        url: "https://easylist.to/easylist/easyprivacy.txt"
      }, {
        name: "Disconnect.me",
        version: "latest",
        url: "https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json"
      }]
    }
  }
}
</script>