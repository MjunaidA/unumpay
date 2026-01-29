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
                                    v-model="formData.swich_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v)]"></v-text-field>
                            </div>
                            <div class="client-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_id')"
                                    v-model="formData.swich_client_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_id_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="secret-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.secret_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.secret_key')"
                                    v-model="formData.swich_secret_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.secret_key_required'),
                                    v => englishRule(v)
                                    ]"></v-text-field>
                            </div>
                            <div class="trans-type">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.transaction_type') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.transaction_type')"
                                    v-model="formData.swich_transaction_type" required variant="outlined" density="compact"></v-text-field>
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
                                <v-switch v-model="formData.swich_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.swich_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
                            </div>
                        </div>
                        <v-col cols="12" sm="12">
                            <p class="text-primary-color"> <b>{{ $t('payment-providers_page.text.response_url') }}:</b>
                                <a target="_blank" href="https://unumpay.alche.cloud/payment_app/swich_response">https://unumpay.alche.cloud/payment_app/swich_response</a> </p>
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
    name: "Swich",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        SwichObj: {
            type: Object,
            required: true
        },
        saveSwichSettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                swich_client_name: this.SwichObj.credential.client_name,
                swich_client_description: this.SwichObj.credential.client_description,
                swich_client_id: this.SwichObj.credential.client_id,
                swich_secret_key: this.SwichObj.credential.secret_key,
                swich_is_active: this.SwichObj.credential.is_active,
                swich_transaction_type: this.SwichObj.credential.transaction_type,
            },
            logo: this.SwichObj.logo_url,
            displayName: this.SwichObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.SwichObj.transaction_obj.provider_name,
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
                this.saveSwichSettings(finalData);
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