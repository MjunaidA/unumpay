// main.js
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./router";

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).use(i18n).use(router).mount("#app");
