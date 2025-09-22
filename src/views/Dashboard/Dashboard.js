export default {
  name: "Dashboard",
  data() {
    return {
      stats_loading: true,
      contactAlertLoading: true,
      dashboard_stats: {},
      shop_currency: "",
      snackbar: true,
      snackbar_timeout: 1000,
      snackbar_status: "#00000000",
      snackbar_text: "",
      isRtl: this.$i18n.locale === "ar",
    };
  },
  components: {},
  created() {
    this.getStatsApi();
  },
  methods: {
    getStatsApi() {
      this.stats_loading = true;
      this.$Axios
        .get(
          this.$backendURL + "/payment_app/dashboard_stats?shop=" + this.$shop,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          }
        )
        .then(
          (response) => {
            this.dashboard_stats = response.data;
            this.shop_currency = this.dashboard_stats.data.currency_symbol;
            this.snackbar_text = "stats_data_loaded";
            this.snackbar_status = "green";
            this.snackbar = true;
            this.stats_loading = false;
          },
          (error) => {
            this.stats_loading = false;
            this.snackbar = true;
            this.snackbar_status = "red";
            this.snackbar_text = error.response.data.detail;
            if (
              error.response.data.detail ===
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            } else {
              this.snackbar_text = "stats_api_error";
            }
          }
        );
    },
  },
  computed: {},
  watch: {
    "$i18n.locale"(newVal) {
      this.isRtl = newVal === "ar";
    },
  },
};
