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
                                <v-text-field color="red darken-2" dense :placeholder="$t('payment-providers_page.form.client_name')"
                                    v-model="formData.neem_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="partner-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.partner_id') }}</label>
                                <v-text-field color="red darken-2" dense :placeholder="$t('payment-providers_page.form.partner_id')"
                                    v-model="formData.neem_partner_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.partner_id_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="auth-token">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.authorization_token') }}</label>
                                <v-text-field color="red darken-2" dense :placeholder="$t('payment-providers_page.form.authorization_token')"
                                    v-model="formData.neem_authorization_token" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.authorization_token_required'),
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
                                <v-switch v-model="formData.neem_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.neem_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <v-col cols="12" sm="12">
                            <p class="text-primary-color"> <b>{{ $t('payment-providers_page.text.callback_return_url') }}:</b>
                                <a target="_blank" href="https://unumpay.alche.cloud/payment_app/neem_response">https://unumpay.alche.cloud/payment_app/neem_response</a> </p>
                        </v-col>
                        <v-btn @click="SaveData()" class="save-provider">{{ $t('$vuetify.active') }}</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-form>
    </v-main>
</template>


<script>
import { englishOnlyRule } from "@/utils/selectUtils.js";

export default {
    name: "Neem",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        NeemObj: {
            type: Object,
            required: true
        },
        saveNeemSettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                neem_client_name: this.NeemObj.credential.client_name,
                neem_client_description: this.NeemObj.credential.client_description,
                neem_partner_id: this.NeemObj.credential.partner_id,
                neem_authorization_token: this.NeemObj.credential.authorization_token,
                neem_is_active: this.NeemObj.credential.is_active,
                neem_hide_countries_list: this.NeemObj.credential.hide_countries_list,
            },
            logo: this.NeemObj.logo_url,
            displayName: this.NeemObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.NeemObj.transaction_obj.provider_name,
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
                this.saveNeemSettings(finalData);
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