// main.js
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./router";
import Axios from 'axios';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n"
import { useI18n } from "vue-i18n"
// import { getShopifySessionToken } from "./utils/shopify";
const app = createApp(App);

var url_params = {};
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
  m,
  key,
  value
) {
  url_params[key] = value;
});

// app.config.globalProperties.$API_TOKEN = url_params.API_TOKEN;
// app.config.globalProperties.$shopify_jwt_token = url_params.API_TOKEN;
// app.config.globalProperties.$shop = url_params.shop;
// app.config.globalProperties.$plan_name = url_params.plan_name;
// app.config.globalProperties.$specific_provider = url_params.specific_provider;
app.config.globalProperties.$backendURL = "https://unumpay.alche.cloud";


/////////////////////// Session Token Working ///////////////////////
// app.config.globalProperties.$shopify_api_key = url_params.SHOPIFY_APP_API_KEY;
// app.config.globalProperties.$shopify_jwt_token = url_params.API_TOKEN;
// app.config.globalProperties.$host = url_params.host;
/////////////////////// Session Token Working ///////////////////////

app.config.globalProperties.$API_TOKEN = "Token%2045cb34c5a0ca91eb9c990ddc5da5fc4761c10d89";
app.config.globalProperties.$shop = "junaid-jamshed-new-testing.myshopify.com";
app.config.globalProperties.$shopify_jwt_token = "Token%2045cb34c5a0ca91eb9c990ddc5da5fc4761c10d89";
// app.config.globalProperties.$plan_name = "Bronze";
// app.config.globalProperties.$plan_name = "Silver";
// app.config.globalProperties.$plan_name = "Gold";
// app.config.globalProperties.$plan_name = "Platinum";
app.config.globalProperties.$plan_name = "Enterprise";
// app.config.globalProperties.$specific_provider = "all";
// app.config.globalProperties.$backendURL = "http://localhost:8000"
// app.config.globalProperties.$backendURL = "https://alche-pg.ngrok.io"


const vuetify = createVuetify({
  components,
  directives,
    locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }), 
  },
  rtl: {
      ar: true,
      fr: false
  },
});





app.config.globalProperties.$Axios = Axios;
app.use(vuetify)
   .use(i18n)
   .use(router)
   .use(VCalendar, {
     componentPrefix: 'Vc'
    })
   .mount("#app");


if (url_params?.API_TOKEN?.includes("+") == true) {
  var queryString = window.location.search
  var urlParams = new URLSearchParams(queryString);
  app.config.globalProperties.$API_TOKEN = urlParams.get('API_TOKEN');
  app.config.globalProperties.$plan_name = urlParams.get('plan_name');
  app.config.globalProperties.$specific_provider = urlParams.get('specific_provider');
  router.push('/')
}

// if (url_params.SHOPIFY_APP_API_KEY && url_params.host) {
//   getShopifySessionToken(url_params.SHOPIFY_APP_API_KEY, url_params.host)
//     .then(token => {
//       app.config.globalProperties.$shopify_jwt_token = token;

//       Axios.get(
//         `${app.config.globalProperties.$backendURL}/verify_shopify_token?shop=${url_params.shop}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Custom-Authorization": app.config.globalProperties.$API_TOKEN.replace("%20", " ")
//           }
//         }
//       ).then(response => {
//         app.config.globalProperties.$shopify_jwt_token = response.data.extracted_token;
//       }).catch(error => {
//         if (error.response?.data?.detail === "Session expired, Reopen the application!") {
//           router.push("/error");
//         }
//       });

//     })
//     .catch(err => console.error("Shopify session token error:", err));
// }

// main.js or main.ts


