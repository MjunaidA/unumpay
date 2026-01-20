<template>
    <v-main class="pa-0 cstm-main">
        <v-form ref="form" v-model="isFormValid">
            <v-row v-if="!saveDataLoading">
                <v-col cols="12" md="6" class="config-left-col config-col">
                    <div class="config-col-wrapper">
                        <div class="d-flex justify-space-between pb-4 config-heading-container">
                            <h3 class="pro-heading">{{ displayName }}</h3>
                            <div class="cstm-logo"><v-img :src="logo"></v-img>
                            </div>
                        </div>
                        <div class="all-field mt-6">
                            <div class="client-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_name') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.apg_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="channel-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.channel_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.channel_id')"
                                    v-model="formData.apg_channel_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.channel_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Merchant ID</label>
                                <v-text-field dense color="red darken-2" placeholder="Merchant ID"
                                    v-model="formData.apg_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || 'Merchant ID is required']"></v-text-field>
                            </div>
                            <div class="store-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Store ID</label>
                                <v-text-field dense color="red darken-2" placeholder="Store ID"
                                    v-model="formData.apg_store_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || 'Store ID is required']"></v-text-field>
                            </div>
                            <div class="merchant-hash">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Merchant Hash</label>
                                <v-text-field dense color="red darken-2" placeholder="Merchant Hash"
                                    v-model="formData.apg_merchant_hash" required variant="outlined" density="compact"
                                    :rules="[v => !!v || 'Merchant Hash is required']"></v-text-field>
                            </div>
                            <div class="merchant-user-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Merchant Username</label>
                                <v-text-field dense color="red darken-2" placeholder="Merchant Username"
                                    v-model="formData.apg_merchant_username" required variant="outlined"
                                    density="compact"
                                    :rules="[v => !!v || 'Merchant Username is required']"></v-text-field>
                            </div>
                            <div class="merchant-password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Merchant Password</label>
                                <v-text-field dense color="red darken-2" placeholder="Merchant Password"
                                    v-model="formData.apg_merchant_password" required variant="outlined"
                                    density="compact" :append-icon="show_apg_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_apg_password ? 'text' : 'password'"
                                    @click:append="show_apg_password = !show_apg_password"
                                    :rules="[v => !!v || 'Merchant Password is required']"></v-text-field>
                            </div>
                            <div class="merchant-key-1">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Merchant Key1</label>
                                <v-text-field dense color="red darken-2" placeholder="Merchant Key1"
                                    v-model="formData.apg_merchant_key1" required variant="outlined" density="compact"
                                    :rules="[v => !!v || 'Merchant Key1 is required']"></v-text-field>
                            </div>
                            <div class="merchant-key-2">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Merchant Key2</label>
                                <v-text-field dense color="red darken-2" placeholder="Merchant Key2"
                                    v-model="formData.apg_merchant_key2" required variant="outlined" density="compact"
                                    :rules="[v => !!v || 'Merchant Key2 is required']"></v-text-field>
                            </div>
                            <div class="transaction-type special-field">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Tranaction Type</label>
                                <v-combobox append-icon="mdi-chevron-down" dense
                                    v-model="formData.apg_transaction_types" :items="transaction_types_list"
                                    placeholder="Select Tranaction Type" multiple chips required variant="outlined"
                                    density="compact"
                                    :rules="[v => (v && v.length > 0) || 'Transaction Type is required']"></v-combobox>
                            </div>
                            <div class="currency-conversion">
                                <h5>Currency Conversion</h5>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="active-text fontWeight500 fontSize12">Switch Currency</span>
                                    <v-switch v-model="formData.apg_switch_currency" hide-details inset
                                        :true-value="true" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false"></v-switch>
                                </div>
                                <div class="store-currency-list mt-3" v-if="formData.apg_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Merchant Account
                                        Currency</label>
                                    <v-select append-icon="mdi-chevron-down" dense variant="outlined" density="compact"
                                        :items="currency_list" v-model="formData.apg_merchant_account_currency"
                                        item-value="currency_code" item-text="currency_code"
                                        placeholder="Merchant Account Currency" />
                                </div>
                                <div class="switch-conversion-rate" v-if="formData.apg_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Switch Conversion
                                        Rate</label>
                                    <v-text-field dense type="number" color="red darken-2"
                                        placeholder="Switch Conversion Rate" v-model="formData.apg_conversion_rate"
                                        required variant="outlined" density="compact" value="" :rules="[
                                            v => !formData.apg_switch_currency || !!v || 'Conversion Rate is required'
                                        ]"></v-text-field>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="config-right-col config-col">
                    <div class="config-col-wrapper all-field">

                        <div class="payment-provider-status">
                            <h5>Payment Provider Status</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">Active</span>
                                <v-switch v-model="formData.apg_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>Message</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">Client Description</label>
                                <v-textarea dense color="red darken-2" placeholder="Client Description"
                                    v-model="formData.apg_client_description" variant="outlined" density="compact" />
                            </div>
                        </div>
                        <div>
                            <v-col cols="12" sm="12">
                                <p class="text-primary-color"> <b>Return URL:</b>
                                    https://unified-transaction-be.alchemative.net/payment_app/apg_request/ </p>
                                <p class="text-primary-color"> <b>Listener URL:</b>
                                    https://unified-transaction-be.alchemative.net/payment_app/apg_response/
                                </p>
                            </v-col>
                        </div>
                        <v-btn @click="SaveData()" class="save-provider">Save</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-form>
    </v-main>
</template>


<script>
import { englishOnlyRule } from "@/utils/selectUtils.js";

export default {
    name: "AlfalahAPG",
    props: {
        AlfalahAPGObj: {
            type: Object,
            required: true
        },
        saveApgSettings: Function,
        transaction_types_list: Array,
        currency_list: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        const transactionTypes = this.AlfalahAPGObj?.credential?.transaction_types;
        return {
            formData: {
                apg_client_name: this.AlfalahAPGObj?.credential.client_name,
                apg_client_description: this.AlfalahAPGObj?.credential.client_description,
                apg_channel_id: this.AlfalahAPGObj?.credential.channel_id,
                apg_merchant_id: this.AlfalahAPGObj?.credential.merchant_id,
                apg_store_id: this.AlfalahAPGObj?.credential.store_id,
                apg_merchant_hash: this.AlfalahAPGObj?.credential.merchant_hash,
                apg_merchant_username: this.AlfalahAPGObj?.credential.merchant_username,
                apg_merchant_password: this.AlfalahAPGObj?.credential.merchant_password,
                apg_merchant_key1: this.AlfalahAPGObj?.credential.merchant_key1,
                apg_merchant_key2: this.AlfalahAPGObj?.credential.merchant_key2,
                apg_switch_currency: this.AlfalahAPGObj?.credential.switch_currency,
                apg_merchant_account_currency: this.AlfalahAPGObj?.credential.merchant_account_currency,
                apg_conversion_rate: this.AlfalahAPGObj?.credential.conversion_rate,
                apg_is_active: this.AlfalahAPGObj?.credential.is_active,
                apg_transaction_types: transactionTypes !== "" ? transactionTypes.split(",") : [],
            },
            logo: this.AlfalahAPGObj.logo_url,
            displayName: this.AlfalahAPGObj.transaction_obj.display_name,
            show_apg_password: false,
            isFormValid: false,
            providerName: this.AlfalahAPGObj.transaction_obj.provider_name,
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
                    apg_transaction_types: this.formData.apg_transaction_types
                };
                console.log("Final Data to be saved:", finalData);
                // this.saveApgSettings(finalData);
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
