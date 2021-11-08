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
          <!-- ラジオボタン -->
          <v-radio-group v-model="series" row>
            <v-radio label="総数" value="all"></v-radio>
            <v-radio label="内訳" value="break"></v-radio>
          </v-radio-group>

          <!-- グラフ -->
          <HighchartsColumnChart :display-data="displayData" />

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
    this.resasResponse = data.result.data
  },
  props: {
    selectedPref: {
      type: Object,
      required: true,
    },
    selectedCity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      resasResponse: {},
      series: 'all',
    }
  },
  computed: {
    prefCode() {
      return this.selectedPref.prefCode
    },
    prefName() {
      return this.selectedPref.prefName
    },
    cityCode() {
      return this.selectedCity.cityCode
    },
    cityName() {
      return this.selectedCity.cityName
    },
    resasUrl() {
      return `api/v1/population/composition/perYear`
    },
    resasParams() {
      return {
        prefCode: String(this.prefCode),
        cityCode: String(this.cityCode),
      }
    },
    title() {
      return `${this.prefName}${this.cityName}の人口構成`
    },
    chartData() {
      return this.resasResponse.map((d) => {
        return {
          name: d.label,
          data: d.data.map((d) => {
            return {
              x: d.year,
              y: d.value,
            }
          }),
        }
      })
    },
    displayData() {
      if (this.series === 'all') {
        return this.chartData.filter((f) => f.name === '総人口')
      } else {
        return this.chartData.filter((f) => f.name !== '総人口')
      }
    },
  },
  created() {},
}
</script>
