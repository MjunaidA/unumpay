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
                                    v-model="formData.meezan_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="username">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.username') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.username')"
                                    v-model="formData.meezan_username" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.username_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="api-password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.password') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.password')"
                                    v-model="formData.meezan_password" required variant="outlined" density="compact"
                                    :append-inner-icon="show_meezan_main_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_meezan_main_password ? 'text' : 'password'"
                                    @click:append-inner="show_meezan_main_password = !show_meezan_main_password"
                                    :rules="[v => !!v || $t('payment-providers_page.form.password_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="currency-conversion">
                                <h5>{{ $t('payment-providers_page.form.currency_conversion') }}</h5>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.switch_currency') }}</span>
                                    <v-switch v-model="formData.meezan_switch_currency" hide-details inset
                                        :true-value="true" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false" color="#000"></v-switch>
                                </div>
                                <div class="account-currency" v-if="formData.meezan_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.meezan_merchant_account_currency" name="currency_code"
                                        item-value="currency_code" item-title="currency_code"
                                        :placeholder="$t('payment-providers_page.form.merchant_account_currency')"
                                        v-model:menu="show_account_currency"
                                        :append-inner-icon="show_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                                </div>
                                <div class="switch-conversion-rate" v-if="formData.meezan_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.switch_conversion_rate') }}</label>
                                    <v-text-field dense type="number" color="red darken-2"
                                        :placeholder="$t('payment-providers_page.form.switch_conversion_rate')" v-model="formData.meezan_conversion_rate"
                                        required variant="outlined" density="compact"  :rules="[
                                            v => formData.meezan_switch_currency ? !!v || $t('payment-providers_page.form.switch_conversion_rate_required') : true,
                                            v => englishRule(v, $t)
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
                                <v-switch v-model="formData.meezan_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.meezan_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
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
    name: "Meezan",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        MeezanObj: {
            type: Object,
            required: true
        },
        saveMeezanSettings: Function,
        currency_list: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                meezan_client_name: this.MeezanObj.credential.client_name,
                meezan_client_description: this.MeezanObj.credential.client_description,
                meezan_username: this.MeezanObj.credential.meezan_username,
                meezan_password: this.MeezanObj.credential.meezan_password,
                meezan_is_active: this.MeezanObj.credential.is_active,
                meezan_switch_currency: this.MeezanObj.credential.switch_currency,
                meezan_merchant_account_currency: this.MeezanObj.credential.merchant_account_currency || null,
                meezan_conversion_rate: this.MeezanObj.credential.conversion_rate,
            },
            logo: this.MeezanObj.logo_url,
            displayName: this.MeezanObj.transaction_obj.display_name,
            show_meezan_main_password: false,
            isFormValid: false,
            providerName: this.MeezanObj.transaction_obj.provider_name,
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
                this.saveMeezanSettings(finalData);
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