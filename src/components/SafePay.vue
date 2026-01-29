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
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.safepay_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v)]"></v-text-field>
                            </div>
                            <div class="sandbox-api-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.sandbox_api_key') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.sandbox_api_key')"
                                    v-model="formData.safepay_sandbox_api_key" required variant="outlined"
                                    density="compact" :rules="[v => !!v || $t('payment-providers_page.form.sandbox_api_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="sandbox-secret-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.sandbox_secret_key') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.sandbox_secret_key')"
                                    v-model="formData.safepay_sandbox_secret_key" required variant="outlined"
                                    density="compact" :rules="[v => !!v || $t('payment-providers_page.form.sandbox_secret_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="pro-api-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.production_api_key') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.production_api_key')"
                                    v-model="formData.safepay_api_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.production_api_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="pro-secret-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.production_secret_key') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.production_secret_key')"
                                    v-model="formData.safepay_secret_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.production_secret_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.hide_for_special_countries') }}</label>

                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                    :placeholder="$t('payment-providers_page.form.select_country_code')" multiple chips
                                    variant="outlined" density="compact"
                                    :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_country" hide-details dense>
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
                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.safepay_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false"
                                    :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.safepay_client_description" variant="outlined" density="compact"
                                    :rules="[v => englishRule(v, $t)]" />
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
import { toggleSelectAll } from "@/utils/selectUtils.js";

export default {
    name: "SafePay",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        SafePayObj: {
            type: Object,
            required: true
        },
        saveSafePaySettings: Function,
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
                safepay_client_name: this.SafePayObj.credential.client_name,
                safepay_client_description: this.SafePayObj.credential.client_description,
                safepay_sandbox_api_key: this.SafePayObj.credential.sandbox_api_key,
                safepay_sandbox_secret_key: this.SafePayObj.credential.sandbox_secret_key,
                safepay_api_key: this.SafePayObj.credential.api_key,
                safepay_secret_key: this.SafePayObj.credential.secret_key,
                safepay_is_active: this.SafePayObj.credential.is_active,
                safepay_hide_countries_list: this.SafePayObj.credential.hide_countries_list,
            },
            logo: this.SafePayObj.logo_url,
            displayName: this.SafePayObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.SafePayObj.transaction_obj.provider_name,
            show_country: false,
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
            if (this.SafePayObj?.credential.hide_countries_list) {
                this.countrySelectedArray = this.SafePayObj?.credential.hide_countries_list.split(",").map(s => s.trim());
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
                    safepay_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.saveSafePaySettings(finalData);
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