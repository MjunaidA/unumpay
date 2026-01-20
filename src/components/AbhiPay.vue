<template>
    <v-main class="pa-0 cstm-main">
        <v-form ref="form" v-model="isFormValid">
            <v-row v-if="!saveDataLoading">
                <v-col cols="12" md="6" class="config-left-col config-col">
                    <div class="config-col-wrapper">
                        <div class="d-flex justifyBetween pb-4 config-heading-container">
                            <h3 class="pro-heading">{{ $t(`payment_provider.${providerName}`) }}</h3>
                            <div class="cstm-logo"><v-img :src="logo"></v-img>
                            </div>
                        </div>
                        <div class="all-field mt-6">
                            <div class="client-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_name') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.client_name')" :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v, $t)
                                    ]" v-model="formData.abhipay_client_name" required variant="outlined"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                    v => englishRule(v, $t)
                                    ]"
                                    v-model="formData.abhipay_merchant_id" required variant="outlined"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="merchant-secret">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_secret') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_secret')"
                                    v-model="formData.abhipay_merchant_secret" required variant="outlined"
                                    density="compact" :rules="[v => !!v || $t('payment-providers_page.form.merchant_secret_required'),
                                    v => englishRule(v, $t)
                                    ]"
                                    :append-inner-icon="show_abhipay_password ? 'mdi-eye' : 'mdi-eye-off'"
                                     v-model:menu="show_abhipay_password"
                                    :type="show_abhipay_password ? 'text' : 'password'"
                                    @click:append-inner="show_abhipay_password = !show_abhipay_password"
                                    ></v-text-field>
                            </div>
                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.api_version') }}</label>
                                <v-select  dense variant="outlined" density="compact"
                                    :items="['v2', 'v3']" v-model="formData.abhipay_api_version"
                                    name="abhipay_api_version" item-value="abhipay_api_version"
                                    item-title="abhipay_api_version" :placeholder="$t('payment-providers_page.form.api_version')"
                                    v-model:menu="show_api_key"
                                    :append-inner-icon="show_api_key ? 'mdi-chevron-up' : 'mdi-chevron-down'"/>
                            </div>
                            <div class="currency-conversion">
                                <h5>{{ $t('payment-providers_page.form.currency_conversion') }}</h5>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.switch_currency') }}</span>
                                    <v-switch v-model="formData.abhipay_switch_currency" hide-details inset
                                        :true-value="true" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false" color="#000"></v-switch>
                                </div>
                                <div class="store-currency-list mt-3" v-if="formData.abhipay_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_merchant_store_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.abhipay_switch_store_currency" item-value="currency_code"
                                        item-title="currency_code" :placeholder="$t('payment-providers_page.form.switch_merchant_store_currency')"
                                        v-model:menu="show_store_currency"
                                        :append-inner-icon="show_store_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                                </div>
                                <div class="account-currency" v-if="formData.abhipay_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_merchant_account_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.abhipay_switch_account_currency" name="currency_code"
                                        item-value="currency_code" item-title="currency_code"
                                        :placeholder="$t('payment-providers_page.form.switch_merchant_account_currency')"
                                        v-model:menu="show_account_currency"
                                        :append-inner-icon="show_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                                </div>
                                <div class="switch-conversion-rate" v-if="formData.abhipay_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_conversion_rate') }}</label>
                                    <v-text-field dense type="number" color="red darken-2"
                                        :placeholder="$t('payment-providers_page.form.switch_conversion_rate')"
                                        v-model="formData.abhipay_switch_conversion_rate" required variant="outlined"
                                        density="compact" :rules="[
                                            v => !formData.abhipay_switch_currency || !!v || $t('payment-providers_page.form.switch_conversion_rate_required')
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
                                <v-switch v-model="formData.abhipay_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" :ripple="false" :false-value="false" color="#000"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.abhipay_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]"  />
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
import { englishOnlyRule } from "@/utils/selectUtils.js";

export default {
    name: "AbhiPay",
    props: {
        AbhiPayObj: {
            type: Object,
            required: true
        },
        saveAbhiPaySettings: Function,
        currency_list: Array,
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
            formData: {
                abhipay_client_name: this.AbhiPayObj?.credential?.client_name,
                abhipay_client_description: this.AbhiPayObj?.credential.client_description,
                abhipay_merchant_id: this.AbhiPayObj?.credential.merchant_id,
                abhipay_merchant_secret: this.AbhiPayObj?.credential.merchant_secret,
                abhipay_is_active: this.AbhiPayObj?.credential.is_active,
                abhipay_api_version: this.AbhiPayObj?.credential.api_version,
                abhipay_switch_currency: this.AbhiPayObj?.credential.switch_currency,
                abhipay_switch_store_currency: this.AbhiPayObj?.credential.switch_store_currency,
                abhipay_switch_account_currency: this.AbhiPayObj?.credential.switch_account_currency,
                abhipay_switch_conversion_rate: this.AbhiPayObj?.credential.switch_conversion_rate,

            },
            show_abhipay_password: false,
            show_api_key: false,
            logo: this.AbhiPayObj.logo_url,
            displayName: this.AbhiPayObj.transaction_obj.display_name,
            providerName: this.AbhiPayObj.transaction_obj.provider_name,
            isFormValid: false,
            show_store_currency: false,
            show_account_currency: false,
        };
    },
    computed: {
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
        englishRule(v) {
            return englishOnlyRule(v, this.$t);
        },
        async SaveData() {
            const result = await this.$refs.form.validate();
            if (result.valid) {
                const finalData = {
                    ...this.formData,
                };
                this.saveAbhiPaySettings(finalData);
            } else {
                this.$emit("show-snackbar", {
                    text: this.$t('payment-providers_page.form.form_validation'),
                    status: "error"
                });
            }


        }
    },
}
</script>