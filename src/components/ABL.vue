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
                                    v-model="formData.shop_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="client-email">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_email') }}</label>
                                <v-text-field type="email" dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_email')" :rules="[
                                    v => !!v || $t('payment-providers_page.form.client_email_required'),
                                    v => !v || /.+@.+\..+/.test(v) || $t('payment-providers_page.form.email_address_invalid'),
                                    v => englishRule(v, $t)
                                ]" v-model="formData.abl_client_email" required variant="outlined" density="compact"></v-text-field>
                            </div>
                            <div class="client-phone">
                                <label type="tel" class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_phone') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_phone')" :rules="[
                                    v => !!v || $t('payment-providers_page.form.client_phone_required'),
                                    v => !v || /^\+?[0-9]+$/.test(v) || $t('payment-providers_page.form.client_phone_invalid'),
                                    v => englishRule(v, $t)
                                ]" v-model="formData.abl_client_phone_number" required variant="outlined" density="compact"></v-text-field>
                            </div>
                            <div class="access-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.access_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.access_key')"
                                    v-model="formData.abl_access_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.access_key_required'),
                                         v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="profile-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.profile_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.profile_id')"
                                    v-model="formData.abl_profile_id" required variant="outlined" density="compact" 
                                    :rules="[v => !!v || $t('payment-providers_page.form.profile_id_required'),
                                         v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="secret-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.secret_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.secret_key')"
                                    v-model="formData.abl_secret_key" required variant="outlined" density="compact" 
                                    :rules="[v => !!v || $t('payment-providers_page.form.secret_key_required'),
                                         v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-define-data">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_define_data3') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_define_data3')"
                                    v-model="formData.merchant_defined_data3" required variant="outlined" density="compact" 
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_define_data3_required'),
                                         v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>

                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.hide_for_special_countries') }}</label>

                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                   :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'" multiple chips
                                    :placeholder="$t('payment-providers_page.form.select_country_code')"
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
                                <v-switch v-model="formData.abl_multi_currency" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.dual_currency') }}</span>
                                <v-switch v-model="formData.abl_dual_currency" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                            <div class="store-currency-list mt-3"
                                v-if="formData.abl_multi_currency == true || formData.abl_dual_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                <v-select dense variant="outlined" density="compact" :items="currency_list"
                                    v-model="formData.abl_merchant_account_currency" item-value="currency_code"
                                    item-title="currency_code" :placeholder="$t('payment-providers_page.form.merchant_account_currency')"
                                    v-model:menu="show_account_currency"
                                    :append-inner-icon="show_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                            </div>

                            <div class="switch-conversion-rate"
                                v-if="formData.abl_multi_currency == true || formData.abl_dual_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.conversion_rate') }}</label>
                                <v-text-field dense type="number" color="red darken-2" :placeholder="$t('payment-providers_page.form.conversion_rate')"
                                    v-model="formData.abl_conversion_rate" required variant="outlined" density="compact" :rules="[
                                        v => (formData.abl_multi_currency || formData.abl_dual_currency) ? !!v || $t('payment-providers_page.form.conversion_rate_required') : true,
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                        </div>
                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.abl_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                             <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description mt-3">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.abl_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <v-col cols="12" sm="12">
                            <p class="text-primary-color res-url"> <b>{{ $t('payment-providers_page.text.response_abl') }}:</b>
                                <a target="_blank" href="https://unumpay.alche.cloud/payment_app/abl_response/">https://unumpay.alche.cloud/payment_app/abl_response/</a> </p>
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
    name: "ABL",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        ABLObj: {
            type: Object,
            required: true
        },
        saveABLSettings: Function,
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
                abl_client_description: this.ABLObj.credential.client_description,
                shop_name: this.ABLObj.credential.shop_name,
                abl_secret_key: this.ABLObj.credential.secret_key,
                abl_profile_id: this.ABLObj.credential.profile_id,
                abl_access_key: this.ABLObj.credential.access_key,
                abl_client_phone_number: this.ABLObj.credential.client_phone_number,
                abl_client_email: this.ABLObj.credential.client_email,
                merchant_defined_data3: this.ABLObj.credential.merchant_defined_data3,
                abl_is_active: this.ABLObj.credential.is_active,
                abl_multi_currency: this.ABLObj.credential.multi_currency,
                abl_dual_currency: this.ABLObj.credential.dual_currency,
                abl_merchant_account_currency: this.ABLObj.credential.merchant_account_currency || null,
                abl_conversion_rate: this.ABLObj.credential.conversion_rate,
                abl_hide_countries_list: this.ABLObj.credential.hide_countries_list,
            },
            logo: this.ABLObj.logo_url,
            displayName: this.ABLObj.transaction_obj.display_name,
            show_abl_password: false,
            isFormValid: false,
            providerName: this.ABLObj.transaction_obj.provider_name,
            show_country: false,
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
            if (this.ABLObj?.credential.hide_countries_list) {
                this.countrySelectedArray = this.ABLObj?.credential.hide_countries_list.split(",").map(s => s.trim());
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
                    abl_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.saveABLSettings(finalData);
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