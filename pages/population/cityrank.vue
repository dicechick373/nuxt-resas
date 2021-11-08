<template>
  <div>
    <!-- タブ -->
    <v-tabs hide-slider>
      <v-tab v-for="(item, i) in tabs" :key="i" :to="item.link">
        {{ item.label }}
      </v-tab>
    </v-tabs>

    <!-- 都道府県のセレクトボックス -->
    <v-row>
      <v-col>
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
          multiple
          @change="$emit('input', $event)"
        />
      </v-col>
    </v-row>

    <!-- 選択した都道府県のコンポーネント読込 -->
    <v-row>
      <component
        :is="component"
        v-for="(item, i) in items"
        :key="i"
        :selected-pref="item"
      />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      selectedPref: null,
      component: 'PopulationCityRank',
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
