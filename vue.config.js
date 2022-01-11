module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  css:{
    loaderOptions:{
      less:{
        additionalData: `@import '@styles/app.less';`
      }
    }
  }
}

