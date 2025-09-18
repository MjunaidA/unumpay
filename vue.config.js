const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  publicPath: '/frontend',
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: "all" 
  }
})
