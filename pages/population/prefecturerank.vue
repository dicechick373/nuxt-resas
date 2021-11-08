<template>
  <div>
    <!-- タブ -->
    <v-tabs hide-slider>
      <v-tab v-for="(item, i) in tabs" :key="i" :to="item.link">
        {{ item.label }}
      </v-tab>
    </v-tabs>

    <PopulationPrefRank />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      selectedPref: null,
      component: 'PopulationPrefRank',
    }
  },
  computed: {
    ...mapGetters('prefList', ['getPrefList']),
    prefList() {
      return this.getPrefList
    },
    items() {
      return this.selectedPref
    },
    tabs() {
      return [
        {
          label: '都道府県の統計',
          link: `/population/prefecture/`,
        },
        {
          label: '市区町村の統計',
          link: `/population/city/`,
        },
        {
          label: '都道府県ランキング',
          link: `/population/prefecturerank/`,
        },
        {
          label: '市区町村ランキング',
          link: `/population/cityrank/`,
        },
      ]
    },
  },
}
</script>
