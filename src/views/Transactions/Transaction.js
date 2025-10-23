import { ref } from "vue";

export default {
  name: "Transactions",
  component: {},
  data() {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 30);
    return {
      range: ref({
        start: start,
        end: today,
      }),
      menu: false,
      search: "",
      paymentProviderSelect: "all",
      paymentProviders: [],
      statusSelect: "all",
      isRtl: this.$i18n.locale === "ar",
      transactionsStats: {},
      stats_loading: true,
      start_date: start.toISOString().split("T")[0],
      end_date: today.toISOString().split("T")[0],
    };
  },
  created() {
    this.getPaymentProviders();
    this.transactionStats();
  },
  computed: {
    rangeText() {
      if (!this.range.start || !this.range.end) return "";

      const locale = this.$i18n.locale;

      const options = { month: "short", day: "numeric", year: "numeric" };
      const startStr = this.range.start.toLocaleDateString(locale, options);
      const endStr = this.range.end.toLocaleDateString(locale, options);

      return `${startStr} - ${endStr}`;
    },
    filteredTransactions() {
      return this.transactionsDetails.filter((item) => {
        let matchesProvider = true;
        let matchesStatus = true;

        if (this.paymentProviderSelect) {
          this.paymentProviderFilter = this.paymentProviderSelect;

          if (this.paymentProviderSelect === "all") {
            matchesProvider = true;
          } else {
            matchesProvider =
              item.payment_source === this.paymentProviderSelect;
          }
        }
        if (this.statusSelect) {
          this.statusFilter = this.statusSelect.toLowerCase();

          if (this.statusFilter === "all") {
            matchesStatus = true;
          } else {
            matchesStatus = item.status?.toLowerCase() === this.statusFilter;
          }
        }

        return matchesProvider && matchesStatus;
      });
    },
  },
  watch: {
    "$i18n.locale"(newVal) {
      this.isRtl = newVal === "ar";
    },
  },
  methods: {
    // logRange() {
    //   this.start_date = this.range.start.toISOString().split("T")[0];
    //   this.end_date = this.range.end.toISOString().split("T")[0];
    // },
    getPaymentProviders() {
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/payment_service_providers?shop=" +
            this.$shop,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          }
        )
        .then(
          (response) => {
            this.paymentProviders = [
              { display_name: "All", backend_value: "all", is_active: true },
              ...response.data.payment_providers,
            ];
          },
          (error) => {
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          }
        );
    },
    transactionStats() {
      this.stats_loading = true;
      this.snackbar = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/activities_stats?shop=" +
            this.$shop +
            "&start_date=" +
            this.start_date +
            "&end_date=" +
            this.end_date,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          }
        )
        .then(
          (response) => {
            this.transactionsStats = response.data.transaction_stats;
            this.stats_loading = false;
          },
          (error) => {
            this.stats_loading = false;
            this.snackbar = false;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          }
        );
    },
  },
};
