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
                                    v-model="formData.hbl_unified_checkout_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.hbl_unified_checkout_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="key-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.key_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.key_id')"
                                    v-model="formData.hbl_unified_checkout_key_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.key_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="shared-secret">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.shared_secret') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.shared_secret')"
                                    v-model="formData.hbl_unified_checkout_shared_secret" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.shared_secret_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="payment-type special-field">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.payment_type') }}</label>
                                <v-combobox dense :append-inner-icon="show_payment_type ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_payment_type" :menu-icon="null"
                                    v-model="formData.hbl_unified_checkout_allowed_payment_types"
                                    :items="allowed_payment_types_list" :placeholder="$t('payment-providers_page.form.payment_type')" multiple chips
                                    required variant="outlined" density="compact"
                                    :rules="[v => (v && v.length > 0) || $t('payment-providers_page.form.payment_type_required')]"></v-combobox>
                            </div>
                            <div class="card-network special-field">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.card_network') }}</label>
                                <v-combobox dense :append-inner-icon="show_card_network ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_card_network"
                                    v-model="formData.hbl_unified_checkout_allowed_card_networks" :menu-icon="null"
                                    :items="allowed_card_networks_list" :placeholder="$t('payment-providers_page.form.card_network')" multiple chips
                                    required variant="outlined" density="compact"
                                    :rules="[v => (v && v.length > 0) || $t('payment-providers_page.form.card_network_required')]"></v-combobox>
                            </div>
                            <!-- <div class="currency-conversion">
                                <h5>{{ $t('payment-providers_page.form.currency_conversion') }}</h5> 
                                <div class="d-flex justify-space-between align-center">
                                    <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.switch_currency') }}</span>
                                    <v-switch v-model="formData.hbl_unified_checkout_dual_currency" hide-details inset
                                        :true-value="true" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false" color="#000"></v-switch>
                                </div>
                                <div class="store-currency-list mt-3" v-if="formData.hbl_unified_checkout_dual_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_account_currency') }}</label>
                                    <v-select dense variant="outlined" density="compact" :items="currency_list"
                                        v-model="formData.hbl_unified_checkout_merchant_account_currency" item-value="currency_code"
                                        item-title="currency_code" :placeholder="$t('payment-providers_page.form.merchant_account_currency')" 
                                        :append-inner-icon="show_merchant_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                         v-model:menu="show_merchant_account_currency"/>
                                </div>
                                <div class="switch-conversion-rate" v-if="formData.hbl_unified_checkout_dual_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.conversion_rate') }}</label>
                                    <v-text-field dense type="number" color="red darken-2"
                                        :placeholder="$t('payment-providers_page.form.conversion_rate')" v-model="formData.hbl_unified_checkout_conversion_rate" required
                                        variant="outlined" density="compact" :rules="[
                                            v => !formData.hbl_unified_checkout_dual_currency || !!v || $t('payment-providers_page.form.conversion_rate_required'),
                                            v => englishRule(v, $t)
                                        ]"></v-text-field>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="config-right-col config-col">
                    <div class="config-col-wrapper all-field">

                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.hbl_unified_checkout_is_active" hide-details inset
                                    :true-value="true" class="custom-switch mt-0" :ripple="false"
                                    :false-value="false" color="#000"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.hbl_unified_checkout_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
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
    name: "HBLUnifiedCheckout",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        HBLUnifiedCheckoutObj: {
            type: Object,
            required: true
        },
        saveHBLUnifiedCheckoutSettings: Function,
        allowed_payment_types_list: Array,
        allowed_card_networks_list: Array,
        currency_list: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        const paymentTypes = this.HBLUnifiedCheckoutObj?.credential?.allowed_payment_types;
        const cardNetworks = this.HBLUnifiedCheckoutObj?.credential?.allowed_card_networks;
        return {
            formData: {
                hbl_unified_checkout_client_name: this.HBLUnifiedCheckoutObj?.credential.client_name,
                hbl_unified_checkout_client_description: this.HBLUnifiedCheckoutObj?.credential.client_description,
                hbl_unified_checkout_key_id: this.HBLUnifiedCheckoutObj?.credential.key_id,
                hbl_unified_checkout_merchant_id: this.HBLUnifiedCheckoutObj?.credential.merchant_id,
                hbl_unified_checkout_shared_secret: this.HBLUnifiedCheckoutObj?.credential.shared_secret,
                hbl_unified_checkout_dual_currency: this.HBLUnifiedCheckoutObj?.credential.dual_currency,
                hbl_unified_checkout_merchant_account_currency: this.HBLUnifiedCheckoutObj?.credential.merchant_account_currency || null,
                hbl_unified_checkout_conversion_rate: this.HBLUnifiedCheckoutObj?.credential.conversion_rate,
                hbl_unified_checkout_is_active: this.HBLUnifiedCheckoutObj?.credential.is_active,
                hbl_unified_checkout_allowed_payment_types: paymentTypes !== "" ? paymentTypes.split(",") : [],
                hbl_unified_checkout_allowed_card_networks: cardNetworks !== "" ? cardNetworks.split(",") : [],
            },
            logo: this.HBLUnifiedCheckoutObj.logo_url,
            displayName: this.HBLUnifiedCheckoutObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.HBLUnifiedCheckoutObj.transaction_obj.provider_name,
            show_payment_type: false,
            show_card_network: false,
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
                    hbl_unified_checkout_allowed_payment_types: Array.isArray(this.formData.hbl_unified_checkout_allowed_payment_types)
                        ? this.formData.hbl_unified_checkout_allowed_payment_types.join(",")
                        : this.formData.hbl_unified_checkout_allowed_payment_types,
                    hbl_unified_checkout_allowed_card_networks: Array.isArray(this.formData.hbl_unified_checkout_allowed_card_networks)
                        ? this.formData.hbl_unified_checkout_allowed_card_networks.join(",")
                        : this.formData.hbl_unified_checkout_allowed_card_networks,
                };
                this.saveHBLUnifiedCheckoutSettings(finalData);
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
