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
                                    v-model="formData.ubl_client_name" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="user-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.user_name') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.user_name')"
                                    v-model="formData.ubl_user_name" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.user_name_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.password') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.password')"
                                    v-model="formData.ubl_password" required  variant="outlined" density="compact"
                                    :append-inner-icon="show_ubl_main_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_ubl_main_password ? 'text' : 'password'"
                                    @click:append-inner="show_ubl_main_password = !show_ubl_main_password"
                                    :rules="[v => !!v || $t('payment-providers_page.form.password_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="customer-data">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.customer_data') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.customer_data')"
                                    v-model="formData.ubl_customer_data" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.customer_data_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="currency-conversion">
                                <h5>{{ $t('payment-providers_page.form.currency_conversion') }}</h5>
                                <div class="d-flex justify-space-between align-center mb-3">
                                    <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.switch_currency') }}</span>
                                    <v-switch v-model="formData.ubl_switch_currency" hide-details inset
                                        :true-value="true" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false" color="#000"></v-switch>
                                </div>
                                <div class="store-currency-list mt-3" v-if="formData.ubl_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                    <v-select dense  variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.ubl_merchant_account_currency" item-value="currency_code"
                                        item-title="currency_code" :placeholder="$t('payment-providers_page.form.merchant_account_currency')"
                                        :append-inner-icon="show_merchant_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                        v-model:menu="show_merchant_account_currency" />
                                </div>

                                <div class="switch-conversion-rate" v-if="formData.ubl_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.conversion_rate') }}</label>
                                    <v-text-field dense type="number" color="red darken-2" :placeholder="$t('payment-providers_page.form.conversion_rate')"
                                        v-model="formData.ubl_conversion_rate" required  variant="outlined" density="compact" :rules="[
                                            v => formData.ubl_switch_currency ? !!v || $t('payment-providers_page.form.conversion_rate_required') : true,
                                            v => englishRule(v, $t)
                                        ]"></v-text-field>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col> 
                <v-col cols="12" md="6" class="config-right-col config-col">
                    <div class="config-col-wrapper all-field">
                        <div class="terminal-info">
                            <h5>{{ $t('payment-providers_page.form.terminal_information') }}</h5>
                            <div class="d-flex justify-space-between align-center mb-3">
                                <span class="active-text fontWeight500 fontSize12 fontWeight500 fontSize12">{{ $t('payment-providers_page.form.terminal_information') }}</span>
                                <v-switch v-model="formData.ubl_is_terminal_id" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" :ripple="false" :false-value="false" color="#000"></v-switch>
                            </div>
                            <div v-if="formData.ubl_is_terminal_id == true" class="terminal-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.terminal_name') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.terminal_name')"
                                    v-model="formData.ubl_terminal_name" required  variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div v-if="formData.ubl_is_terminal_id == true" class="store-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.store_name') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.store_name')"
                                    v-model="formData.ubl_store_name" required  variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]"></v-text-field>
                            </div>
                        </div>
                        <div class="payment-provider-status mb-4">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12 fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.ubl_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
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
    name: "UBL",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        UBLObj: {
            type: Object,
            required: true
        },
        saveUBLSettings: Function,
        country_codes: Array,
        currency_list: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                ubl_user_name: this.UBLObj.credential.user_name,
                ubl_password: this.UBLObj.credential.password,
                ubl_customer_data: this.UBLObj.credential.customer_data,
                ubl_client_name: this.UBLObj.credential.client_name,
                ubl_certificate_path: this.UBLObj.credential.certificate_path,
                ubl_switch_currency: this.UBLObj.credential.switch_currency,
                ubl_merchant_account_currency: this.UBLObj.credential.merchant_account_currency,
                ubl_conversion_rate: this.UBLObj.credential.conversion_rate,
                ubl_is_active: this.UBLObj.credential.is_active,
                ubl_is_terminal_id: this.UBLObj.credential.is_terminal_id,
                ubl_terminal_name: this.UBLObj.credential.terminal_name,
                ubl_store_name: this.UBLObj.credential.store_name,
            },
            logo: this.UBLObj.logo_url,
            displayName: this.UBLObj.transaction_obj.display_name,
            show_ubl_main_password: false,
            isFormValid: false,
            providerName: this.UBLObj.transaction_obj.provider_name,
            show_merchant_account_currency: false,
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
                    ...this.formData
                };
                this.saveUBLSettings(finalData);
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