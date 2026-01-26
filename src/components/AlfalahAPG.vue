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
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.apg_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="channel-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.channel_id') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.channel_id')"
                                    v-model="formData.apg_channel_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.channel_id_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.apg_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="store-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.store_id') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.store_id')"
                                    v-model="formData.apg_store_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.store_id_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-hash">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_hash') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.merchant_hash')"
                                    v-model="formData.apg_merchant_hash" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_hash_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-user-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_user_name') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.merchant_user_name')"
                                    v-model="formData.apg_merchant_username" required variant="outlined"
                                    density="compact" :rules="[v => !!v || $t('payment-providers_page.form.merchant_user_name_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_password') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.merchant_password')"
                                    v-model="formData.apg_merchant_password" required variant="outlined"
                                    density="compact" :append-inner-icon="show_apg_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_apg_password ? 'text' : 'password'"
                                    @click:append-inner="show_apg_password = !show_apg_password" :rules="[v => !!v || $t('payment-providers_page.form.merchant_password_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-key-1">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_key1') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.merchant_key1')"
                                    v-model="formData.apg_merchant_key1" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_key1_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-key-2">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_key2') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.merchant_key2')"
                                    v-model="formData.apg_merchant_key2" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_key2_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="transaction-type special-field">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.transaction_type') }}</label>
                                <v-combobox dense v-model="formData.apg_transaction_types"
                                    :items="transaction_types_list"
                                    :placeholder="$t('payment-providers_page.form.transaction_type')" multiple chips
                                    required variant="outlined" density="compact" :menu-icon="null"
                                    :append-inner-icon="show_transaction_type ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_transaction_type" :rules="[v => (v && v.length > 0) || $t('payment-providers_page.form.transaction_type_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-combobox>
                            </div>
                            <div class="currency-conversion">
                                <h5 class="fontWeight700 fontSize14">{{
                                    $t('payment-providers_page.form.currency_conversion') }}</h5>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="active-text fontWeight500 fontSize12">{{
                                        $t('payment-providers_page.form.switch_currency')
                                        }}</span>
                                    <v-switch v-model="formData.apg_switch_currency" hide-details inset
                                        :true-value="true" color="#000" class="custom-switch mt-0" :ripple="false"
                                        :false-value="false"></v-switch>
                                </div>
                                <div class="store-currency-list mt-3" v-if="formData.apg_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_merchant_account_currency') }}</label>
                                    <v-select  dense variant="outlined" density="compact"
                                        :items="currency_list" v-model="formData.apg_merchant_account_currency"
                                        item-value="currency_code" item-title="currency_code"
                                        v-model:menu="show_account_currency"
                                        :append-inner-icon="show_account_currency ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                        :placeholder="$t('payment-providers_page.form.switch_merchant_account_currency')" 
                                        />
                                </div>
                                <div class="switch-conversion-rate" v-if="formData.apg_switch_currency == true">
                                    <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                        $t('payment-providers_page.form.switch_conversion_rate') }}</label>
                                    <v-text-field dense type="number" color="red darken-2"
                                        :placeholder="$t('payment-providers_page.form.switch_conversion_rate')" v-model="formData.apg_conversion_rate"
                                        required variant="outlined" density="compact" :rules="[
                                            v => !formData.apg_switch_currency || !!v || $t('payment-providers_page.form.switch_conversion_rate_required')
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
                                <v-switch v-model="formData.apg_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.apg_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <div>
                            <v-col cols="12" sm="12">
                                <p class="text-primary-color res-url"> <b>{{ $t('payment-providers_page.text.return_url') }}:</b>
                                    <a target="_blank" href="https://unumpay.alche.cloud/payment_app/apg_request/ ">https://unumpay.alche.cloud/payment_app/apg_request/ </a></p>
                                <p class="text-primary-color res-url"> <b>{{ $t('payment-providers_page.text.listner_url') }}:</b>
                                    <a target="_blank" href="https://unumpay.alche.cloud/payment_app/apg_response/">https://unumpay.alche.cloud/payment_app/apg_response/</a>
                                </p>
                            </v-col>
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
    name: "AlfalahAPG",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
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
            show_transaction_type: false,
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
                    apg_transaction_types: this.formData.apg_transaction_types.slice()
                };
                console.log("Final Data to be saved:", finalData);
                this.saveApgSettings(finalData);
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
