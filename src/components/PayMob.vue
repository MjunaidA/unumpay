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
                                    v-model="formData.paymob_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v)]"></v-text-field>
                            </div>
                            <div class="api-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.api_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.api_key')"
                                    v-model="formData.paymob_api_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.api_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="hmac">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.HMAC') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.HMAC')"
                                    v-model="formData.paymob_hmac_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.HMAC_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="integ-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.integration_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.integration_id')"
                                    v-model="formData.paymob_integration_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.integration_id_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="iframe-link">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.iframe_link') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.iframe_link')"
                                    v-model="formData.paymob_iframe_link" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.iframe_link_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div>
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.recurring_integration_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.recurring_integration_id')"
                                    v-model="formData.paymob_recurring_integration_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.recurring_integration_id_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>

                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="config-right-col config-col">
                    <div class="config-col-wrapper all-field">
                        <div class="installment-plan mb-3">
                            <h5>{{ $t('payment-providers_page.form.instalment_plan') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('payment-providers_page.form.instalment') }}</span>
                                <v-switch v-model="formData.paymob_is_instalment" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                            <div class="installment" v-if="formData.paymob_is_instalment == true">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.no_of_installment') }}</label>
                                <v-text-field dense type="number" min=0 max=100 color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.no_of_installment')" v-model="formData.paymob_no_of_instalment" required
                                    :rules="[
                                        v => !formData.paymob_is_instalment || !!v || $t('payment-providers_page.form.no_of_installment_required'),
                                        v => englishRule(v)
                                    ]" variant="outlined" density="compact" ></v-text-field> 
                            </div>

                        </div>
                        <div class="payment-provider-status">
                            <h5>{{ $t('payment-providers_page.form.payment_provider_status') }}</h5>
                            <div class="d-flex justify-space-between align-center">
                                <span class="active-text fontWeight500 fontSize12">{{ $t('$vuetify.active') }}</span>
                                <v-switch v-model="formData.paymob_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.paymob_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <v-col cols="12" sm="12">
                            <p class="text-primary-color"> <b>{{ $t('payment-providers_page.text.response_url') }}:</b>
                                <a target="_blank" href="https://unumpay.alche.cloud/payment_app/paymob_response/">https://unumpay.alche.cloud/payment_app/paymob_response/</a> </p>
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
    name: "PayMob",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        PayMobObj: {
            type: Object,
            required: true
        },
        savePaymobSettings: Function,
        currency_list: Array,
        country_codes: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                paymob_client_name: this.PayMobObj.credential.client_name,
                paymob_client_description: this.PayMobObj.credential.client_description,
                paymob_api_key: this.PayMobObj.credential.api_key,
                paymob_hmac_key: this.PayMobObj.credential.hmac_key,
                paymob_integration_id: this.PayMobObj.credential.integration_id,
                paymob_iframe_link: this.PayMobObj.credential.iframe_link,
                paymob_is_active: this.PayMobObj.credential.is_active,
                paymob_no_of_instalment: this.PayMobObj.credential.no_of_instalment,
                paymob_is_instalment: this.PayMobObj.credential.is_instalment,
                paymob_recurring_integration_id: this.PayMobObj.credential.recurring_integration_id,
            },
            logo: this.PayMobObj.logo_url,
            displayName: this.PayMobObj.transaction_obj.display_name,
            show_payfast_password: false,
            isFormValid: false,
            providerName: this.PayMobObj.transaction_obj.provider_name,
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
                this.savePaymobSettings(finalData);
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