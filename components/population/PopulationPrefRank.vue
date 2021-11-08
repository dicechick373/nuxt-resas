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
        </v-card-text>

        <v-card-text>
          <HighchartsMapChartPref
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
    // resas-APIから都道府県のデータを取得
    const url = this.resasUrl
    const params = this.resasParams
    const res = await Promise.all(
      this.prefList.map(async (p) => {
        params.prefCode = p.prefCode
        const { data } = await this.$resas.get(url, { params })

        return {
          prefCode: p.prefCode,
          prefName: p.prefName,
          data: data.result.data,
        }
      })
    )
    this.resasResponse = res

    // 都道府県地図のtopojsonを取得
    const prefMap = await axios.get(
      `https://geoshape.ex.nii.ac.jp/city/topojson/20200101/jp_pref.c.topojson`
    )
    this.prefMap = prefMap.data
  },
  data() {
    return {
      resasResponse: null,
      selectedSeries: '総人口',
      selectedYear: 2020,
      prefMap: null,
      unit: '人',
    }
  },
  computed: {
    ...mapGetters('prefList', ['getPrefList']),
    prefList() {
      return this.getPrefList
    },
    resasUrl() {
      return `api/v1/population/composition/perYear`
    },
    resasParams() {
      return {
        prefCode: null,
        cityCode: '-',
      }
    },
    years() {
      const data = this.resasResponse[0].data[0].data
      return data.map((d) => {
        return {
          yearStr: `${d.year}年`,
          yearInt: d.year,
        }
      })
    },
    series() {
      const data = this.resasResponse[0].data
      return data.map((d) => {
        return { name: d.label }
      })
    },
    title() {
      return `人口構成`
    },
    chartData() {
      return this.series.reduce((acc, cur) => {
        const data = this.years.map((y) => {
          return {
            name: cur.name,
            year: y.yearInt,
            data: this.prefList.map((d) => {
              return {
                prefCode: d.prefCode,
                prefName: d.prefName,
                value: this.resasResponse
                  .find((f) => f.prefCode === d.prefCode)
                  .data.find((f) => f.label === cur.name)
                  .data.find((f) => f.year === y.yearInt).value,
                unit: this.unit,
              }
            }),
          }
        })
        acc.push(...data)

        return acc
      }, [])
    },
    displayData() {
      return this.chartData
        .filter((f) => f.name === this.selectedSeries)
        .filter((f) => f.year === this.selectedYear)
    },
    topoJson() {
      return this.prefMap
    },
  },
}
</script>
