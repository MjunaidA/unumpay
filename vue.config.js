const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  publicPath: "./",
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: "all" 
  }
})
