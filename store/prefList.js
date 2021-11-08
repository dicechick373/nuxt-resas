import { cloneDeep } from 'lodash'

const initialState = {
  prefList: [],
}

// ShallowCopyを避けるため、lodashのcloneDeepを用いる。
export const state = () => cloneDeep(initialState)

export const getters = {
  getPrefList(state) {
    return state.prefList
  },
}

export const mutations = {
  initPrefSet(state, payload) {
    if (payload === null) {
      state = cloneDeep(initialState)
    } else {
      state.prefList = payload
    }
  },
}

export const actions = {
  async fetchPrefAPI({ commit }) {
    // APIから取得する場合
    // const url = 'api/v1/prefectures'
    // const { data } = await this.$resas.get(url)

    // ローカルJSONから取得する場合
    const data = await import('~/data/codes/preflist.json')
    commit('initPrefSet', data.result)
  },
}
