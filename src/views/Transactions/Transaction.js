import { ref } from "vue";
import TransactionsDetails from "@/components/TransactionsDetails.vue";

export default {
  name: "Transactions",
  components:{TransactionsDetails},
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
      trans_loading: true,
      transactionsDetails: [],
      snackbar: true,
      snackbar_timeout: 1000,
      snackbar_status: "#00000000",
      snackbar_text: "",
      selectedTransaction: null,
      popupOpen: false,
      disabledDates: [
        {
          start: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          end: new Date(9999, 11, 31),
        },
      ],
      paymentProviderFilter: "all",
      statusFilter: "all",
    };
  },
  created() {
    this.getPaymentProviders();
    this.transactionStats();
    this.transactionDetail();
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
    headers() {
      return [
        {
          title: this.$t("transaction_table.headers.transaction_id"),
          key: "order_reference",
        },
        {
          title: this.$t("transaction_table.headers.name"),
          key: "customer_name",
        },
        { title: this.$t("transaction_table.headers.amount"), key: "amount" },
        {
          title: this.$t("transaction_table.headers.payment_provider"),
          key: "payment_source",
        },
        {
          title: this.$t("transaction_table.headers.payment_session_id"),
          key: "payment_session_id",
        },
        { title: this.$t("transaction_table.headers.status"), key: "status" },
        {
          title: this.$t("transaction_table.headers.transaction_datetime"),
          key: "transaction_datetime",
        },
        {
          title: this.$t("transaction_table.headers.action"),
          key: "action",
          sortable: false,
        },
      ];
    },
    searchedAndFilteredTransactions() {
      let search = this.search.toString().toLowerCase();

      return this.transactionsDetails.filter((item) => {
        // --- Provider Filter ---
        let matchesProvider =
          this.paymentProviderSelect === "all" ||
          item.payment_source === this.paymentProviderSelect;

        // --- Status Filter ---
        let matchesStatus =
          this.statusSelect === "all" ||
          item.status?.toLowerCase() === this.statusSelect.toLowerCase();

        // --- Search Filter ---
        const localizedProvider = item.payment_source
          ? this.$t(`payment_provider.${item.payment_source}`).toLowerCase()
          : "";
        const localizedStatus = item.status
          ? this.$t(`status.${item.status}`).toLowerCase()
          : "";
        const currencySymbol = item.currency_symbol || "";
        const amountStr = item.amount != null ? item.amount.toString() : "";

        const combinedText = [
          item.order_reference,
          item.customer_name,
          item.currency_symbol,
          item.payment_session_id,
          item.transaction_datetime,
          item.amount,
          item.payment_source,
          item.status,
          `${currencySymbol}${amountStr}`,
          `${currencySymbol} ${amountStr}`,
          localizedProvider,
          localizedStatus,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = !search || combinedText.includes(search);

        return matchesProvider && matchesStatus && matchesSearch;
      });
    },
  },
  watch: {
    "$i18n.locale"(newVal) {
      this.isRtl = newVal === "ar";
    },
    range: {
      handler(newVal) {
        if (newVal?.start && newVal?.end) {
          this.start_date = newVal.start.toISOString().split("T")[0];
          this.end_date = newVal.end.toISOString().split("T")[0];
        }
      },
      deep: true,
    },
    paymentProviderSelect(updatedFilter) {
      this.paymentProviderFilter = updatedFilter;
    },
    statusSelect(updatedStatus) {
      this.statusFilter = updatedStatus;
    },
  },
  methods: {
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
      this.snackbar_text = "data_loaded";
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
            this.snackbar = true;
            this.snackbar_text = error;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          }
        );
    },
    transactionDetail() {
      this.trans_loading = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/activities?shop=" +
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
            this.transactionsDetails = response.data.transactions;
            this.trans_loading = false;
            this.snackbar_status = "success";
            this.snackbar_text = "data_loaded";
          },
          (error) => {
            this.trans_loading = false;
            this.snackbar = true;
            this.snackbar_text = error;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          }
        );
    },
    applyDateRange() {
      this.menu = false;
      this.transactionStats();
      this.transactionDetail();
    },
    handleViewAction(item) {
      this.selectedTransaction = item;
      this.popupOpen = true;
    },
    // download Activities CSV
    downloadActivitiesCSV() {
      const a = new Date(this.end_date);
      const b = new Date(this.start_date);
      const no_of_days = (a - b) / (1000 * 60 * 60 * 24);
      if (no_of_days == 0) {
        this.snackbar = true;
        this.snackbar_status = "red";
        this.snackbar_text = "invalid_date";
      } else {
        this.loading_data = true;
        this.$Axios
          .get(
            this.$backendURL +
              "/payment_app/activities_csv?shop=" +
              this.$shop +
              "&start_date=" +
              this.start_date +
              "&end_date=" +
              this.end_date +
              "&payment_provider_filter=" +
              this.paymentProviderFilter +
              "&payment_status_filter=" +
              this.statusFilter,
            {
              responseType: "blob",
              headers: {
                Authorization: "Bearer " + this.$shopify_jwt_token,
                "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
              },
            }
          )
          .then(
            (response) => {
              this.loading_data = false;
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                "transaction_activities_report.csv"
              );
              document.body.appendChild(link);
              link.click();
              this.snackbar = true;
              this.snackbar_text = "transaction_activity_report";
              this.snackbar_status = "success";
            },
            (error) => {
              this.snackbar = true;
              this.snackbar_status = "red";
              this.snackbar_text = error;
            }
          );
      }
    },
    // download Pending Report CSV()
    downloadPendingReportCSV() {
      const a = new Date(this.end_date);
      const b = new Date(this.start_date);
      const no_of_days = (a - b) / (1000 * 60 * 60 * 24);
      if (no_of_days == 0) {
        this.snackbar = true;
        this.snackbar_status = "red";
        this.snackbar_text = "invalid_date";
      } else {
        this.loading_data = true;
        this.$Axios
          .get(
            this.$backendURL +
              "/payment_app/pending_report_csv?shop=" +
              this.$shop +
              "&start_date=" +
              this.start_date +
              "&end_date=" +
              this.end_date +
              "&payment_provider_filter=" +
              this.paymentProviderFilter +
              "&payment_status_filter=" +
              this.statusFilter,
            {
              responseType: "blob",
              headers: {
                Authorization: "Bearer " + this.$shopify_jwt_token,
                "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
              },
            }
          )
          .then(
            (response) => {
              this.loading_data = false;
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "transaction_pending_report.csv");
              document.body.appendChild(link);
              link.click();
              this.snackbar = true;
              this.snackbar_text = "transaction_pending _report"
              this.snackbar_status = "success";
            },
            (error) => {
              this.snackbar = true;
              this.snackbar_text = error;
              this.snackbar_status = "red";
            }
          );
      }
    },
       //  download Card Preport CSV
    downloadCardPreportCSV() {
      const a = new Date(this.end_date);
      const b = new Date(this.start_date);
      const no_of_days = (a - b) / (1000 * 60 * 60 * 24);
      if (no_of_days == 0) {
        this.snackbar = true;
        this.snackbar_status = "red";
        this.snackbar_text = "invalid_date";
      } else {
        this.loading_data = true;
        this.$Axios
          .get(
            this.$backendURL +
              "/payment_app/card_report_csv?shop=" +
              this.$shop +
              "&start_date=" +
              this.start_date +
              "&end_date=" +
              this.end_date +
              "&payment_provider_filter=" +
              this.paymentProviderFilter +
              "&payment_status_filter=" +
              this.statusFilter,
            {
              responseType: "blob",
              headers: {
                Authorization: "Bearer " + this.$shopify_jwt_token,
                "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
              },
            }
          )
          .then(
            (response) => {
              this.loading_data = false;
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "transaction_card_report.csv");
              document.body.appendChild(link);
              link.click();
              this.snackbar = true;
              this.snackbar_text = "transaction_card_report";
              this.snackbar_status = "success";
            },
            (error) => {
              this.snackbar = true;
              this.snackbar_text = error;
              this.snackbar_status = "red";
            }
          );
      }
    },
        // download Billing Report CSV
    downloadBillingReportCSV() {
      const a = new Date(this.end_date);
      const b = new Date(this.start_date);
      const no_of_days = (a - b) / (1000 * 60 * 60 * 24);
      if (no_of_days == 0) {
        this.snackbar = true;
        this.snackbar_status = "red";
        this.snackbar_text = "invalid_date";
      } else {
        this.loading_data = true;
        this.$Axios
          .get(
            this.$backendURL +
              "/payment_app/billing_report_csv?shop=" +
              this.$shop +
              "&start_date=" +
              this.start_date +
              "&end_date=" +
              this.end_date +
              "&payment_provider_filter=" +
              this.paymentProviderFilter +
              "&payment_status_filter=" +
              this.statusFilter,
            {
              responseType: "blob",
              headers: {
                Authorization: "Bearer " + this.$shopify_jwt_token,
                "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
              },
            }
          )
          .then(
            (response) => {
              this.loading_data = false;
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "transaction_billing_report.csv");
              document.body.appendChild(link);
              link.click();
              this.snackbar = true;
              this.snackbar_text ="transaction_billing _report";
              this.snackbar_status = "success";
            },
            (error) => {
              this.snackbar = true;
              this.snackbar_text = error;
              this.snackbar_status = "red";
            }
          );
      }
    },
  },
};
