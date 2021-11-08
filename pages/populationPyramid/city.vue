<template>
  <div>
    <!-- タブ -->
    <v-tabs hide-slider>
      <v-tab v-for="(item, i) in tabs" :key="i" :to="item.link">
        {{ item.label }}
      </v-tab>
    </v-tabs>

    <!-- 都道府県・市区町村のセレクトボックス -->
    <v-row>
      <v-col cols="4" sm="8" md="6">
        <v-select
          v-model="selectedPref"
          :items="prefList"
          item-text="prefName"
          item-value="prefCode"
          return-object
          attach
          chips
          outlined
          label="都道府県"
          @input="changePref"
        />
      </v-col>
      <v-col cols="4" sm="8" md="6">
        <v-select
          v-model="selectedCity"
          :items="cityList"
          item-text="cityName"
          item-value="cityCode"
          return-object
          attach
          chips
          outlined
          label="市区町村"
          multiple
        />
      </v-col>
    </v-row>

    <!-- 選択した市区町村のコンポーネント読込 -->
    <v-row>
      <component
        :is="component"
        v-for="(item, i) in items"
        :key="i"
        :selected-pref="selectedPref"
        :selected-city="item"
      />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      selectedPref: { prefCode: 28, prefName: '兵庫県' },
      selectedCity: null,
    }
  },
  computed: {
    ...mapGetters('prefList', ['getPrefList']),
    ...mapGetters('cityList', ['getCityList']),
    prefList() {
      return this.getPrefList
    },
    cityList() {
      return this.getCityList(this.selectedPref.prefCode)
    },
    component() {
      return 'PopulationpyramidCity'
    },
    items() {
      return this.selectedCity
    },
    tabs() {
      return [
        {
          label: '都道府県の統計',
          link: `/populationpyramid/prefecture/`,
        },
        {
          label: '市区町村の統計',
          link: `/populationpyramid/city/`,
        },
      ]
    },
  },
  methods: {
    changePref() {
      this.selectedCity = null
    },
  },
}
</script>
