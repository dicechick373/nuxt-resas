import { cloneDeep } from 'lodash'

const initialState = {
  cityList: [],
}

// ShallowCopyを避けるため、lodashのcloneDeepを用いる。
export const state = () => cloneDeep(initialState)

export const getters = {
  getCityList: (state) => (prefCode) => {
    return state.cityList.filter((f) => f.prefCode === prefCode)
  },
}

export const mutations = {
  initCitySet(state, payload) {
    if (payload === null) {
      state = cloneDeep(initialState)
    } else {
      state.cityList = payload
    }
  },
}

export const actions = {
  async fetchCityAPI({ commit }) {
    // APIから取得する場合
    // const url = 'api/v1/cities'
    // const { data } = await this.$resas.get(url)

    // ローカルJSONから取得する場合
    const data = await import('~/data/codes/citylist.json')
    commit('initCitySet', data.result)
  },
}
