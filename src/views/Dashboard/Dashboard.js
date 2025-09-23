import LineChart from "../../components/LineChart.vue";
export default {
  name: "Dashboard",
  data() {
    return {
      stats_loading: true,
      contactAlertLoading: true,
      menuOpen: false,
      dashboard_stats: {},
      shop_currency: "",
      snackbar: true,
      snackbar_timeout: 1000,
      snackbar_status: "#00000000",
      snackbar_text: "",
      isRtl: this.$i18n.locale === "ar",
      selectedRange: "6m",
      monthlyChartData: [],
      datacollection: {
        labels: [],
        datasets: [],
      },
    };
  },
  components: { LineChart },
  created() {
    this.getStatsApi();
    this.graphApi();
  },
  methods: {
    selectOption(option) {
      this.selectedRange = option;
      this.menu = false;
      this.updateChartData();
    },
    getTranslatedMonth(rawMonth) {
      if (!rawMonth) return "";
      const [month, year] = rawMonth.split("-");
      return `${this.$t("months." + month.toLowerCase())} ${year}`;
    },
    updateChartData() {
      const is6Months = this.selectedRange === "6m";
      const length = is6Months ? 6 : 12;

      const sliced = this.monthlyChartData.slice(0, length);

      this.datacollection = {
        labels: sliced.map((item) => this.getTranslatedMonth(item.month)),
        datasets: [
          {
            key: "Revenue",
            label: this.$t("chart.revenue"),
            data: sliced.map((item) => item.revenue),
            borderColor: "#00C853",
            backgroundColor: "#00C853",
            tension: 0.4,
            fill: false,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            key: "Transactions",
            label: this.$t("chart.transactions"),
            data: sliced.map((item) => item.transactions),
            borderColor: "#536DFE",
            backgroundColor: "#536DFE",
            tension: 0.4,
            fill: false,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      };
    },
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
    graphApi() {
      this.$Axios
        .get(
          this.$backendURL + "/payment_app/dashboard_graph?shop=" + this.$shop,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          }
        )
        .then(
          (response) => {
            this.monthlyChartData = response.data.data;
            this.updateChartData();
            this.snackbar = true;
            this.snackbar_text = "stats_data_loaded";
            this.snackbar_status = "green";
          },
          (error) => {
            this.snackbar = true;
            this.snackbar_status = "red";
            this.snackbar_text = error.response.data.detail;
            if (
              error.response.data.detail ==
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
  computed: {
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        options: {
          locale: this.isRtl ? "ar" : "en",
          layout: {
            padding: 10,
          },
        },
        plugins: {
          legend: {
            rtl: this.isRtl,
            textDirection: this.isRtl ? "rtl" : "ltr",
            display: true,
            position: "bottom",
            labels: {
              usePointStyle: true,
              boxWidth: 6,
              boxHeight: 6,
              pointStyle: "circle",
              color: "#000",
              font: {
                size: 12,
                weight: "600",
                family: "Inter, sans-serif",
              },
              padding: 10,
            },
          },
          tooltip: {
            rtl: this.isRtl,
            enabled: false,
            external: (context) => {
              const tooltipModel = context.tooltip;
              const currency = this.shop_currency || "";

              let tooltipEl = document.getElementById("chartjs-tooltip");
              if (!tooltipEl) {
                tooltipEl = document.createElement("div");
                tooltipEl.id = "chartjs-tooltip";
                document.body.appendChild(tooltipEl);
              }

              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }

              // Position
              const position = context.chart.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = 1;

              const tooltipWidth = tooltipEl.offsetWidth;
              const tooltipHeight = tooltipEl.offsetHeight;

              // Horizontal positioning
              let left =
                position.left +
                window.pageXOffset +
                tooltipModel.caretX -
                (this.isRtl ? tooltipWidth : 0); // shift for RTL

              // Keep inside viewport
              left = Math.max(left, 0);
              left = Math.min(left, window.innerWidth - tooltipWidth);

              // Vertical positioning
              let top =
                position.top +
                window.pageYOffset +
                tooltipModel.caretY -
                tooltipHeight -
                10;
              top = Math.max(top, 0);

              tooltipEl.style.left = left + "px";
              tooltipEl.style.top = top + "px";

              // Build content
              let innerHTML = "";

              // Date (title)
              if (tooltipModel.title.length) {
                innerHTML += `<div class="tooltip-date">${tooltipModel.title[0]}</div>`;
              }

              // Dataset values with colors
              tooltipModel.dataPoints.forEach((dp) => {
                let color = "#000";
                if (dp.dataset.key === "Revenue") color = "#04A551";
                if (dp.dataset.key === "Transactions") color = "#636DFE";

                const valueText =
                  dp.dataset.key === "Revenue"
                    ? this.isRtl
                      ? `${this.$t("chart.revenue")}: ${
                          dp.formattedValue
                        } ${currency}`
                      : `${this.$t("chart.revenue")}: ${currency} ${
                          dp.formattedValue
                        }`
                    : dp.dataset.key === "Transactions"
                    ? `${this.$t("chart.transactions")}: ${dp.formattedValue}`
                    : `${dp.dataset.label}: ${dp.formattedValue}`;

                innerHTML += `<div style="color:${color}">${valueText}</div>`;
              });

              // Footer (optional, e.g., Unumpay fee)
              const revenueItem = tooltipModel.dataPoints.find(
                (dp) => dp.dataset.key === "Revenue"
              );
              if (revenueItem) {
                const index = revenueItem.dataIndex;
                const charges = this.monthlyChartData?.[index]?.charges ?? null;
                if (charges !== null) {
                  innerHTML += `<div class="unumpay-tooltip" style="text-align:${
                    this.isRtl ? "right" : "left"
                  }">
      ${this.$t("chart.unumpay_fee")}: ${
                    this.isRtl
                      ? charges + " " + currency
                      : currency + " " + charges
                  }
    </div>`;
                }
              }

              tooltipEl.innerHTML = innerHTML;
            },
            mode: "index",
            displayColors: false,
            usePointStyle: false,
            intersect: true,
            backgroundColor: "#fff",
            titleColor: "#000",
            bodyColor: "#000",
            borderColor: "#e7e7e7",
            borderWidth: 1,
            boxPadding: 6,
            padding: 12,
            titleMarginBottom: 12,
            footerMarginTop: 12,
            bodySpacing: 6,
          },
        },
        scales: {
          y: {
            reverse: false,
            beginAtZero: true,
            ticks: {
              color: "#000",
              stepSize: 10000,
              font: {
                size: 14,
              },
            },
            grid: {
              color: "#ebeaea",
              lineWidth: 1,
            },
          },
          x: {
            reverse: this.isRtl,
            offset: true,
            ticks: {
              color: "#000",
              mirror: false,
              align: "center",
              font: {
                size: 14,
              },
              
            },
            grid: {
              color: "#ebeaea",
            },
          },
        },
      };
    },
  },
  watch: {
    "$i18n.locale"(newVal) {
      this.isRtl = newVal === "ar";
      this.updateChartData();
    },
    shop_currency() {
      this.updateChartData();
    },
  },
};
