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
                                    v-model="formData.aassanpay_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                         v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.aassanpay_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                            v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="uuid">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.x_api_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.x_api_key')"
                                    v-model="formData.aassanpay_uuid" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.x_api_key_required'),
                                            v => englishRule(v, $t)
                                    ]"></v-text-field>
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
                                <v-switch v-model="formData.aassanpay_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.aassanpay_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <v-col cols="12" sm="12">
                            <p class="text-primary-color res-url"> <b>{{ $t('payment-providers_page.text.response_assan_pay') }}:</b>
                               <a target="_blank" href=" https://unumpay.alche.cloud/payment_app/assanpay_response/"> https://unumpay.alche.cloud/payment_app/assanpay_response/</a> </p>
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
    name: "AssanPay",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        AssanPayObj: {
            type: Object,
            required: true
        },
        saveAssanPaySettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                aassanpay_client_name: this.AssanPayObj?.credential.client_name,
                aassanpay_client_description: this.AssanPayObj?.credential.client_description,
                aassanpay_uuid: this.AssanPayObj?.credential.uuid,
                aassanpay_merchant_id: this.AssanPayObj?.credential.merchant_id,
                aassanpay_is_active: this.AssanPayObj?.credential.is_active,
            },
            logo: this.AssanPayObj.logo_url,
            displayName: this.AssanPayObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.AssanPayObj.transaction_obj.provider_name,
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
                this.saveAssanPaySettings(finalData);
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
