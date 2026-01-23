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
                                    v-model="formData.ccavenue_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.ccavenue_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="acess-code">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.access_code') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.access_code')"
                                    v-model="formData.ccavenue_access_code" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.access_code_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="enc-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.enc_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.enc_key')"
                                    v-model="formData.ccavenue_enc_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.enc_key_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="phone number">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.phone_number') }}</label>
                                <v-text-field dense type="tel" color="red darken-2" :placeholder="$t('payment-providers_page.form.phone_number')" :rules="[
                                    v => !!v || $t('payment-providers_page.form.phone_number_required'),
                                    v => /^\+?[0-9]+$/.test(v) || 'Only numbers and optional + allowed',
                                    v => englishRule(v, $t)
                                ]" v-model="formData.ccavenue_whitelist_phone_number" variant="outlined" density="compact"></v-text-field>
                            </div>
                            <div class="email-address"> 
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.email_address') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.email_address')"
                                    :rules="[
                                        v => !!v || $t('payment-providers_page.form.email_address_required'),
                                        v => !v || /.+@.+\..+/.test(v) || $t('payment-providers_page.form.email_address_invalid'),
                                        v => englishRule(v, $t)
                                    ]" v-model="formData.ccavenue_whitelist_email_address" variant="outlined" density="compact"></v-text-field>
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
                                <v-switch v-model="formData.ccavenue_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                           <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.ccavenue_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
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
    name: "Ccavenue",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        ccavenueObj: {
            type: Object,
            required: true
        },
        saveCCAvenueSettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                ccavenue_client_name: this.ccavenueObj.credential.client_name,
                ccavenue_client_description: this.ccavenueObj.credential.client_description,
                ccavenue_merchant_id: this.ccavenueObj.credential.merchant_id,
                ccavenue_access_code: this.ccavenueObj.credential.access_code,
                ccavenue_enc_key: this.ccavenueObj.credential.enc_key,
                ccavenue_whitelist_phone_number: this.ccavenueObj.credential.whitelist_phone_number,
                ccavenue_whitelist_email_address: this.ccavenueObj.credential.whitelist_email_address,
                ccavenue_is_active: this.ccavenueObj.credential.is_active,
            },
            logo: this.ccavenueObj.logo_url,
            displayName: this.ccavenueObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.ccavenueObj.transaction_obj.provider_name,
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
                console.log(finalData)
                this.saveCCAvenueSettings(finalData);
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