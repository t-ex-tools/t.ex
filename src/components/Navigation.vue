<template>
  <b>Navigation</b>
  <div class="card card-body mt-3">
    <ul class="nav nav-pills flex-column">
      <li
        v-for="route, index in staticRoutes"
        :key="index"
        class="nav-item"
      >
        <router-link
          class="nav-link"
          :to="route.path"
        >
          {{ route.label }}
        </router-link>
      </li>

      <b class="mt-3">Features</b>
      <li
        v-for="g, index in FeatureExtractor.navigation()"
        :key="index"
        class="nav-item dropdown"
      >
        <a
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          href="#"
          role="button"
          aria-expanded="false"
        >{{ g.label }}</a>
        <ul class="dropdown-menu">
          <li
            v-for="feature in g.featureGroup"
            :key="feature.name"
          >
            <router-link
              class="dropdown-item"
              :to="feature.path"
            >
              {{ feature.name }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import FeatureExtractor from "../model/FeatureExtractor.js";
import StaticRoutes from "../model/StaticRoutes.js";

export default {
  data: () => {
    return {
      FeatureExtractor: FeatureExtractor,
      staticRoutes: StaticRoutes
    };
  },
};
</script>