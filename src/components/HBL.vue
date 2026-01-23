<template>
    <v-main class="pa-0 cstm-main">
        <v-form ref="form" v-model="isFormValid">
            <v-row v-if="!saveDataLoading">
                <v-col cols="12" md="6" class="config-left-col config-col">
                    <div class="config-col-wrapper">
                        <div class="d-flex justify-space-between pb-4 config-heading-container">
                            <h3 class="pro-heading">{{ $t(`payment_provider.${providerName}`) }}</h3>
                            <div class="cstm-logo"><v-img :src="logo"></v-img>
                            </div>
                        </div>
                        <div class="all-field mt-6">
                            <div class="client-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_name') }}</label>
                                <v-text-field dense color="red darken-2"  :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.shop_name" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="client-email">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_email') }}</label>
                                <v-text-field type="email" dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_email')" :rules="[
                                    v => !!v || $t('payment-providers_page.form.client_email_required'),
                                    v => !v || /.+@.+\..+/.test(v) || $t('payment-providers_page.form.email_address_invalid'),
                                    v => englishRule(v, $t)
                                ]" v-model="formData.hbl_client_email" required  variant="outlined" density="compact"></v-text-field>
                            </div>
                            <div class="client-phone">
                                <label type="tel" class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_phone') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_phone')" :rules="[
                                    v => !!v || $t('payment-providers_page.form.client_phone_required'),
                                    v => !v || /^\+?[0-9]+$/.test(v) || $t('payment-providers_page.form.client_phone_invalid'),
                                    v => englishRule(v, $t)
                                ]" v-model="formData.hbl_client_phone_number" required  variant="outlined" density="compact"></v-text-field>
                            </div>
                            <div class="access-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.access_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.access_key')"
                                    v-model="formData.access_key" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.access_key_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="profile-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.profile_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.profile_id')"
                                    v-model="formData.profile_id" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.profile_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="secret-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.secret_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.secret_key')"
                                    v-model="formData.secret_key" required  variant="outlined" density="compact" 
                                    :rules="[v => !!v || $t('payment-providers_page.form.secret_key_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-define-data">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_define_data3') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_define_data3')"
                                    v-model="formData.merchant_defined_data3" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_define_data3_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>

                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.hide_for_special_countries') }}</label>

                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                    :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'" :placeholder="$t('payment-providers_page.form.select_country_code')" multiple chips
                                     @click:append-inner="show_country = !show_country"
                                      v-model:menu="show_country"
                                     variant="outlined" density="compact" hide-details dense>
                                    <template v-slot:prepend-item>
                                        <v-list-item ripple @click="handleToggleSelectAll">
                                            <v-list-item-action>
                                                <v-icon>
                                                    {{ selectAllIcon }}
                                                </v-icon>
                                            </v-list-item-action>
                                                <v-list-item-title>
                                                    {{ isAllSelected ? $t('payment-providers_page.text.deselect_all') : $t('payment-providers_page.text.select_all') }}
                                                </v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </div>

                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="config-right-col config-col">
                    <div class="config-col-wrapper all-field">
                        <div class="currency-conversion">
                          <h5>{{ $t('payment-providers_page.form.currency_conversion') }}</h5> 
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.multi_currency') }}</span>
                                <v-switch v-model="formData.hbl_multi_currency" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.dual_currency') }}</span>
                                <v-switch v-model="formData.hbl_dual_currency" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                            <div class="store-currency-list mt-3"
                                v-if="formData.hbl_multi_currency == true || formData.hbl_dual_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                <v-select  dense  variant="outlined" density="compact" :items="currency_list"
                                    v-model="formData.hbl_merchant_account_currency" item-value="currency_code"
                                    :append-inner-icon="show_merchant_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_merchant_account_currency"
                                    item-title="currency_code" :placeholder="$t('payment-providers_page.form.merchant_account_currency')" />
                            </div>

                            <div class="switch-conversion-rate" 
                                v-if="formData.hbl_multi_currency == true || formData.hbl_dual_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.conversion_rate') }}</label>
                                <v-text-field dense type="number" color="red darken-2" :placeholder="$t('payment-providers_page.form.conversion_rate')"
                                    v-model="formData.hbl_conversion_rate" required  variant="outlined" density="compact" :rules="[
                                        v => (formData.hbl_multi_currency || formData.hbl_dual_currency) ? !!v || $t('payment-providers_page.form.conversion_rate_required') : true,
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                        </div>
                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.hbl_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description mt-3">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.hbl_client_description"  variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <v-col cols="12" sm="12">
                            <p class="text-primary-color"> <b>{{ $t('payment-providers_page.text.response_url') }}:</b>
                                <a target="_blank" href="https://unumpay.alche.cloud/payment_app/hbl_response/">https://unumpay.alche.cloud/payment_app/hbl_response/</a> </p>
                        </v-col>
                        <v-btn @click="SaveData()" class="save-provider">{{ $t('$vuetify.save') }}</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-form>
    </v-main>
