<template>
  <v-col cols="4" sm="8" md="6">
    <v-card :loading="$fetchState.pending">
      <p v-if="$fetchState.pending" />
      <div v-else>
        <!-- タイトル -->
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>

        <v-card-text>
          <!-- スライダー -->
          <v-slider
            v-model="year"
            thumb-label="always"
            class="Slider"
            :max="2045"
            :min="1980"
            step="5"
            hide-details
            @change="$emit('input', $event)"
          />

          <!-- グラフ -->
          <HighchartsPyramidChart :display-data="displayData" />

          <!-- 注釈 -->
          <hr class="my-3" />
          <p>地域経済分析システムRESASのAPIを利用して作成</p>
        </v-card-text>
      </div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  async fetch() {
    const url = this.resasUrl
    const params = this.resasParams
    const { data } = await this.$resas.get(url, { params })
    this.resasResponse = data
  },
  props: {
    selectedPref: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      resasResponse: null,
      year: 2015,
      unit: '人',
    }
  },
  computed: {
    prefCode() {
      return this.selectedPref.prefCode
    },
    prefName() {
      return this.selectedPref.prefName
    },
    resasUrl() {
      return `api/v1/population/composition/pyramid`
    },
    resasParams() {
      return {
        prefCode: String(this.prefCode),
        cityCode: '-',
        yearLeft: String(this.year),
        yearRight: '2040',
      }
    },
    title() {
      return `${this.prefName}の人口ピラミッド`
    },
    chartData() {
      const data = this.resasResponse.result.yearLeft.data
      return data.map((d) => {
        return {
          category: d.class,
          man: d.man,
          woman: d.woman,
          unit: this.unit,
        }
      })
    },
    displayData() {
      return this.chartData
    },
  },
  created() {},
  watch: {
    year() {
      this.$fetch()
    },
  },
}
</script>
