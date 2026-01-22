import AlfalahMPGS from "@/components/AlfalahMPGS.vue";
import AbhiPay from "@/components/AbhiPay.vue";
import AlfalahAPG from "@/components/AlfalahAPG.vue";
import AuthorizeNet from "../../components/AuthorizeNet.vue";
import Blinq from "../../components/Blinq.vue";
import Bop from "../../components/Bop.vue";
import Ccavenue from "../../components/Ccavenue.vue";
import Ccbill from "../../components/Ccbill.vue";
import CheckoutDotCom from "../../components/CheckoutDotCom.vue";
import Citybank from "../../components/Citybank.vue";
import EasyPaisa from "../../components/EasyPaisa.vue";

export default {
  name: "PaymentServiceProviders",
  components: {
    AlfalahMPGS,
    AbhiPay,
    AlfalahAPG,
    AuthorizeNet,
    Blinq,
    Bop,
    Ccavenue,
    Ccbill,
    CheckoutDotCom,
    Citybank,
    EasyPaisa
  },
  data() {
    return {
      search: "",
      isRtl: this.$i18n.locale === "ar",
      activeTab: "overview",
      selectedCountry: "all",
      country_list: [],
      all_country_list_code: [],
      statusSelect: "all",
      statusMenu: false,
      providerMenu: false,
      AllProviderLoading: true,
      AllProviderList: [],
      snackbar: false,
      snackbar_text: "",
      snackbar_status: "",
      snackbar_timeout: 1000,
      selectedProvider: null,
      saveDataLoading: false,
      isCountryMenuOpen: false,
      isStatusMenuOpen: false,
      isSelectorMenuOpen: false,
      currency_list: [
        {
          currency_code: "PKR",
        },
        {
          currency_code: "USD",
        },
        {
          currency_code: "AED",
        },
        {
          currency_code: "GBP",
        },
      ],
      transaction_types_list: [
        "Visa/MasterCard",
        "Alfalah Account",
        "Alfalah Wallet",
        "QR Payment",
        "E-Wallet",
        "BNPL",
        "Card On Delivery",
      ],
      allowed_card_networks_list: [
        "VISA",
        "MASTERCARD",
        "AMEX",
        "CARNET",
        "CARTESBANCAIRES",
        "CUP",
        "DINERSCLUB",
        "DISCOVER",
        "EFTPOS",
        "ELO",
        "JCB",
        "JCREW",
        "MADA",
        "MAESTRO",
        "MEEZA",
        "PAYPAK",
      ],
      allowed_payment_types_list: [
        "APPLEPAY",
        "CHECK",
        "CLICKTOPAY",
        "GOOGLEPAY",
        "PANENTRY",
        "PAZE",
      ],
    };
  },
  created() {
    this.getCountry();
    this.initializeCountries();
    this.getAllProviderData();
  },
  computed: {
    mappedCountries() {
      return this.country_list.map((name) => {
        const country = this.all_country_list_code.find(
          (c) => c.name.toLowerCase() === name.toLowerCase(),
        );

        const code = country?.code || name;

        return {
          title: this.$t(`countries.${code}`),
          value: code,
          props: { class: "select-item" },
        };
      });
    },
    statusOptions() {
      return [
        {
          label: this.$t("status.all"),
          value: "all",
          props: { class: "select-item" },
        },
        {
          label: this.$t("status.active"),
          value: "active",
          props: { class: "select-item" },
        },
        {
          label: this.$t("status.inactive"),
          value: "inactive",
          props: { class: "select-item" },
        },
      ];
    },
    ProviderTitle() {
      return this.AllProviderList.map((item) => ({
        display_name: this.$t(
          `payment_provider.${item.transaction_obj.provider_name}`,
        ),
        provider_name: item.transaction_obj.provider_name,
        props: { class: "select-item" },
      }));
    },
    selectedProviderLabel() {
      const provider = this.ProviderTitle.find(
        (p) => p.id === this.selectedProvider,
      );
      return provider?.display_name || "";
    },
    country_codes() {
      return this.all_country_list_code
        .filter((country) => country.code.toLowerCase() !== "all")
        .map((country) => country.code);
    },
    filteredProviders() {
      return this.AllProviderList.filter((provider) => {
        const t = provider.transaction_obj;
        const c = provider.credential;

        const searchText = (this.search || "").trim().toLowerCase();

        const matchesSearch =
          t.success_transaction.toString().includes(searchText) ||
          t.success_transaction_amount.toString().includes(searchText) ||
          t.success_rate.toString().includes(searchText) ||
          t.country_list?.toLowerCase().includes(searchText) ||
          (this.$t(`payment_provider.${t.provider_name}`) || t.provider_name)
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
          this.statusSelect === "all" ||
          (this.statusSelect === "active" && c.is_active) ||
          (this.statusSelect === "inactive" && !c.is_active);

        const matchesCountry =
          this.selectedCountry === "all" ||
          (t.country_list &&
            t.country_list
              .split(",")
              .map((name) => {
                const country = this.all_country_list_code.find(
                  (c) => c.name.toLowerCase() === name.trim().toLowerCase(),
                );
                return country?.code || name.trim();
              })
              .includes(this.selectedCountry));

        return matchesSearch && matchesStatus && matchesCountry;
      });
    },
  },
  watch: {
    "$i18n.locale"(newVal) {
      this.isRtl = newVal === "ar";
    },
  },
  methods: {
    tabClick() {
      this.activeTab = "configuration";
      this.selectedProvider = null;
      this.providerMenu = false;
    },
    scroll() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    goToConfigSetting(displayName) {
      this.selectedProvider = displayName;
      this.activeTab = "configuration";
      this.scroll();
    },

    getCountry() {
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/provider_country_list?shop=" +
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
            this.country_list = ["all", ...response.data.country_list];
          },
          (error) => {
            this.snackbar_text = error.response.data.detail;
            this.snackbar = true;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },
    getAllProviderData() {
      this.AllProviderLoading = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/service_providers?shop=" +
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
            this.AllProviderList = response.data.payment_providers;
            this.AllProviderLoading = false;
            this.snackbar_status = "success";
            this.snackbar_text = "provider_data_loaded";
            this.snackbar = true;
          },
          (error) => {
            this.snackbar_text = error.response.data.detail;
            this.snackbar = true;
            this.snackbar_status = "red";
            this.AllProviderLoading = false;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },
    triggerSnackbar({ text, status }) {
      this.snackbar_text = text;
      this.snackbar_status = status === "error" ? "red" : "green";
      this.snackbar = true;
    },

    // save and update api
    // Saving BAF Settings
    saveBafSettings(formData) {
      this.saveDataLoading = true;
      this.scroll();
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/baf_configuration?shop=" +
            this.$shop,
          {
            provider_message: formData.baf_provider_message,
            client_name: formData.baf_client_name,
            client_description: formData.baf_client_description,
            password: formData.baf_password,
            api_username: formData.baf_api_username,
            api_password: formData.baf_api_password,
            is_active: formData.baf_is_active,
            merchant_id: formData.baf_merchant_id,
            multi_currency: formData.baf_multi_currency,
            merchant_store_currency: formData.baf_merchant_store_currency,
            merchant_account_currency: formData.baf_merchant_account_currency,
            conversion_rate: formData.baf_conversion_rate,
            other_merchant_id: formData.baf_other_merchant_id,
            other_api_username: formData.baf_other_api_username,
            other_api_password: formData.baf_other_api_password,
            switch_currency: formData.baf_switch_currency,
            switch_store_currency: formData.baf_switch_store_currency,
            switch_account_currency: formData.baf_switch_account_currency,
            switch_conversion_rate: formData.baf_switch_conversion_rate,
            hide_countries_list: formData.baf_hide_countries_list,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "alfalah_mpgs_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.snackbar_status = "success";
            this.snackbar = true;
            this.saveDataLoading = false;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar_status = "red";
            this.snackbar = true;
            this.snackbar_text = error.response.data.detail;
            this.saveDataLoading = false;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving Abhi Pay Settings
    saveAbhiPaySettings(formData) {
      this.saveDataLoading = true;
      this.scroll();
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/abhipay_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.abhipay_client_name,
            client_description: formData.abhipay_client_description,
            merchant_id: formData.abhipay_merchant_id,
            merchant_secret: formData.abhipay_merchant_secret,
            is_active: formData.abhipay_is_active,
            api_version: formData.abhipay_api_version,
            switch_currency: formData.abhipay_switch_currency,
            switch_store_currency: formData.abhipay_switch_store_currency,
            switch_account_currency: formData.abhipay_switch_account_currency,
            switch_conversion_rate: formData.abhipay_switch_conversion_rate,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "abhipay_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.saveDataLoading = false;
            this.snackbar_status = "success";
            this.snackbar = true;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.saveDataLoading = false;
            this.snackbar_status = "red";
            this.snackbar = true;
            this.snackbar_text = error;
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving APG Settings
    saveApgSettings(formData) {
      this.saveDataLoading = true;
      this.scroll();
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/apg_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.apg_client_name,
            client_description: formData.apg_client_description,
            channel_id: formData.apg_channel_id,
            merchant_id: formData.apg_merchant_id,
            store_id: formData.apg_store_id,
            merchant_hash: formData.apg_merchant_hash,
            merchant_username: formData.apg_merchant_username,
            merchant_password: formData.apg_merchant_password,
            merchant_key1: formData.apg_merchant_key1,
            merchant_key2: formData.apg_merchant_key2,
            switch_currency: formData.apg_switch_currency,
            merchant_account_currency: formData.apg_merchant_account_currency,
            conversion_rate: formData.apg_conversion_rate,
            transaction_types: formData.apg_transaction_types,
            is_active: formData.apg_is_active,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "apg_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.saveDataLoading = false;
            this.snackbar_status = "success";
            this.snackbar = true;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
            this.snackbar_text = error;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving Authorize.net Settings
    saveAuthorizeSettings(formData) {
      this.saveDataLoading = true;
      this.scroll();
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/authorize_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.authorize_client_name,
            client_description: formData.authorize_client_description,
            api_login_id: formData.authorize_api_login_id,
            transaction_key: formData.authorize_transaction_key,
            is_active: formData.authorize_is_active,
            switch_currency: formData.authorize_switch_currency,
            merchant_account_currency:
              formData.authorize_merchant_account_currency,
            conversion_rate: formData.authorize_conversion_rate,
            hide_countries_list: formData.authorize_hide_countries_list,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "authorize_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.saveDataLoading = false;
            this.snackbar_status = "success";
            this.snackbar = true;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
            this.snackbar_text = error;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving Blinq Settings
    saveBlinqSettings(formData) {
      this.saveDataLoading = true;
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/blinq_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.blinq_client_name,
            client_description: formData.blinq_client_description,
            client_id: formData.blinq_client_id,
            client_secret: formData.blinq_client_secret,
            is_active: formData.blinq_is_active,
            hide_countries_list: formData.blinq_hide_countries_list,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "blinq_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.snackbar_status = "success";
            this.snackbar = true;
            this.saveDataLoading = false;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.saveDataLoading = false;
            this.snackbar = true;
            this.snackbar_text = error;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving BOP Settings
    saveBopSettings(formData) {
      this.saveDataLoading = true;
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/bop_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.bop_client_name,
            merchant_id: formData.bop_merchant_id,
            client_description: formData.bop_client_description,
            api_username: formData.bop_api_username,
            api_password: formData.bop_api_password,
            is_active: formData.bop_is_active,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "bop_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.saveDataLoading = false;
            this.snackbar_status = "success";
            this.snackbar = true;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
            this.snackbar_text = error.response.data.detail;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving CCAvenue Settings
    saveCCAvenueSettings(formData) {
      this.saveDataLoading = true;
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/ccavenue_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.ccavenue_client_name,
            client_description: formData.ccavenue_client_description,
            merchant_id: formData.ccavenue_merchant_id,
            access_code: formData.ccavenue_access_code,
            enc_key: formData.ccavenue_enc_key,
            whitelist_phone_number: formData.ccavenue_whitelist_phone_number,
            whitelist_email_address: formData.ccavenue_whitelist_email_address,
            is_active: formData.ccavenue_is_active,
            recurring_integration_id:
              formData.ccavenue_recurring_integration_id,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "ccavenue_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.saveDataLoading = false;
            this.snackbar_status = "success";
            this.snackbar = true;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
            this.snackbar_text = error;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving CCBill Settings
    saveCCBillSettings(formData) {
      this.saveDataLoading = true;
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/ccbill_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.ccbill_client_name,
            client_description: formData.ccbill_client_description,
            account_number: formData.ccbill_account_number,
            sub_account_number: formData.ccbill_sub_account_number,
            flexform_id: formData.ccbill_flexform_id,
            salt_key: formData.ccbill_salt_key,
            is_active: formData.ccbill_is_active,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "ccbill_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.saveDataLoading = false;
            this.snackbar_status = "success";
            this.snackbar = true;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
            this.snackbar_text = error;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

    // Saving Checkout Settings
    saveCheckoutSettings(formData) {
      this.saveDataLoading = true;
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/checkout_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.checkout_client_name,
            client_description: formData.checkout_client_description,
            api_key: formData.checkout_api_key,
            processing_channel_id: formData.checkout_processing_channel_id,
            is_active: formData.checkout_is_active,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          },
        )
        .then(
          (response) => {
            this.snackbar_text = "checkout_com_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.snackbar_status = "success";
            this.snackbar = true;
            this.saveDataLoading = false;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
            this.snackbar_text = error.response.data.detail;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
          },
        );
    },

        // Saving CityBank Settings
    saveCityBankSettings(formData) {
      this.saveDataLoading = true;
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/citybank_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.citybank_client_name,
            client_description: formData.citybank_client_description,
            merchant_id: formData.citybank_merchant_id,
            city_bank_password: formData.citybank_password,
            city_bank_username: formData.citybank_username,
            certificate_file_name: formData.citybank_certificate_file_name,
            key_file_name: formData.citybank_key_file_name,
            is_active: formData.citybank_is_active,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          }
        )
        .then(
          (response) => {
            this.snackbar_text = "city_bank_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.snackbar_status = "success";
            this.snackbar = true;
            this.saveDataLoading = false;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
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
    
        // Saving EasyPaisa Settings
    saveEasyPaisaSettings(formData) {
      this.saveDataLoading = true;
      this.redirect_domain = "";
      this.$Axios
        .post(
          this.$backendURL +
            "/payment_app/easypaisa_configuration?shop=" +
            this.$shop,
          {
            client_name: formData.easy_paisa_client_name,
            client_description: formData.easy_paisa_client_description,
            store_id: formData.easy_paisa_store_id,
            hash_key: formData.easy_paisa_hash_key,
            is_active: formData.easy_paisa_is_active,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          }
        )
        .then(
          (response) => {
            this.snackbar_text = "easy_paisa_settings_saved";
            this.redirect_domain = response.data.redirect_domain;
            this.saveDataLoading = false;
            this.snackbar_status = "success";
            this.snackbar = true;
            if (this.redirect_domain != "") {
              window.open(this.redirect_domain);
            }
            this.getAllProviderData();
          },
          (error) => {
            this.snackbar = true;
            this.saveDataLoading = false;
            this.snackbar_status = "red";
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

    initializeCountries() {
      this.all_country_list_code = [
        { name: "Afghanistan", code: "AF" },
        { name: "Åland Islands", code: "AX" },
        { name: "Albania", code: "AL" },
        { name: "Algeria", code: "DZ" },
        { name: "American Samoa", code: "AS" },
        { name: "AndorrA", code: "AD" },
        { name: "Angola", code: "AO" },
        { name: "Anguilla", code: "AI" },
        { name: "Antarctica", code: "AQ" },
        { name: "Antigua and Barbuda", code: "AG" },
        { name: "Argentina", code: "AR" },
        { name: "Armenia", code: "AM" },
        { name: "Aruba", code: "AW" },
        { name: "Australia", code: "AU" },
        { name: "Austria", code: "AT" },
        { name: "Azerbaijan", code: "AZ" },
        { name: "Bahamas", code: "BS" },
        { name: "Bahrain", code: "BH" },
        { name: "Bangladesh", code: "BD" },
        { name: "Barbados", code: "BB" },
        { name: "Belarus", code: "BY" },
        { name: "Belgium", code: "BE" },
        { name: "Belize", code: "BZ" },
        { name: "Benin", code: "BJ" },
        { name: "Bermuda", code: "BM" },
        { name: "Bhutan", code: "BT" },
        { name: "Bolivia", code: "BO" },
        { name: "Bosnia and Herzegovina", code: "BA" },
        { name: "Botswana", code: "BW" },
        { name: "Bouvet Island", code: "BV" },
        { name: "Brazil", code: "BR" },
        { name: "British Indian Ocean Territory", code: "IO" },
        { name: "Brunei Darussalam", code: "BN" },
        { name: "Bulgaria", code: "BG" },
        { name: "Burkina Faso", code: "BF" },
        { name: "Burundi", code: "BI" },
        { name: "Cambodia", code: "KH" },
        { name: "Cameroon", code: "CM" },
        { name: "Canada", code: "CA" },
        { name: "Cape Verde", code: "CV" },
        { name: "Cayman Islands", code: "KY" },
        { name: "Central African Republic", code: "CF" },
        { name: "Chad", code: "TD" },
        { name: "Chile", code: "CL" },
        { name: "China", code: "CN" },
        { name: "Christmas Island", code: "CX" },
        { name: "Cocos (Keeling) Islands", code: "CC" },
        { name: "Colombia", code: "CO" },
        { name: "Comoros", code: "KM" },
        { name: "Congo", code: "CG" },
        { name: "Congo, The Democratic Republic of the", code: "CD" },
        { name: "Cook Islands", code: "CK" },
        { name: "Costa Rica", code: "CR" },
        { name: "Cote D'Ivoire", code: "CI" },
        { name: "Croatia", code: "HR" },
        { name: "Cuba", code: "CU" },
        { name: "Cyprus", code: "CY" },
        { name: "Czech Republic", code: "CZ" },
        { name: "Denmark", code: "DK" },
        { name: "Djibouti", code: "DJ" },
        { name: "Dominica", code: "DM" },
        { name: "Dominican Republic", code: "DO" },
        { name: "Ecuador", code: "EC" },
        { name: "Eqypt", code: "EG" },
        { name: "El Salvador", code: "SV" },
        { name: "Equatorial Guinea", code: "GQ" },
        { name: "Eritrea", code: "ER" },
        { name: "Estonia", code: "EE" },
        { name: "Ethiopia", code: "ET" },
        { name: "Falkland Islands (Malvinas)", code: "FK" },
        { name: "Faroe Islands", code: "FO" },
        { name: "Fiji", code: "FJ" },
        { name: "Finland", code: "FI" },
        { name: "France", code: "FR" },
        { name: "French Guiana", code: "GF" },
        { name: "French Polynesia", code: "PF" },
        { name: "French Southern Territories", code: "TF" },
        { name: "Gabon", code: "GA" },
        { name: "Gambia", code: "GM" },
        { name: "Georgia", code: "GE" },
        { name: "Germany", code: "DE" },
        { name: "Ghana", code: "GH" },
        { name: "Gibraltar", code: "GI" },
        { name: "Greece", code: "GR" },
        { name: "Greenland", code: "GL" },
        { name: "Grenada", code: "GD" },
        { name: "Guadeloupe", code: "GP" },
        { name: "Guam", code: "GU" },
        { name: "Guatemala", code: "GT" },
        { name: "Guernsey", code: "GG" },
        { name: "Guinea", code: "GN" },
        { name: "Guinea-Bissau", code: "GW" },
        { name: "Guyana", code: "GY" },
        { name: "Haiti", code: "HT" },
        { name: "Heard Island and Mcdonald Islands", code: "HM" },
        { name: "Holy See (Vatican City State)", code: "VA" },
        { name: "Honduras", code: "HN" },
        { name: "Hong Kong", code: "HK" },
        { name: "Hungary", code: "HU" },
        { name: "Iceland", code: "IS" },
        { name: "India", code: "IN" },
        { name: "Indonesia", code: "ID" },
        { name: "Iran, Islamic Republic Of", code: "IR" },
        { name: "Iraq", code: "IQ" },
        { name: "Ireland", code: "IE" },
        { name: "Isle of Man", code: "IM" },
        { name: "Israel", code: "IL" },
        { name: "Italy", code: "IT" },
        { name: "Jamaica", code: "JM" },
        { name: "Japan", code: "JP" },
        { name: "Jersey", code: "JE" },
        { name: "Jordan", code: "JO" },
        { name: "Kazakhstan", code: "KZ" },
        { name: "Kenya", code: "KE" },
        { name: "Kiribati", code: "KI" },
        { name: "Korea, Democratic People'S Republic of", code: "KP" },
        { name: "Korea, Republic of", code: "KR" },
        { name: "Kuwait", code: "KW" },
        { name: "Kyrgyzstan", code: "KG" },
        { name: "Lao People'S Democratic Republic", code: "LA" },
        { name: "Latvia", code: "LV" },
        { name: "Lebanon", code: "LB" },
        { name: "Lesotho", code: "LS" },
        { name: "Liberia", code: "LR" },
        { name: "Libyan Arab Jamahiriya", code: "LY" },
        { name: "Liechtenstein", code: "LI" },
        { name: "Lithuania", code: "LT" },
        { name: "Luxembourg", code: "LU" },
        { name: "Macao", code: "MO" },
        { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
        { name: "Madagascar", code: "MG" },
        { name: "Malawi", code: "MW" },
        { name: "Malaysia", code: "MY" },
        { name: "Maldives", code: "MV" },
        { name: "Mali", code: "ML" },
        { name: "Malta", code: "MT" },
        { name: "Marshall Islands", code: "MH" },
        { name: "Martinique", code: "MQ" },
        { name: "Mauritania", code: "MR" },
        { name: "Mauritius", code: "MU" },
        { name: "Mayotte", code: "YT" },
        { name: "Mexico", code: "MX" },
        { name: "Micronesia, Federated States of", code: "FM" },
        { name: "Moldova, Republic of", code: "MD" },
        { name: "Monaco", code: "MC" },
        { name: "Mongolia", code: "MN" },
        { name: "Montserrat", code: "MS" },
        { name: "Morocco", code: "MA" },
        { name: "Mozambique", code: "MZ" },
        { name: "Myanmar", code: "MM" },
        { name: "Namibia", code: "NA" },
        { name: "Nauru", code: "NR" },
        { name: "Nepal", code: "NP" },
        { name: "Netherlands", code: "NL" },
        { name: "Netherlands Antilles", code: "AN" },
        { name: "New Caledonia", code: "NC" },
        { name: "New Zealand", code: "NZ" },
        { name: "Nicaragua", code: "NI" },
        { name: "Niger", code: "NE" },
        { name: "Nigeria", code: "NG" },
        { name: "Niue", code: "NU" },
        { name: "Norfolk Island", code: "NF" },
        { name: "Northern Mariana Islands", code: "MP" },
        { name: "Norway", code: "NO" },
        { name: "Oman", code: "OM" },
        { name: "Pakistan", code: "PK" },
        { name: "Palau", code: "PW" },
        { name: "Palestinian Territory, Occupied", code: "PS" },
        { name: "Panama", code: "PA" },
        { name: "Papua New Guinea", code: "PG" },
        { name: "Paraguay", code: "PY" },
        { name: "Peru", code: "PE" },
        { name: "Philippines", code: "PH" },
        { name: "Pitcairn", code: "PN" },
        { name: "Poland", code: "PL" },
        { name: "Portugal", code: "PT" },
        { name: "Puerto Rico", code: "PR" },
        { name: "Qatar", code: "QA" },
        { name: "Reunion", code: "RE" },
        { name: "Romania", code: "RO" },
        { name: "Russian Federation", code: "RU" },
        { name: "RWANDA", code: "RW" },
        { name: "Saint Helena", code: "SH" },
        { name: "Saint Kitts and Nevis", code: "KN" },
        { name: "Saint Lucia", code: "LC" },
        { name: "Saint Pierre and Miquelon", code: "PM" },
        { name: "Saint Vincent and the Grenadines", code: "VC" },
        { name: "Samoa", code: "WS" },
        { name: "San Marino", code: "SM" },
        { name: "Sao Tome and Principe", code: "ST" },
        { name: "Saudi Arabia", code: "SA" },
        { name: "Senegal", code: "SN" },
        { name: "Serbia and Montenegro", code: "CS" },
        { name: "Seychelles", code: "SC" },
        { name: "Sierra Leone", code: "SL" },
        { name: "Singapore", code: "SG" },
        { name: "Slovakia", code: "SK" },
        { name: "Slovenia", code: "SI" },
        { name: "Solomon Islands", code: "SB" },
        { name: "Somalia", code: "SO" },
        { name: "South Africa", code: "ZA" },
        { name: "South Georgia and the South Sandwich Islands", code: "GS" },
        { name: "Spain", code: "ES" },
        { name: "Sri Lanka", code: "LK" },
        { name: "Sudan", code: "SD" },
        { name: "Suriname", code: "SR" },
        { name: "Svalbard and Jan Mayen", code: "SJ" },
        { name: "Swaziland", code: "SZ" },
        { name: "Sweden", code: "SE" },
        { name: "Switzerland", code: "CH" },
        { name: "Syrian Arab Republic", code: "SY" },
        { name: "Taiwan, Province of China", code: "TW" },
        { name: "Tajikistan", code: "TJ" },
        { name: "Tanzania, United Republic of", code: "TZ" },
        { name: "Thailand", code: "TH" },
        { name: "Timor-Leste", code: "TL" },
        { name: "Togo", code: "TG" },
        { name: "Tokelau", code: "TK" },
        { name: "Tonga", code: "TO" },
        { name: "Trinidad and Tobago", code: "TT" },
        { name: "Tunisia", code: "TN" },
        { name: "Turkey", code: "TR" },
        { name: "Turkmenistan", code: "TM" },
        { name: "Turks and Caicos Islands", code: "TC" },
        { name: "Tuvalu", code: "TV" },
        { name: "Uganda", code: "UG" },
        { name: "Ukraine", code: "UA" },
        { name: "United Arab Emirates", code: "AE" },
        { name: "United Kingdom", code: "GB" },
        { name: "United States", code: "US" },
        { name: "United States Minor Outlying Islands", code: "UM" },
        { name: "Uruguay", code: "UY" },
        { name: "Uzbekistan", code: "UZ" },
        { name: "Vanuatu", code: "VU" },
        { name: "Venezuela", code: "VE" },
        { name: "Viet Nam", code: "VN" },
        { name: "Virgin Islands, British", code: "VG" },
        { name: "Virgin Islands, U.S.", code: "VI" },
        { name: "Wallis and Futuna", code: "WF" },
        { name: "Western Sahara", code: "EH" },
        { name: "Yemen", code: "YE" },
        { name: "Zambia", code: "ZM" },
        { name: "Zimbabwe", code: "ZW" },
        { name: "Eqypt", code: "EQ" },
        { name: "All", code: "all" },
      ];
    },
  },
};
