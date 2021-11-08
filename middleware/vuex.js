export default async ({ store }) => {
  await store.dispatch('prefList/fetchPrefAPI')
  await store.dispatch('cityList/fetchCityAPI')
}