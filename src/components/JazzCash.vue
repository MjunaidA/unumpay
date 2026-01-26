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
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_name') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.jazzcash_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.jazzcash_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_password') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_password')"
                                    v-model="formData.jazzcash_merchant_password" required variant="outlined" density="compact"
                                    :append-inner-icon="show_jazzcash_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_jazzcash_password ? 'text' : 'password'"
                                    @click:append-inner="show_jazzcash_password = !show_jazzcash_password"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_password_required'),
                                        v => englishRule(v, $t) 
                                    ]"></v-text-field>
                            </div>
                            <div class="integrity-salt">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.integrity_salt') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.integrity_salt')"
                                    v-model="formData.jazzcash_integrity_salt" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.integrity_salt_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.dual_currency') }}</span>
                                <v-switch v-model="formData.jazzcash_switch_currency" hide-details inset
                                    :true-value="true" class="custom-switch mt-0" :ripple="false"
                                    :false-value="false" color="#000"></v-switch>
                            </div>
                            <div class="store-currency-list mt-3" v-if="formData.jazzcash_switch_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                <v-select dense variant="outlined" density="compact" :items="currency_list"
                                    v-model="formData.jazzcash_merchant_account_currency" item-value="currency_code"
                                    item-title="currency_code" :placeholder="$t('payment-providers_page.form.merchant_account_currency')"
                                    :append-inner-icon="show_merchant_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_merchant_account_currency" />
                            </div>
                            <div class="switch-conversion-rate" v-if="formData.jazzcash_switch_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.switch_conversion_rate') }}</label>
                                <v-text-field dense type="number" color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.switch_conversion_rate')" v-model="formData.jazzcash_conversion_rate"
                                    required variant="outlined" density="compact" :rules="[
                                        v => !formData.jazzcash_switch_currency || !!v || $t('payment-providers_page.form.switch_conversion_rate_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
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
                                <v-switch v-model="formData.jazzcash_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.jazzcash_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <v-col cols="12" sm="12">
                            <p class="text-primary-color res-url"> <b>{{ $t('payment-providers_page.text.response_url') }}:</b>
                                <a href="https://unumpay.alche.cloud/payment_app/jazzcash_response/">https://unumpay.alche.cloud/payment_app/jazzcash_response/</a> </p>
                        </v-col>
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
    name: "JazzCash",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        JazzCashObj: {
            type: Object,
            required: true
        },
        currency_list: Array,
        saveJazzCashSettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                jazzcash_client_name: this.JazzCashObj.credential.client_name,
                jazzcash_client_description: this.JazzCashObj.credential.client_description,
                jazzcash_merchant_id: this.JazzCashObj.credential.merchant_id,
                jazzcash_merchant_password: this.JazzCashObj.credential.merchant_password,
                jazzcash_integrity_salt: this.JazzCashObj.credential.integrity_salt,
                jazzcash_is_active: this.JazzCashObj.credential.is_active,
                jazzcash_merchant_account_currency: this.JazzCashObj.credential.merchant_account_currency || null,
                jazzcash_switch_currency: this.JazzCashObj.credential.switch_currency,
                jazzcash_conversion_rate: this.JazzCashObj.credential.conversion_rate,
            },
            logo: this.JazzCashObj.logo_url,
            displayName: this.JazzCashObj.transaction_obj.display_name,
            show_jazzcash_password: false,
            isFormValid: false,
            providerName: this.JazzCashObj.transaction_obj.provider_name,
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
                    ...this.formData,
                };
                this.saveJazzCashSettings(finalData);
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