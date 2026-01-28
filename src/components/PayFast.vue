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
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.payfast_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.payfast_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="secure-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.secured_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.secured_key')"
                                    v-model="formData.payfast_merchant_password" required variant="outlined" density="compact"
                                    :append-inner-icon="show_payfast_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_payfast_password ? 'text' : 'password'"
                                    @click:append-inner="show_payfast_password = !show_payfast_password"
                                    :rules="[v => !!v || $t('payment-providers_page.form.secured_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.hide_for_special_countries') }}</label>
                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                    :placeholder="$t('payment-providers_page.form.select_country_code')" multiple chips
                                    variant="outlined" density="compact" hide-details dense
                                    :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_country">
                                    <template  #prepend-item>
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


                            <div class="currency-conversion">
                                <h5>{{ $t('payment-providers_page.form.currency_conversion') }}</h5>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.switch_currency') }}</span>
                                    <v-switch v-model="formData.payfast_switch_currency" hide-details inset
                                        :true-value="true" color="#000" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false"></v-switch>
                                </div>
                                <div class="account-currency" v-if="formData.payfast_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_store_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.payfast_merchant_store_currency" 
                                        item-value="currency_code" item-title="currency_code"
                                        :placeholder="$t('payment-providers_page.form.merchant_store_currency')"
                                        v-model:menu="show_store_currency"
                                        :append-inner-icon="show_store_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"  />
                                </div>
                                <div class="account-currency" v-if="formData.payfast_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.payfast_merchant_account_currency" 
                                        item-value="currency_code" item-title="currency_code"
                                        :placeholder="$t('payment-providers_page.form.merchant_account_currency')"
                                        v-model:menu="show_account_currency"
                                        :append-inner-icon="show_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"  />
                                </div>
                                <div class="switch-conversion-rate" v-if="formData.payfast_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.switch_conversion_rate') }}</label>
                                    <v-text-field dense type="number" color="red darken-2"
                                        :placeholder="$t('payment-providers_page.form.switch_conversion_rate')" v-model="formData.payfast_conversion_rate"
                                        required variant="outlined" density="compact" :rules="[
                                            v => !formData.payfast_switch_currency || !!v || $t('payment-providers_page.form.switch_conversion_rate_required')
                                        ]"></v-text-field>
                                </div>
                            </div>

                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="config-right-col config-col">
                    <div class="config-col-wrapper all-field">
                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.payfast_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.payfast_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
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
    name: "PayFast",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        PayFastObj: {
            type: Object,
            required: true
        },
        savePayFastSettings: Function,
        currency_list: Array,
        country_codes: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            countrySelectedArray: [],
            formData: {
                payfast_client_name: this.PayFastObj.credential.client_name,
                payfast_client_description: this.PayFastObj.credential.client_description,
                payfast_merchant_id: this.PayFastObj.credential.api_key,
                payfast_merchant_password: this.PayFastObj.credential.secret_key,
                payfast_is_active: this.PayFastObj.credential.is_active,
                payfast_switch_currency: this.PayFastObj.credential.switch_currency,
                payfast_merchant_store_currency: this.PayFastObj.credential.merchant_store_currency,
                payfast_merchant_account_currency: this.PayFastObj.credential.merchant_account_currency,
                payfast_conversion_rate: this.PayFastObj.credential.conversion_rate || 0,
                payfast_hide_countries_list: this.PayFastObj.credential.hide_countries_list,
            },
            logo: this.PayFastObj.logo_url,
            displayName: this.PayFastObj.transaction_obj.display_name,
            show_payfast_password: false,
            isFormValid: false,
            providerName: this.PayFastObj.transaction_obj.provider_name,
            show_country: false,
            show_store_currency: false,
            show_account_currency: false,
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
    mounted() {
        this.initializeSelectedProviders();
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
    methods: {
        initializeSelectedProviders() {
            if (this.PayFastObj?.credential.hide_countries_list) {
                this.countrySelectedArray = this.PayFastObj?.credential.hide_countries_list.split(",").map(s => s.trim());
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
                    payfast_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.savePayFastSettings(finalData);
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