</template>


<script>
import { toggleSelectAll } from "@/utils/selectUtils.js";
import { englishOnlyRule } from "@/utils/selectUtils.js";

export default {
    name: "HBL",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        HBLObj: {
            type: Object,
            required: true
        },
        saveHBLSettings: Function,
        currency_list: Array,
        country_codes: Array,
        AllProviderLoading: {
            type: Boolean,
            default: true,
        },
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            countrySelectedArray: [],
            formData: {
                hbl_client_description: this.HBLObj.credential.client_description,
                shop_name: this.HBLObj.credential.shop_name,
                secret_key: this.HBLObj.credential.secret_key,
                profile_id: this.HBLObj.credential.profile_id,
                access_key: this.HBLObj.credential.access_key,
                hbl_client_phone_number: this.HBLObj.credential.client_phone_number,
                hbl_client_email: this.HBLObj.credential.client_email,
                merchant_defined_data3: this.HBLObj.credential.merchant_defined_data3,
                hbl_is_active: this.HBLObj.credential.is_active,
                hbl_multi_currency: this.HBLObj.credential.multi_currency,
                hbl_dual_currency: this.HBLObj.credential.dual_currency,
                hbl_merchant_account_currency: this.HBLObj.credential.merchant_account_currency,
                hbl_conversion_rate: this.HBLObj.credential.conversion_rate || null,
                hbl_hide_countries_list: this.HBLObj.credential.hide_countries_list,
            },
            logo: this.HBLObj.logo_url,
            displayName: this.HBLObj.transaction_obj.display_name,
            show_hbl_password: false,
            isFormValid: false,
            providerName: this.HBLObj.transaction_obj.provider_name,
            show_country: false,
            show_merchant_account_currency: false,
        };
    },

    computed: {
        isAllSelected() {
            return this.countrySelectedArray.length === this.country_codes.length;
        },
        isPartialSelected() {
            return (
                this.countrySelectedArray.length > 0 &&
                this.countrySelectedArray.length < this.country_codes.length
            );
        },
        selectAllIcon() {
            if (this.isAllSelected) return "mdi-checkbox-marked";
            if (this.isPartialSelected) return "mdi-minus-box";
            return "mdi-checkbox-blank-outline";
        }
    },
    watch: {
        '$i18n.locale'(newVal) {
            this.$emit('update:isRtl', newVal === 'ar');
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
                this.$nextTick(() => this.$refs.form.validate());
            }
        }
    },
    mounted() {
        this.initializeSelectedProviders();
    },
    methods: {
        initializeSelectedProviders() {
            if (this.HBLObj?.credential.hide_countries_list) {
                this.countrySelectedArray = this.HBLObj?.credential.hide_countries_list.split(",").map(s => s.trim());
            }
        },
        handleToggleSelectAll() {
            this.countrySelectedArray = toggleSelectAll(this.countrySelectedArray, this.country_codes);
        },
        englishRule(v) {
            return englishOnlyRule(v, this.$t);
        },
        async SaveData() {
            const result = await this.$refs.form.validate();
            if (result.valid) {
                const finalData = {
                    ...this.formData,
                    hbl_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.saveHBLSettings(finalData);
            } else {
                this.$emit("show-snackbar", {
                    text: this.$t('payment-providers_page.form.form_validation'),
                    status: "error"
                });
            }
        }
    },
};
</script>