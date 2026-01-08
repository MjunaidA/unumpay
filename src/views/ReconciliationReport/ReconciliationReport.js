import { ref } from "vue";

export default {
  name: "ReconciliationReport",
  components: {},
  data() {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 7);
    return {
      reportStatus: false,
      loading_data: false,
      range: ref({
        start: start,
        end: today,
      }),
      snackbar: false,
      snackbar_text: "",
      snackbar_timeout: 1000,
      snackbar_status: "success",
      isRtl: this.$i18n.locale === "ar",
      start_date: start.toISOString().split("T")[0],
      end_date: today.toISOString().split("T")[0],
      disabledDates: [
        {
          start: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          end: new Date(9999, 11, 31),
        },
      ],
      search: "",
      menu: false,
      table_loading: false,
      transactions: [],
    };
  },
  created() {
    this.getReport();
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
      if (!this.search) return this.transactions;

      const searchTerm = this.search.toLowerCase();

      return this.transactions.filter((t) => {
        const paymentSourceRaw = String(t.payment_source || "").toLowerCase();

        // translated payment source
        const paymentSourceTranslated = t.payment_source
          ? this.$t(
              `payment_provider.${t.payment_source.toLowerCase()}`
            ).toLowerCase()
          : "";

        return (
          String(t.order_number || "")
            .toLowerCase()
            .includes(searchTerm) ||
          String(`${t.first_name || ""} ${t.last_name || ""}`)
            .toLowerCase()
            .includes(searchTerm) ||
          String(t.email || "")
            .toLowerCase()
            .includes(searchTerm) ||
          String(t.payment_session || "")
            .toLowerCase()
            .includes(searchTerm) ||
          paymentSourceRaw.includes(searchTerm) ||
          paymentSourceTranslated.includes(searchTerm) ||
          this.formatAmount(t.currency_symbol, t.transaction_amount).includes(
            searchTerm
          ) ||
          this.formatAmount(t.currency_symbol, t.total_price).includes(
            searchTerm
          ) ||
          String(t.id || "").includes(this.search) ||
          String(t.created_date || "")
            .toLowerCase()
            .includes(searchTerm) ||
          String(t.created_time || "")
            .toLowerCase()
            .includes(searchTerm)
        );
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
  },
  methods: {
    getReport() {
      this.loading_data = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/reconciliation_report_status?shop=" +
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
            this.reportStatus = response.data.report_status;
            this.loading_data = false;
            if (this.reportStatus == true) {
              this.getTransactions();
            }
          },
          (error) => {
            this.loading_data = false;
            this.snackbar = true;
            this.snackbar_status = "red";
            this.snackbar_text = error.response.data.detail;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          }
        );
    },
    // Get Transactions
    getTransactions() {
      const start = new Date(this.start_date);
      const end = new Date(this.end_date);
      const diffTime = end - start;
      const no_of_days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      console.log(no_of_days)
      if (no_of_days < 0) {
        this.table_loading = false;
        this.snackbar = true;
        this.snackbar_text = "Invalid Date Range";
      } else if (no_of_days >= 0 && no_of_days <= 7) {
        this.table_loading = true;
        this.$Axios
          .get(
            this.$backendURL +
              "/payment_app/reconciliation_report?shop=" +
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
              this.transactions = response.data.transactions;
              this.table_loading = false;
              this.snackbar = true;
              this.snackbar_text = "data_loaded";
              this.snackbar_status = "green";
            },
            (error) => {
              this.table_loading = false;
              this.snackbar = true;
              this.snackbar_status = "red";
              this.snackbar_text = error.response.data.detail;
              if (
                error.response.data.detail ==
                "Session expired, Reopen the application!"
              ) {
                this.$router.push("/error");
              }
            }
          );
      } else {
        this.table_loading = false;
        this.snackbar = true;
        this.snackbar_text = "invalid_date";
        this.snackbar_status = "red";
      }
    },
    // Download Transactions
    downloadTransactions() {
     const start = new Date(this.start_date);
     const end = new Date(this.end_date);
     const diffTime = end - start;
     const no_of_days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
     console.log(no_of_days)
      if (no_of_days < 0) {
        this.csvDownload_loading = false;
        this.snackbar = true;
        this.snackbar_text = "Invalid Date Range";
      } else if (no_of_days >= 0 && no_of_days <= 7) {
        this.csvDownload_loading = true;
        this.$Axios
          .get(
            this.$backendURL +
              "/payment_app/reconciliation_report_csv?shop=" +
              this.$shop +
              "&start_date=" +
              this.start_date +
              "&end_date=" +
              this.end_date,
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
              this.csvDownload_loading = false;
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "paid_transactions_report.csv"); 
              document.body.appendChild(link);
              link.click();
              this.snackbar = true;
              this.snackbar_status = "green";
              this.snackbar_text = "report_downloaded";
            },
            (error) => {
              this.snackbar_status = "red";
              this.snackbar = true;
              this.snackbar_text = error.response.data.detail;
            }
          );
      } else {
        this.snackbar_status = "red";
        this.csvDownload_loading = false;
        this.snackbar = true;
        this.snackbar_text = "file_error";
      }
    },
    applyDateRange() {
      this.menu = false;
      this.getTransactions();
    },
    formatAmount(symbol, amount) {
      return `${symbol || ""}${amount || ""}`.toLowerCase();
    },
  },
};
