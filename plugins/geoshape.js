// import qs from 'qs';

export default function ({ $axios, $config }, inject) {
  const api = $axios.create({
    // headers: {
    //   common: {
    //     Accept: 'application/json',
    //   },
    //   'Content-Type': 'application/json',
    // },

    data: {},
  })

  // console.log($config.SITE_URL)
  api.setBaseURL(`${$config.SITE_URL}topojson`)

  inject('geoshape', api)
}