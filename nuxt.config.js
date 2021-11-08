import colors from 'vuetify/es5/util/colors'

export default {
  publicRuntimeConfig: {
    RESAS_API_KEY: process.env.RESAS_API_KEY,
    SITE_URL: process.env.SITE_URL,
  },
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - nuxt-resas',
    title: 'nuxt-resas',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/resas', ssr: true, },
    { src: '@/plugins/geoshape', ssr: true, },
    // { src: '@/plugins/axios', mode: 'client', },
    {
      src: '@/plugins/highcharts-vue',
      mode: 'client',
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '~/components',
    { path: '~/components/highcharts/', prefix: 'highcharts' }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  router: {
    middleware: 'vuex' //ミドルウェアのファイル名
  },

  // axios: {
  //   proxy: true
  // },

  // proxy: {
  //   '/topojson/': {
  //     target: 'https://geoshape.ex.nii.ac.jp/city/topojson',
  //     pathRewrite: {
  //       '^/topojson/': '/',
  //     },
  //   },
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
