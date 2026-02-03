import ContactForm from "../../components/ContactForm.vue";
import ReportSettings from "../../components/ReportSettings.vue";
import AdvanceSettings from "../../components/AdvanceSettings.vue";

export default {
  name: "Settings",
  components: { ContactForm, ReportSettings, AdvanceSettings },
  data() {
    return {
      shop_obj: {},
      activeTab: "contact",
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      contactMethod: "",
      recReportSettings: null,
      recReportSettingsLoading: true,
      advanceSettings: null,
      advanceSettingsLoading: true,
      contactLoading: true,
      page_access: false,
      platinum_plan: false,
      field_loading: true,
      gold_plan: false,
      application_plan: this.$plan_name,
      charge_type_list: [],
      providers_list: [],
      providerListLoading: true,
      country_codes: [],
      snackbar: false,
      snackbar_status: "",
      snackbar_text: "",
      rail: false,
      snackbar_timeout: 2000,
      shopify_api_key_loading: true,
      isRtl: this.$i18n.locale === "ar",
    };
  },
  created() {
    this.initialize();
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
    initialize() {
      this.getContactForm();
      this.initializeArray();
      this.getProviders();
    },
    triggerSnackbar({ text, status }) {
      this.snackbar_text = text;
      this.snackbar_status = status === "error" ? "red" : "green";
      this.snackbar = true;
    },

    // Hide Payment Provider Toggle
    hideProviderToggle() {
      this.$nextTick(() => {
        if (this.shop_obj.selected_country_codes.length > 0) {
          this.shop_obj.selected_country_codes = "";
        } else {
          this.shop_obj.selected_country_codes = this.country_codes.slice();
        }
      });
    },

    // Get Provider List
    getProviders() {
      this.providerListLoading = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/payment_provider_list?shop=" +
            this.$shop,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.providers_list = response.data.providers_list;
            this.providerListLoading = false;
          },
          (error) => {
            this.providerListLoading = false;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },
    saveContactForm(formData) {
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/merchant_contact_details?shop=" +
            this.$shop,
          {
            merchant_full_name: formData.fullName,
            merchant_email: formData.email,
            merchant_phone_number: formData.phone,
            merchant_contact_method: formData.contactMethod,
            merchant_job_title: formData.jobTitle,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
              "Content-Type": "application/json",
            },
          },
        )
        .then(() => {
          this.triggerSnackbar({
            text: "contact_saved_successfully",
            status: "success",
          });
          setTimeout(() => {
            this.getContactForm();
          }, 1000);
        })
        .catch((error) => {
          if (
            error.response.data.detail ==
            "Session expired, Reopen the application!"
          ) {
            this.$router.push("/error");
          }
          this.triggerSnackbar({
            text: error.response.data.detail,
            status: "error",
          });
        });
    },
    getContactForm() {
      this.field_loading = true;
      this.contactLoading = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/merchant_contact_details?shop=" +
            this.$shop,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then((response) => {
          this.fullName = response.data.data.merchant_full_name;
          this.email = response.data.data.merchant_email;
          this.phone = response.data.data.merchant_phone_number;
          this.contactMethod = response.data.data.merchant_contact_method;
          this.jobTitle = response.data.data.merchant_job_title;
          this.field_loading = false;
          this.contactLoading = false;
          this.triggerSnackbar({
            text: "contact_data_loaded_successfully",
            status: "success",
          });
        })
        .catch((error) => {
          this.snackbar = true;
          this.field_loading = false;
          this.contactLoading = false;
          this.triggerSnackbar({
            text: error.response.data.detail,
            status: "error",
          });
          if (
            error.response.data.detail ==
            "Session expired, Reopen the application!"
          ) {
            this.$router.push("/error");
          }
        });
    },
    getRecoReportSettings() {
      this.recReportSettingsLoading = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/reconciliation_report_settings?shop=" +
            this.$shop,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.recReportSettings = response.data;
            this.recReportSettingsLoading = false;
            this.triggerSnackbar({
              text: "reconciliation_data_loaded_successfully",
              status: "success",
            });
          },
          (error) => {
            this.triggerSnackbar({
              text: error.response.data.detail,
              status: "error",
            });
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
            this.recReportSettingsLoading = false;
          },
        );
    },
    downloadGuide() {
      window.open(
        "https://drive.google.com/file/d/1C44DZ38Z_ik7K9TOCISL4R4PD6cnilMQ/view?usp=sharing",
      );
    },
    saveReconcilationForm(formData) {
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/reconciliation_report_settings?shop=" +
            this.$shop,
          {
            shopify_api_key: formData.shopify_api_key,
            shopify_api_password: formData.shopify_api_password,
            shopify_access_token: formData.shopify_access_token,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
              "Content-Type": "application/json",
            },
          },
        )
        .then((response) => {
          console.log("Data saved:", response.data);
          this.triggerSnackbar({
            text: "reconciliation_settings_saved_successfully",
            status: "success",
          });
          setTimeout(() => {
            this.getRecoReportSettings();
          }, 500);
        })
        .catch((error) => {
          this.triggerSnackbar({
            text: error.response.data.detail,
            status: "error",
          });
          if (
            error.response.data.detail ==
            "Session expired, Reopen the application!"
          ) {
            this.$router.push("/error");
          }
        });
    },
    getAdvanceSetting() {
      this.advanceSettingsLoading = true;
      this.$Axios
        .get(
          this.$backendURL + "/payment_app/advance_settings?shop=" + this.$shop,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.advanceSettings = response.data;
            this.advanceSettingsLoading = false;
            this.triggerSnackbar({
              text: "advance_settings_loaded_successfully",
              status: "success",
            });
          },
          (error) => {
            this.triggerSnackbar({
              text: error.response.data.detail,
              status: "error",
            });
            this.shop_obj = {};
            this.advanceSettingsLoading = false;

            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },
    saveAdvanceSettingForm(formData) {
      this.$Axios
        .post(
          this.$backendURL + "/payment_app/advance_settings?shop=" + this.$shop,
          {
            charge_category: formData.charge_category,
            charge_value: formData.charge_value,
            hide_payment_provider: formData.hide_payment_provider,
            is_extra_charge: formData.is_extra_charge,
            is_round_off_amount: formData.is_round_off_amount,
            payment_provider_message: formData.payment_provider_message,
            provider_sorting: formData.provider_sorting,
            selected_country_codes: formData.selected_country_codes,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
              "Content-Type": "application/json",
            },
          },
        )
        .then((response) => {
          console.log("Data saved:", response.data);
           this.triggerSnackbar({
              text: "advance_settings_save_successfully",
              status: "success",
            });
          setTimeout(() => {
            this.getAdvanceSetting();
          }, 500);
        })
        .catch((error) => {
           this.triggerSnackbar({
              text: error.response.data.detail,
              status: "error",
            });
          if (
            error.response.data.detail ==
            "Session expired, Reopen the application!"
          ) {
            this.$router.push("/error");
          }
        });
    },
    // Initialize Data
    initializeArray() {
      this.charge_type_list = ["Fixed Amount", "Percentage"];
      this.country_codes = [
        "AD",
        "AE",
        "AF",
        "AG",
        "AI",
        "AL",
        "AM",
        "AN",
        "AO",
        "AQ",
        "AR",
        "AS",
        "AT",
        "AU",
        "AW",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BL",
        "BM",
        "BN",
        "BO",
        "BR",
        "BS",
        "BT",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CC",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CU",
        "CV",
        "CW",
        "CX",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "EH",
        "ER",
        "ES",
        "ET",
        "FI",
        "FJ",
        "FK",
        "FM",
        "FO",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GG",
        "GH",
        "GI",
        "GL",
        "GM",
        "GN",
        "GQ",
        "GR",
        "GT",
        "GU",
        "GW",
        "GY",
        "HK",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IM",
        "IN",
        "IO",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JE",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KY",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MF",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MO",
        "MP",
        "MR",
        "MS",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NC",
        "NE",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NU",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PF",
        "PG",
        "PH",
        "PK",
        "PL",
        "PM",
        "PN",
        "PR",
        "PS",
        "PT",
        "PW",
        "PY",
        "QA",
        "RE",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SH",
        "SI",
        "SJ",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SX",
        "SY",
        "SZ",
        "TC",
        "TD",
        "TG",
        "TH",
        "TJ",
        "TK",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "UG",
        "UK",
        "US",
        "UY",
        "UZ",
        "VA",
        "VC",
        "VE",
        "VG",
        "VI",
        "VN",
        "VU",
        "WF",
        "WS",
        "XK",
        "YE",
        "YT",
        "ZA",
        "ZM",
        "ZW",
      ];
    },
  },
};
