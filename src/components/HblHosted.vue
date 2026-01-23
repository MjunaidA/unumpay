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
                                    v-model="formData.hbl_hosted_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="client-email">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_email') }}</label>
                                <v-text-field type="email" dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_email')" :rules="[
                                    v => !!v || $t('payment-providers_page.form.client_email_required'),
                                    v => !v || /.+@.+\..+/.test(v) || $t('payment-providers_page.form.client_email_invalid'),
                                    v => englishRule(v, $t)
                                ]" v-model="formData.hbl_hosted_client_email" required variant="outlined" density="compact"></v-text-field>
                            </div>
                            <div class="client-phone">
                                <label type="tel" class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_phone') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_phone')" :rules="[
                                    v => !!v || $t('payment-providers_page.form.client_phone_required'),
                                    v => !v || /^\+?[0-9]+$/.test(v) || $t('payment-providers_page.form.client_phone_invalid'),
                                    v => englishRule(v, $t)
                                ]" v-model="formData.hbl_hosted_client_phone_number" required variant="outlined" density="compact"></v-text-field>
                            </div>
                            <div class="clien-user-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_user_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_user_id')"
                                    v-model="formData.hbl_hosted_client_user_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_user_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="client-password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_password') }}</label>
                                <v-text-field color="red darken-2" :placeholder="$t('payment-providers_page.form.client_password')"
                                    v-model="formData.hbl_hosted_client_password" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_password_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>

                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.hide_for_special_countries') }}</label>

                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                    :placeholder="$t('payment-providers_page.form.select_country_code')" multiple chips
                                    variant="outlined" density="compact" hide-details dense
                                    :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'" v-model:menu="show_country">
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
                                <v-switch v-model="formData.hbl_hosted_multi_currency" hide-details inset
                                    :true-value="true" class="custom-switch mt-0" :ripple="false"
                                    :false-value="false" color="#000"></v-switch>
                            </div>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.dual_currency') }}</span>
                                <v-switch v-model="formData.hbl_hosted_dual_currency" hide-details inset
                                    :true-value="true" class="custom-switch mt-0" :ripple="false"
                                    :false-value="false" color="#000"></v-switch>
                            </div>
                            <div class="store-currency-list mt-3"
                                v-if="formData.hbl_hosted_multi_currency == true || formData.hbl_hosted_dual_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                <v-select dense variant="outlined" density="compact" :items="currency_list"
                                    v-model="formData.hbl_hosted_merchant_account_currency" item-value="currency_code"
                                    item-title="currency_code" :placeholder="$t('payment-providers_page.form.merchant_account_currency')"
                                    :append-inner-icon="show_merchant_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_merchant_account_currency" />
                            </div>

                            <div class="switch-conversion-rate"
                                v-if="formData.hbl_hosted_multi_currency == true || formData.hbl_hosted_dual_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.conversion_rate') }}</label>
                                <v-text-field dense type="number" color="red darken-2" :placeholder="$t('payment-providers_page.form.conversion_rate')"
                                    v-model="formData.hbl_hosted_conversion_rate" required variant="outlined" density="compact" :rules="[
                                        v => (formData.hbl_hosted_multi_currency || formData.hbl_hosted_dual_currency) ? !!v || $t('payment-providers_page.form.conversion_rate_required') : true,
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                        </div>
                        <div class="payment-provider-status mt-3 mb-3">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.hbl_hosted_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description mt-3">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.hbl_hosted_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                            <div class="public-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.public_key') }}</label>
                                <v-textarea color="red darken-2" :placeholder="$t('payment-providers_page.form.public_key')"
                                    v-model="formData.hbl_hosted_public_key" variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.public_key_required'),
                                        v => englishRule(v, $t)
                                    ]" />
                            </div>
                            <div class="private-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.private_key') }}</label>
                                <v-textarea color="red darken-2" :placeholder="$t('payment-providers_page.form.private_key')"
                                    v-model="formData.hbl_hosted_private_key" variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.private_key_required'),
                                        v => englishRule(v, $t)
                                    ]" />
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
    name: "HBLHosted",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        HblHostedObj: {
            type: Object,
            required: true
        },
        saveHBLHostedSettings: Function,
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
                hbl_hosted_client_name: this.HblHostedObj.credential.client_name,
                hbl_hosted_client_description: this.HblHostedObj.credential.client_description,
                hbl_hosted_client_phone_number: this.HblHostedObj.credential.client_phone_number,
                hbl_hosted_client_email: this.HblHostedObj.credential.client_email,
                hbl_hosted_client_user_id: this.HblHostedObj.credential.client_user_id,
                hbl_hosted_client_password: this.HblHostedObj.credential.client_password,
                hbl_hosted_public_key: this.HblHostedObj.credential.public_key,
                hbl_hosted_private_key: this.HblHostedObj.credential.private_key,
                hbl_hosted_is_active: this.HblHostedObj.credential.is_active,
                hbl_hosted_multi_currency: this.HblHostedObj.credential.multi_currency,
                hbl_hosted_dual_currency: this.HblHostedObj.credential.dual_currency,
                hbl_hosted_merchant_account_currency: this.HblHostedObj.credential.merchant_account_currency || null,
                hbl_hosted_conversion_rate: this.HblHostedObj.credential.conversion_rate,
                hbl_hosted_hide_countries_list: this.HblHostedObj.credential.hide_countries_list,
            },
            logo: this.HblHostedObj.logo_url,
            displayName: this.HblHostedObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.HblHostedObj.transaction_obj.provider_name,
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
            if (this.HblHostedObj?.credential.hide_countries_list) {
                this.countrySelectedArray = this.HblHostedObj?.credential.hide_countries_list.split(",").map(s => s.trim());
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
                    hbl_hosted_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.saveHBLHostedSettings(finalData);
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