<template>
    <v-main class="pa-0 cstm-main">
        <v-form ref="form" v-model="isFormValid">
            <v-row v-if="!saveDataLoading">
                <v-col cols="12" md="6" class="config-left-col config-col">
                    <div class="config-col-wrapper">
                        <div class="d-flex justify-space-between pb-4 config-heading-container border-bottom">
                            <h3 class="pro-heading">{{ $t(`payment_provider.${providerName}`) }}</h3>
                            <div class="cstm-logo"><v-img :src="logo"></v-img>
                            </div>
                        </div>
                        <div class="all-field mt-6">
                            <div class="client-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_name') }}</label>
                                <v-text-field color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.baf_client_name" required variant="outlined" dense :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v, $t)
                                    ]" density="compact"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.baf_merchant_id" required variant="outlined" dense
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                        v => englishRule(v, $t)
                                    ]"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="user-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.user_name') }}</label>
                                <v-text-field color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.user_name')"
                                    v-model="formData.baf_api_username" required variant="outlined" dense
                                    :rules="[v => !!v || $t('payment-providers_page.form.user_name_required'),
                                        v => englishRule(v, $t)
                                    ]"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="api-password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.api_password') }}</label>
                                <v-text-field color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.api_password')"
                                    v-model="formData.baf_api_password" required variant="outlined"
                                    :type="show_baf_main_password ? 'text' : 'password'"
                                    :append-inner-icon="show_baf_main_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append-inner="show_baf_main_password = !show_baf_main_password" dense
                                    :rules="[v => !!v || $t('payment-providers_page.form.api_password_required'),
                                        v => englishRule(v, $t)
                                    ]"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.hide_for_special_countries') }}</label>

                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                    :placeholder="$t('payment-providers_page.form.select_country_code')" multiple chips
                                    :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    @click:append-inner="show_country = !show_country" variant="outlined" hide-details
                                    dense density="compact" v-model:menu="show_country">
                                    <template #prepend-item>
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
                                <h5 class="fontWeight700 fontSize14">{{
                                    $t('payment-providers_page.form.currency_conversion') }}</h5>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="active-text fontWeight500 fontSize12">{{
                                        $t('payment-providers_page.form.switch_currency')
                                        }}</span>
                                    <v-switch v-model="formData.baf_switch_currency" hide-details inset
                                        :true-value="true" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false" color="#000"></v-switch>
                                </div>
                                <div class="store-currency-list mt-3" v-if="formData.baf_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_merchant_store_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.baf_switch_store_currency" item-title="currency_code"
                                        item-value="currency_code" item-text="currency_code"
                                        :placeholder="$t('payment-providers_page.form.switch_merchant_store_currency')"
                                        v-model:menu="show_store_currency"
                                        :append-inner-icon="show_store_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                                </div>
                                <div class="account-currency" v-if="formData.baf_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_merchant_account_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.baf_switch_account_currency" item-value="currency_code"
                                        item-title="currency_code"
                                        :placeholder="$t('payment-providers_page.form.switch_merchant_account_currency')"
                                        v-model:menu="show_account_currency"
                                        :append-inner-icon="show_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                                </div>
                                <div class="switch-conversion-rate" v-if="formData.baf_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_conversion_rate') }}</label>
                                    <v-text-field dense variant="outlined" density="compact" color="red darken-2"
                                        :placeholder="$t('payment-providers_page.form.switch_conversion_rate')"
                                        v-model="formData.baf_switch_conversion_rate" required outlined type="number" :rules="[
                                            v => !formData.baf_switch_currency || !!v || $t('payment-providers_page.form.switch_conversion_rate_required')
                                        ]"></v-text-field>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="config-right-col config-col">
                    <div class="config-col-wrapper all-field">
                        <div class="multi-currency-conversion">
                            <h5>{{ $t('payment-providers_page.form.multiple_currency_text') }}</h5>
                            <div class="d-flex justify-space-between align-center mb-3">
                                <span class="active-text fontWeight500 fontSize12">{{
                                    $t('payment-providers_page.form.multiple_currency') }}</span>
                                <v-switch color="#000" v-model="formData.baf_multi_currency" :true-value="true"
                                    hide-details inset class="custom-switch mt-0" :ripple="false"
                                    :false-value="false"></v-switch>
                            </div>
                            <div class="other-merchant-currency-id" v-if="formData.baf_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.other_currency_merchant_id') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.other_currency_merchant_id')"
                                    :rules="[v => englishRule(v, $t)]"
                                    v-model="formData.baf_other_merchant_id" required variant="outlined"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="other-currency-api-username" v-if="formData.baf_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.other_currency_api_username') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.other_currency_api_username')"
                                    :rules="[v => englishRule(v, $t)]"
                                    v-model="formData.baf_other_api_username" required variant="outlined"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="other-currency-api-password" v-if="formData.baf_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.other_currency_api_password') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.other_currency_api_password')"
                                    v-model="formData.baf_other_api_password" required
                                    :append-inner-icon="show_baf_other_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append-inner="show_baf_other_password = !show_baf_other_password"
                                    :rules="[v => englishRule(v, $t)]"
                                    :type="show_baf_other_password ? 'text' : 'password'" variant="outlined"
                                    density="compact"></v-text-field>
                            </div>
                            <div class="merchant-store-currency" v-if="formData.baf_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_store_currency') }}</label>
                                <v-select dense variant="outlined" density="compact" :items="currency_list"
                                    v-model="formData.baf_merchant_store_currency" item-value="currency_code"
                                    item-title="currency_code"
                                    :append-inner-icon="show_merchant_store_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_merchant_store_currency"
                                    :placeholder="$t('payment-providers_page.form.merchant_store_currency')" />
                            </div>
                            <div class="merchant-account-currency" v-if="formData.baf_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                <v-select variant="outlined" density="compact" dense :items="currency_list"
                                    v-model="formData.baf_merchant_account_currency" item-value="currency_code"
                                    item-title="currency_code"
                                    :append-inner-icon="show_merchant_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_merchant_account_currency"
                                    :placeholder="$t('payment-providers_page.form.merchant_account_currency')" />
                            </div>
                            <div class="conversion-rate mb-3" v-if="formData.baf_multi_currency == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.conversion_rate') }}</label>
                                <v-text-field type="number" dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.conversion_rate')"
                                    v-model="formData.baf_conversion_rate" required variant="outlined" density="compact"
                                    :rules="[
                                        v => !formData.baf_multi_currency || !!v || $t('payment-providers_page.form.conversion_rate_required')
                                    ]"></v-text-field>
                            </div>
                        </div>
                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.baf_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false"
                                    :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-field mt-3">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.message_placeholder') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.message_placeholder')"
                                    v-model="formData.baf_provider_message" variant="outlined"
                                    density="compact" :rules="[v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea variant="outlined" density="compact" color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.baf_client_description" outlined :rules="[v => englishRule(v, $t)]" />
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
    name: "AlfalahMPGS",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        BAFArrayData: {
            type: Object,
            required: true
        },
        saveBafSettings: Function,
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
                baf_client_name: this.BAFArrayData?.credential.client_name,
                baf_merchant_id: this.BAFArrayData?.credential.merchant_id,
                baf_api_username: this.BAFArrayData?.credential.api_username,
                baf_api_password: this.BAFArrayData?.credential.api_password,
                baf_hide_countries_list: this.BAFArrayData?.credential.hide_countries_list || "",
                baf_switch_currency: this.BAFArrayData?.credential.switch_currency,
                baf_switch_store_currency: this.BAFArrayData?.credential.switch_store_currency || null,
                baf_switch_account_currency: this.BAFArrayData?.credential.switch_account_currency || null,
                baf_switch_conversion_rate: this.BAFArrayData?.credential.switch_conversion_rate,
                baf_multi_currency: this.BAFArrayData?.credential.multi_currency,
                baf_is_active: this.BAFArrayData?.credential.is_active,
                baf_other_merchant_id: this.BAFArrayData?.credential.other_merchant_id,
                baf_other_api_username: this.BAFArrayData?.credential.other_api_username,
                baf_other_api_password: this.BAFArrayData?.credential.other_api_password,
                baf_merchant_store_currency: this.BAFArrayData?.credential.merchant_store_currency,
                baf_merchant_account_currency: this.BAFArrayData?.credential.merchant_account_currency,
                baf_conversion_rate: this.BAFArrayData?.credential.conversion_rate,
                baf_provider_message: this.BAFArrayData?.credential.provider_message,
                baf_client_description: this.BAFArrayData?.credential.client_description,
                baf_password: this.BAFArrayData?.credential.password,

            },
            logo: this.BAFArrayData.logo_url,
            displayName: this.BAFArrayData.transaction_obj.display_name,
            providerName: this.BAFArrayData.transaction_obj.provider_name,
            show_baf_main_password: false,
            show_country: false,
            show_store_currency: false,
            show_account_currency: false,
            show_merchant_store_currency: false,
            show_merchant_account_currency: false,
            show_baf_other_password: false,
            isFormValid: false,
            localIsRtl: this.isRtl
        };
    },
    mounted() {
        this.initializeSelectedProviders();
    },
    methods: {
        handleToggleSelectAll() {
            this.countrySelectedArray = toggleSelectAll(this.countrySelectedArray, this.country_codes);
        },
        initializeSelectedProviders() {
            if (this.BAFArrayData?.credential.hide_countries_list) {
                this.countrySelectedArray = this.BAFArrayData?.credential.hide_countries_list.split(",").map(s => s.trim());
            }
        },
        englishRule(v) {
            return englishOnlyRule(v, this.$t);
        },
        async SaveData() {
            const result = await this.$refs.form.validate();
            if (result.valid) {
                const finalData = {
                    ...this.formData,
                    baf_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.saveBafSettings(finalData);
            } else {
                this.$emit("show-snackbar", {
                    text: this.$t('payment-providers_page.form.form_validation'),
                    status: "error"
                });
            }
        }
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
    }


};
</script>