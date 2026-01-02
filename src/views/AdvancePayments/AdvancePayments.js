import AddPayment from "@/components/AddPayment.vue";

export default {
  name: "AdvancePayments",
  components: {AddPayment},
  data() {
    return {
      search: "",
      isRtl: this.$i18n.locale === "ar",
      snackbar: true,
      snackbar_timeout: 1000,
      snackbar_status: "#00000000",
      snackbar_text: "",
      advance_payments: [],
      loading_data: true,
      advance_payment_item: {},
      dialog: false,
      country_list: [],
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
      ],
      editedIndex: -1,
      editedItem: {
        customer_firstname: "",
        customer_lastname: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        country_code: "",
        customer_city: "",
        postal_code: "",
        description: "",
        amount: 0.0,
        currency: "PKR",
      },
      defaultItem: {
        customer_firstname: "",
        customer_lastname: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        country_code: "",
        customer_city: "",
        postal_code: "",
        description: "",
        amount: 0.0,
        currency: "PKR",
      },
    };
  },
  created() {
    this.loadAdvancePayment();
    this.initializeCountries();
  },
  computed: {
    headers() {
      return [
        {
          title: this.$t("advance-payment_table.headers.transaction_id"),
          key: "id",
        },
        {
          title: this.$t("advance-payment_table.headers.name"),
          key: "customer_firstname",
        },
        {
          title: this.$t("advance-payment_table.headers.amount"),
          key: "amount",
        },
        {
          title: this.$t("advance-payment_table.headers.payment_status"),
          key: "payment_status",
        },
        {
          title: this.$t("advance-payment_table.headers.payment_session"),
          key: "payment_session_id",
        },
        {
          title: this.$t("advance-payment_table.headers.payment_link"),
          key: "payment_link",
        },
        {
          title: this.$t("advance-payment_table.headers.transaction_date_time"),
          key: "created_at",
          dataType: "Date",
        },
        {
          title: this.$t("advance-payment_table.headers.action"),
          value: "action",
          sortable: false,
        },
      ];
    },
    searchedAndFilteredTransactions() {
       let search = this.search.toString().toLowerCase();
         return this.advance_payments.filter((item) => {

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

        return matchesSearch;
      });
    }
  },
  methods: {
    initializeCountries() {
      this.country_list = [ 
        {name: 'Afghanistan', code: 'AF'}, 
        {name: 'Åland Islands', code: 'AX'}, 
        {name: 'Albania', code: 'AL'}, 
        {name: 'Algeria', code: 'DZ'}, 
        {name: 'American Samoa', code: 'AS'}, 
        {name: 'AndorrA', code: 'AD'}, 
        {name: 'Angola', code: 'AO'}, 
        {name: 'Anguilla', code: 'AI'}, 
        {name: 'Antarctica', code: 'AQ'}, 
        {name: 'Antigua and Barbuda', code: 'AG'}, 
        {name: 'Argentina', code: 'AR'}, 
        {name: 'Armenia', code: 'AM'}, 
        {name: 'Aruba', code: 'AW'}, 
        {name: 'Australia', code: 'AU'}, 
        {name: 'Austria', code: 'AT'}, 
        {name: 'Azerbaijan', code: 'AZ'}, 
        {name: 'Bahamas', code: 'BS'}, 
        {name: 'Bahrain', code: 'BH'}, 
        {name: 'Bangladesh', code: 'BD'}, 
        {name: 'Barbados', code: 'BB'}, 
        {name: 'Belarus', code: 'BY'}, 
        {name: 'Belgium', code: 'BE'}, 
        {name: 'Belize', code: 'BZ'}, 
        {name: 'Benin', code: 'BJ'}, 
        {name: 'Bermuda', code: 'BM'}, 
        {name: 'Bhutan', code: 'BT'}, 
        {name: 'Bolivia', code: 'BO'}, 
        {name: 'Bosnia and Herzegovina', code: 'BA'}, 
        {name: 'Botswana', code: 'BW'}, 
        {name: 'Bouvet Island', code: 'BV'}, 
        {name: 'Brazil', code: 'BR'}, 
        {name: 'British Indian Ocean Territory', code: 'IO'}, 
        {name: 'Brunei Darussalam', code: 'BN'}, 
        {name: 'Bulgaria', code: 'BG'}, 
        {name: 'Burkina Faso', code: 'BF'}, 
        {name: 'Burundi', code: 'BI'}, 
        {name: 'Cambodia', code: 'KH'}, 
        {name: 'Cameroon', code: 'CM'}, 
        {name: 'Canada', code: 'CA'}, 
        {name: 'Cape Verde', code: 'CV'}, 
        {name: 'Cayman Islands', code: 'KY'}, 
        {name: 'Central African Republic', code: 'CF'}, 
        {name: 'Chad', code: 'TD'}, 
        {name: 'Chile', code: 'CL'}, 
        {name: 'China', code: 'CN'}, 
        {name: 'Christmas Island', code: 'CX'}, 
        {name: 'Cocos (Keeling) Islands', code: 'CC'}, 
        {name: 'Colombia', code: 'CO'}, 
        {name: 'Comoros', code: 'KM'}, 
        {name: 'Congo', code: 'CG'}, 
        {name: 'Congo, The Democratic Republic of the', code: 'CD'}, 
        {name: 'Cook Islands', code: 'CK'}, 
        {name: 'Costa Rica', code: 'CR'}, 
        {name: 'Cote D\'Ivoire', code: 'CI'}, 
        {name: 'Croatia', code: 'HR'}, 
        {name: 'Cuba', code: 'CU'}, 
        {name: 'Cyprus', code: 'CY'}, 
        {name: 'Czech Republic', code: 'CZ'}, 
        {name: 'Denmark', code: 'DK'}, 
        {name: 'Djibouti', code: 'DJ'}, 
        {name: 'Dominica', code: 'DM'}, 
        {name: 'Dominican Republic', code: 'DO'}, 
        {name: 'Ecuador', code: 'EC'}, 
        {name: 'Egypt', code: 'EG'}, 
        {name: 'El Salvador', code: 'SV'}, 
        {name: 'Equatorial Guinea', code: 'GQ'}, 
        {name: 'Eritrea', code: 'ER'}, 
        {name: 'Estonia', code: 'EE'}, 
        {name: 'Ethiopia', code: 'ET'}, 
        {name: 'Falkland Islands (Malvinas)', code: 'FK'}, 
        {name: 'Faroe Islands', code: 'FO'}, 
        {name: 'Fiji', code: 'FJ'}, 
        {name: 'Finland', code: 'FI'}, 
        {name: 'France', code: 'FR'}, 
        {name: 'French Guiana', code: 'GF'}, 
        {name: 'French Polynesia', code: 'PF'}, 
        {name: 'French Southern Territories', code: 'TF'}, 
        {name: 'Gabon', code: 'GA'}, 
        {name: 'Gambia', code: 'GM'}, 
        {name: 'Georgia', code: 'GE'}, 
        {name: 'Germany', code: 'DE'}, 
        {name: 'Ghana', code: 'GH'}, 
        {name: 'Gibraltar', code: 'GI'}, 
        {name: 'Greece', code: 'GR'}, 
        {name: 'Greenland', code: 'GL'}, 
        {name: 'Grenada', code: 'GD'}, 
        {name: 'Guadeloupe', code: 'GP'}, 
        {name: 'Guam', code: 'GU'}, 
        {name: 'Guatemala', code: 'GT'}, 
        {name: 'Guernsey', code: 'GG'}, 
        {name: 'Guinea', code: 'GN'}, 
        {name: 'Guinea-Bissau', code: 'GW'}, 
        {name: 'Guyana', code: 'GY'}, 
        {name: 'Haiti', code: 'HT'}, 
        {name: 'Heard Island and Mcdonald Islands', code: 'HM'}, 
        {name: 'Holy See (Vatican City State)', code: 'VA'}, 
        {name: 'Honduras', code: 'HN'}, 
        {name: 'Hong Kong', code: 'HK'}, 
        {name: 'Hungary', code: 'HU'}, 
        {name: 'Iceland', code: 'IS'}, 
        {name: 'India', code: 'IN'}, 
        {name: 'Indonesia', code: 'ID'}, 
        {name: 'Iran, Islamic Republic Of', code: 'IR'}, 
        {name: 'Iraq', code: 'IQ'}, 
        {name: 'Ireland', code: 'IE'}, 
        {name: 'Isle of Man', code: 'IM'}, 
        {name: 'Israel', code: 'IL'}, 
        {name: 'Italy', code: 'IT'}, 
        {name: 'Jamaica', code: 'JM'}, 
        {name: 'Japan', code: 'JP'}, 
        {name: 'Jersey', code: 'JE'}, 
        {name: 'Jordan', code: 'JO'}, 
        {name: 'Kazakhstan', code: 'KZ'}, 
        {name: 'Kenya', code: 'KE'}, 
        {name: 'Kiribati', code: 'KI'}, 
        {name: 'Korea, Democratic People\'S Republic of', code: 'KP'}, 
        {name: 'Korea, Republic of', code: 'KR'}, 
        {name: 'Kuwait', code: 'KW'}, 
        {name: 'Kyrgyzstan', code: 'KG'}, 
        {name: 'Lao People\'S Democratic Republic', code: 'LA'}, 
        {name: 'Latvia', code: 'LV'}, 
        {name: 'Lebanon', code: 'LB'}, 
        {name: 'Lesotho', code: 'LS'}, 
        {name: 'Liberia', code: 'LR'}, 
        {name: 'Libyan Arab Jamahiriya', code: 'LY'}, 
        {name: 'Liechtenstein', code: 'LI'}, 
        {name: 'Lithuania', code: 'LT'}, 
        {name: 'Luxembourg', code: 'LU'}, 
        {name: 'Macao', code: 'MO'}, 
        {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'}, 
        {name: 'Madagascar', code: 'MG'}, 
        {name: 'Malawi', code: 'MW'}, 
        {name: 'Malaysia', code: 'MY'}, 
        {name: 'Maldives', code: 'MV'}, 
        {name: 'Mali', code: 'ML'}, 
        {name: 'Malta', code: 'MT'}, 
        {name: 'Marshall Islands', code: 'MH'}, 
        {name: 'Martinique', code: 'MQ'}, 
        {name: 'Mauritania', code: 'MR'}, 
        {name: 'Mauritius', code: 'MU'}, 
        {name: 'Mayotte', code: 'YT'}, 
        {name: 'Mexico', code: 'MX'}, 
        {name: 'Micronesia, Federated States of', code: 'FM'}, 
        {name: 'Moldova, Republic of', code: 'MD'}, 
        {name: 'Monaco', code: 'MC'}, 
        {name: 'Mongolia', code: 'MN'}, 
        {name: 'Montserrat', code: 'MS'}, 
        {name: 'Morocco', code: 'MA'}, 
        {name: 'Mozambique', code: 'MZ'}, 
        {name: 'Myanmar', code: 'MM'}, 
        {name: 'Namibia', code: 'NA'}, 
        {name: 'Nauru', code: 'NR'}, 
        {name: 'Nepal', code: 'NP'}, 
        {name: 'Netherlands', code: 'NL'}, 
        {name: 'Netherlands Antilles', code: 'AN'}, 
        {name: 'New Caledonia', code: 'NC'}, 
        {name: 'New Zealand', code: 'NZ'}, 
        {name: 'Nicaragua', code: 'NI'}, 
        {name: 'Niger', code: 'NE'}, 
        {name: 'Nigeria', code: 'NG'}, 
        {name: 'Niue', code: 'NU'}, 
        {name: 'Norfolk Island', code: 'NF'}, 
        {name: 'Northern Mariana Islands', code: 'MP'}, 
        {name: 'Norway', code: 'NO'}, 
        {name: 'Oman', code: 'OM'}, 
        {name: 'Pakistan', code: 'PK'}, 
        {name: 'Palau', code: 'PW'}, 
        {name: 'Palestinian Territory, Occupied', code: 'PS'}, 
        {name: 'Panama', code: 'PA'}, 
        {name: 'Papua New Guinea', code: 'PG'}, 
        {name: 'Paraguay', code: 'PY'}, 
        {name: 'Peru', code: 'PE'}, 
        {name: 'Philippines', code: 'PH'}, 
        {name: 'Pitcairn', code: 'PN'}, 
        {name: 'Poland', code: 'PL'}, 
        {name: 'Portugal', code: 'PT'}, 
        {name: 'Puerto Rico', code: 'PR'}, 
        {name: 'Qatar', code: 'QA'}, 
        {name: 'Reunion', code: 'RE'}, 
        {name: 'Romania', code: 'RO'}, 
        {name: 'Russian Federation', code: 'RU'}, 
        {name: 'RWANDA', code: 'RW'}, 
        {name: 'Saint Helena', code: 'SH'}, 
        {name: 'Saint Kitts and Nevis', code: 'KN'}, 
        {name: 'Saint Lucia', code: 'LC'}, 
        {name: 'Saint Pierre and Miquelon', code: 'PM'}, 
        {name: 'Saint Vincent and the Grenadines', code: 'VC'}, 
        {name: 'Samoa', code: 'WS'}, 
        {name: 'San Marino', code: 'SM'}, 
        {name: 'Sao Tome and Principe', code: 'ST'}, 
        {name: 'Saudi Arabia', code: 'SA'}, 
        {name: 'Senegal', code: 'SN'}, 
        {name: 'Serbia and Montenegro', code: 'CS'}, 
        {name: 'Seychelles', code: 'SC'}, 
        {name: 'Sierra Leone', code: 'SL'}, 
        {name: 'Singapore', code: 'SG'}, 
        {name: 'Slovakia', code: 'SK'}, 
        {name: 'Slovenia', code: 'SI'}, 
        {name: 'Solomon Islands', code: 'SB'}, 
        {name: 'Somalia', code: 'SO'}, 
        {name: 'South Africa', code: 'ZA'}, 
        {name: 'South Georgia and the South Sandwich Islands', code: 'GS'}, 
        {name: 'Spain', code: 'ES'}, 
        {name: 'Sri Lanka', code: 'LK'}, 
        {name: 'Sudan', code: 'SD'}, 
        {name: 'Suriname', code: 'SR'}, 
        {name: 'Svalbard and Jan Mayen', code: 'SJ'}, 
        {name: 'Swaziland', code: 'SZ'}, 
        {name: 'Sweden', code: 'SE'}, 
        {name: 'Switzerland', code: 'CH'}, 
        {name: 'Syrian Arab Republic', code: 'SY'}, 
        {name: 'Taiwan, Province of China', code: 'TW'}, 
        {name: 'Tajikistan', code: 'TJ'}, 
        {name: 'Tanzania, United Republic of', code: 'TZ'}, 
        {name: 'Thailand', code: 'TH'}, 
        {name: 'Timor-Leste', code: 'TL'}, 
        {name: 'Togo', code: 'TG'}, 
        {name: 'Tokelau', code: 'TK'}, 
        {name: 'Tonga', code: 'TO'}, 
        {name: 'Trinidad and Tobago', code: 'TT'}, 
        {name: 'Tunisia', code: 'TN'}, 
        {name: 'Turkey', code: 'TR'}, 
        {name: 'Turkmenistan', code: 'TM'}, 
        {name: 'Turks and Caicos Islands', code: 'TC'}, 
        {name: 'Tuvalu', code: 'TV'}, 
        {name: 'Uganda', code: 'UG'}, 
        {name: 'Ukraine', code: 'UA'}, 
        {name: 'United Arab Emirates', code: 'AE'}, 
        {name: 'United Kingdom', code: 'GB'}, 
        {name: 'United States', code: 'US'}, 
        {name: 'United States Minor Outlying Islands', code: 'UM'}, 
        {name: 'Uruguay', code: 'UY'}, 
        {name: 'Uzbekistan', code: 'UZ'}, 
        {name: 'Vanuatu', code: 'VU'}, 
        {name: 'Venezuela', code: 'VE'}, 
        {name: 'Viet Nam', code: 'VN'}, 
        {name: 'Virgin Islands, British', code: 'VG'}, 
        {name: 'Virgin Islands, U.S.', code: 'VI'}, 
        {name: 'Wallis and Futuna', code: 'WF'}, 
        {name: 'Western Sahara', code: 'EH'}, 
        {name: 'Yemen', code: 'YE'}, 
        {name: 'Zambia', code: 'ZM'}, 
        {name: 'Zimbabwe', code: 'ZW'} 
      ]
    },
    // Get Advance Payments
    loadAdvancePayment() {
      this.loading_data = true;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/advance_payments_app?shop=" +
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
            this.advance_payments = response.data.advance_payments;
            this.loading_data = false;
            this.snackbar = true;
            this.snackbar_status = "success";
            this.snackbar_text = "advance-payment-loaded";
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
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          (this.snackbar_text = "link_copied_success"), (this.snackbar = true);
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
          (this.snackbar_text = "failed_to_copy"), (this.snackbar = true);
        });
    },
    // format date
    formatDate(dateString) {
      if (!dateString) return "";

      const date = new Date(dateString);

      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      return `${formattedDate} - ${formattedTime}`;
    },
    handleSelect(action, item) {
      if (action === "edit") {
        this.editItem(item);
      } else if (action === "generate") {
        this.generateLink(item);
      }
    },
    openAdvancePaymentDialog(){
      this.dialog = true
      this.advance_payment_item = {
        customer_firstname: '',
        customer_lastname: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        country_code: '',
        customer_city: '',
        postal_code: '',
        description: '',
        amount: 0.0,
        currency: this.store_currency,
      }
    },
    generateLink(item) {
      this.loading_data = true;
      var payment_id = item.id;
      this.$Axios
        .get(
          this.$backendURL +
            "/payment_app/advance_payments_link_generation?shop=" +
            this.$shop +
            "&payment_id=" +
            payment_id,
          {
            headers: {
              Authorization: "Bearer " + this.$shopify_jwt_token,
              "Custom-Authorization": this.$API_TOKEN.replace("%20", " "),
            },
          }
        )
        .then(
          (response) => {
            console.log(response);
            this.loading_data = false;
            this.snackbar = true;
            this.snackbar_status = "green";
            this.snackbar_text = "Advance Paymnent Link Generated";
            this.loadAdvancePayment();
            console.clear();
          },
          (error) => {
            this.loading_data = false;
            this.snackbar = true;
            this.snackbar_text = error.response.data.detail;
            this.snackbar_status = "red";
            if (
              error.response.data.detail ==
              "Session expired, Reopen the application!"
            ) {
              this.$router.push("/error");
            }
            console.clear();
          }
        );
    },
    // Edit Dialog
    editItem(item) {
      this.editedIndex = this.advance_payments.indexOf(item);
      this.advance_payment_item = Object.assign({}, item);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false
      this.$nextTick(() => {
          this.advance_payment_item = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
      })
    },
       // Save & Update Advance Payment
    postAdvancePayment() {
      this.loading_data = true;

      let is_valid = true
      let validation_description = ""

      if (this.advance_payment_item.customer_firstname == '') {
        is_valid = false
        validation_description = "First Name is Missing"
      }
      
      if (this.advance_payment_item.customer_lastname == '') {
        is_valid = false
        validation_description = "Last Name is Missing"
      }

      if (this.advance_payment_item.customer_email == '') {
        is_valid = false
        validation_description = "Email is Missing"
      }

      if (this.advance_payment_item.customer_phone == '') {
        is_valid = false
        validation_description = "Phone is Missing"
      }

      if (this.advance_payment_item.customer_address == '') {
        is_valid = false
        validation_description = "Address is Missing"
      }

      if (this.advance_payment_item.country_code == '') {
        is_valid = false
        validation_description = "Country is Missing"
      }

      if (this.advance_payment_item.customer_city == '') {
        is_valid = false
        validation_description = "City is Missing"
      }

      if (this.advance_payment_item.postal_code == '') {
        is_valid = false
        validation_description = "Postal Code is Missing"
      }

      if (this.advance_payment_item.description == '') {
        is_valid = false
        validation_description = "Description is Missing"
      }

      if (this.advance_payment_item.amount <= 0.0) {
        is_valid = false
        validation_description = "Amount will be greator than 0"
      }

      if (is_valid == true) {
        if (this.advance_payment_item.id == null) {
          this.$Axios.post(this.$backendURL + "/payment_app/advance_payments_app?shop=" + this.$shop, {
            shop: this.$shop,
            customer_firstname: this.advance_payment_item.customer_firstname,
            customer_lastname: this.advance_payment_item.customer_lastname,
            customer_email: this.advance_payment_item.customer_email,
            customer_phone: this.advance_payment_item.customer_phone,
            customer_address: this.advance_payment_item.customer_address,
            country_code: this.advance_payment_item.country_code,
            customer_city: this.advance_payment_item.customer_city,
            postal_code: this.advance_payment_item.postal_code,
            description: this.advance_payment_item.description,
            amount: this.advance_payment_item.amount,
            currency: this.advance_payment_item.currency,
          }, {
            headers: {
              'Authorization': "Bearer " + this.$shopify_jwt_token,
              'Custom-Authorization': this.$API_TOKEN.replace('%20', ' ')
            }
          }).then((response) => {
            console.log(response);
            this.loading_data = false;
            this.snackbar = true;
            this.snackbar_text = "Adavce Paymnent Entry Saved";
            this.snackbar_status = "green"
            this.closeDialog()
            this.loadAdvancePayment()
            console.clear()
          }, (error) => {
            this.loading_data = false;
            this.snackbar = true;
            this.snackbar_text = error.response.data.detail;
            this.snackbar_status = "red"
            if (error.response.data.detail == "Session expired, Reopen the application!") {
              this.$router.push('/error')
            }
            console.clear()
          });
        } else {
          this.$Axios.put(this.$backendURL + "/payment_app/advance_payments_app?shop=" + this.$shop + "&id=" + this.advance_payment_item.id, {
            id: this.advance_payment_item.id,
            shop: this.$shop,
            customer_firstname: this.advance_payment_item.customer_firstname,
            customer_lastname: this.advance_payment_item.customer_lastname,
            customer_email: this.advance_payment_item.customer_email,
            customer_phone: this.advance_payment_item.customer_phone,
            customer_address: this.advance_payment_item.customer_address,
            country_code: this.advance_payment_item.country_code,
            customer_city: this.advance_payment_item.customer_city,
            postal_code: this.advance_payment_item.postal_code,
            description: this.advance_payment_item.description,
            amount: this.advance_payment_item.amount,
            currency: this.advance_payment_item.currency,
          }, {
            headers: {
              'Authorization': "Bearer " + this.$shopify_jwt_token,
              'Custom-Authorization': this.$API_TOKEN.replace('%20', ' ')
            }
          }).then((response) => {
            console.log(response);
            this.snackbar = true;
            this.loading_data = false;
            this.snackbar_text = "Adavce Paymnent Entry Saved";
            this.snackbar_status = "green"
            this.closeDialog()
            this.loadAdvancePayment()
            console.clear()
          }, (error) => {
            console.log(error);
            this.snackbar = true;
            this.loading_data = false;
            this.snackbar_text = error.response.data.detail;
            this.snackbar_status = "red"
            if (error.response.data.detail == "Session expired, Reopen the application!") {
              this.$router.push('/error')
            }
            console.clear()
          });
        }
      } else {
        this.snackbar = true;
        this.loading_data = false;
        this.snackbar_text = validation_description;
      }
    },

    downloadVideo() {
      window.open("https://drive.google.com/file/d/1zkwiRRTLMZGgMpBkOTa2r7ex-89JmixT/view?usp=sharing")
    },
  },
  watch: {
    "$i18n.locale"(newVal) {
      this.isRtl = newVal === "ar";
    },
  },
};
