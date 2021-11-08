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
          <v-row>
            <v-col>
              <v-select
                v-model="selectedSeries"
                :items="series"
                item-text="name"
                item-value="name"
                @change="$emit('input', $event)"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="selectedYear"
                :items="years"
                item-text="yearStr"
                item-value="yearInt"
                @change="$emit('input', $event)"
              />
            </v-col>
          </v-row>

          <v-radio-group v-model="bigcityKind" row>
            <v-radio label="政令市統合" value="all"></v-radio>
            <v-radio label="政令市分割" value="break"></v-radio>
          </v-radio-group>
        </v-card-text>

        <v-card-text>
          <HighchartsMapChartCity
            :display-data="displayData"
            :topo-json="topoJson"
          />

          <!-- 注釈 -->
          <hr class="my-3" />
          <p>地域経済分析システムRESASのAPIを利用して作成</p>
        </v-card-text>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  async fetch() {
    // resas-APIから市区町村のデータを取得
    const url = this.resasUrl
    const params = this.resasParams
    const resasResponse = await Promise.all(
      this.cityList.map(async (d) => {
        params.prefCode = this.prefCode
        params.cityCode = d.cityCode
        const { data: r } = await this.$resas.get(url, { params })

        return {
          cityCode: d.cityCode,
          cityName: d.cityName,
          res: r.result,
        }
      })
    )
    this.resasResponse = resasResponse

    // topojsonを取得
    const code = ('00' + this.prefCode).slice(-2)
    const cityMapDc = await axios.get(
      `https://geoshape.ex.nii.ac.jp/city/topojson/20200101/${code}/${code}_city_dc.l.topojson`
    )
    const cityMap = await axios.get(
      `https://geoshape.ex.nii.ac.jp/city/topojson/20200101/${code}/${code}_city.l.topojson`
    )

    this.cityMapDc = cityMapDc.data
    this.cityMap = cityMap.data
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
      selectedSeries: '総人口',
      selectedYear: 2020,
      bigcityKind: 'all',
      cityMap: null,
      cityMapDc: null,
      unit: '人',
    }
  },
  computed: {
    ...mapGetters('cityList', ['getCityList']),
    cityList() {
      if (this.bigcityKind === 'all') {
        return this.getCityList(this.prefCode).filter(
          (f) => f.bigCityFlag !== '1'
        )
      } else {
        return this.getCityList(this.prefCode).filter(
          (f) => f.bigCityFlag !== '2'
        )
      }
    },
    prefCode() {
      return this.selectedPref.prefCode
    },
    prefName() {
      return this.selectedPref.prefName
    },
    resasUrl() {
      return `api/v1/population/composition/perYear`
    },
    resasParams() {
      return {
        prefCode: 1,
        cityCode: '-',
      }
    },
    years() {
      const data = this.resasResponse[0].res.data[0].data
      return data.map((d) => {
        return {
          yearStr: `${d.year}年`,
          yearInt: d.year,
        }
      })
    },
    series() {
      const data = this.resasResponse[0].res.data
      return data.map((d) => {
        return { name: d.label }
      })
    },
    title() {
      return `人口構成`
    },
    chartData() {
      return this.series.reduce((a, c) => {
        const data = this.years.map((y) => {
          return {
            name: c.name,
            year: y.yearInt,
            data: this.cityList.map((d) => {
              // 市区町村に一致するデータを抽出
              const cityData = this.resasResponse.find(
                (f) => f.cityCode === d.cityCode
              ).res

              // 系列名に一致するデータを抽出
              const nameData = cityData
                ? cityData.data.find((f) => f.label === c.name)
                : null

              // 年次に一致するデータを抽出
              const yearData = nameData
                ? nameData.data.find((f) => f.year === y.yearInt)
                : null

              return {
                cityCode: d.cityCode,
                cityName: d.cityName,
                value: yearData ? yearData.value : null,
                unit: this.unit,
              }
            }),
          }
        })
        a.push(...data)

        return a
      }, [])
    },
    displayData() {
      return this.chartData
        .filter((f) => f.name === this.selectedSeries)
        .filter((f) => f.year === this.selectedYear)
    },
    topoJson() {
      if (this.bigcityKind === 'all') {
        return this.cityMapDc
      } else {
        return this.cityMap
      }
    },
  },
  watch: {
    bigcityKind() {
      this.$fetch()
    },
  },
}
</script>
