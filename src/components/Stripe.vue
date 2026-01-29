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
                                    v-model="formData.stripe_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="pub-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.publication_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.publication_key')"
                                    v-model="formData.stripe_stripe_publishable_key" required variant="outlined" density="compact"
                                    :append-inner-icon="show_stripe_main_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_stripe_main_password ? 'text' : 'password'"
                                    @click:append-inner="show_stripe_main_password = !show_stripe_main_password"
                                    :rules="[v => !!v || $t('payment-providers_page.form.publication_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="secret-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.secret_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.secret_key')"
                                    v-model="formData.stripe_stripe_secret_key" required variant="outlined" density="compact"
                                    :append-inner-icon="secret_stripe_main_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="secret_stripe_main_password ? 'text' : 'password'"
                                    @click:append-inner="secret_stripe_main_password = !secret_stripe_main_password"
                                    :rules="[v => !!v || $t('payment-providers_page.form.secret_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.hide_for_special_countries') }}</label>
                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                    :placeholder="$t('payment-providers_page.form.select_country_code')" multiple chips
                                    variant="outlined" density="compact" hide-details dense
                                    :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_country">
                                    <template #prepend-item>
                                        <v-list-item ripple @click="handleToggleSelectAll">
                                            <v-list-item-action>
                                                <v-icon>
                                                    {{ selectAllIcon }}
                                                </v-icon>
                                            </v-list-item-action>
                                                <v-list-item-title>
                                                    {{ isAllSelected ? $t('payment-providers_page.text.deselect_all') :
                                                $t('payment-providers_page.text.select_all') }}
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
                            <div class="d-flex justify-space-between align-center mb-3">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.switch_currency') }}</span>
                                <v-switch v-model="formData.stripe_multi_currency" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                            <div class="store-currency-list mt-3" v-if="formData.stripe_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                <v-select dense variant="outlined" density="compact" :items="currency_list"
                                    v-model="formData.stripe_merchant_account_currency" item-value="currency_code"
                                    item-title="currency_code" :placeholder="$t('payment-providers_page.form.merchant_account_currency')"
                                    :append-inner-icon="show_merchant_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_merchant_account_currency" />
                            </div>

                            <div class="switch-conversion-rate" v-if="formData.stripe_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.conversion_rate') }}</label>
                                <v-text-field dense type="number" color="red darken-2" :placeholder="$t('payment-providers_page.form.conversion_rate')"
                                    v-model="formData.stripe_conversion_rate" required variant="outlined" density="compact" :rules="[
                                        v => formData.stripe_multi_currency ? !!v || $t('payment-providers_page.form.conversion_rate_required') : true,
                                        v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                        </div>
                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12 fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.stripe_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.stripe_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
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
    name: "Stripe",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        StripeObj: {
            type: Object,
            required: true
        },
        saveStripeSettings: Function,
        country_codes: Array,
        currency_list: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            countrySelectedArray: [],
            formData: {
                stripe_client_name: this.StripeObj.credential.client_name,
                stripe_client_description: this.StripeObj.credential.client_description,
                stripe_stripe_publishable_key: this.StripeObj.credential.stripe_publishable_key,
                stripe_stripe_secret_key: this.StripeObj.credential.stripe_secret_key,
                stripe_is_active: this.StripeObj.credential.is_active,
                stripe_multi_currency: this.StripeObj.credential.multi_currency,
                stripe_merchant_account_currency: this.StripeObj.credential.merchant_account_currency,
                stripe_conversion_rate: this.StripeObj.credential.conversion_rate,
                stripe_hide_countries_list: this.StripeObj.credential.hide_countries_list,
            },
            logo: this.StripeObj.logo_url,
            displayName: this.StripeObj.transaction_obj.display_name,
            show_stripe_main_password: false,
            secret_stripe_main_password: false,
            isFormValid: false,
            providerName: this.StripeObj.transaction_obj.provider_name,
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
            if (this.StripeObj?.credential.hide_countries_list) {
                this.countrySelectedArray = this.StripeObj?.credential.hide_countries_list.split(",").map(s => s.trim());
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
                    stripe_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.saveStripeSettings(finalData);
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