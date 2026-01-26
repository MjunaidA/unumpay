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
                                    v-model="formData.dialogpay_client_name" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="username">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.username') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.username')"
                                    v-model="formData.dialogpay_username" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.username_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.password') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.password')"
                                    v-model="formData.dialogpay_password" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.password_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="database-name">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.database_name') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.database_name')"
                                    v-model="formData.dialogpay_database_name" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.database_name_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.dialogpay_merchant_id" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="payment-provider-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.payment_provider_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.payment_provider_id')"
                                    v-model="formData.dialogpay_payment_provider_id" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.payment_provider_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="payment-service-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.payment_service_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.payment_service_id')"
                                    v-model="formData.dialogpay_payment_service_id" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.payment_service_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="public-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.public_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.public_key')"
                                    v-model="formData.dialogpay_public_key" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.public_key_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="private-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.private_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.private_key')"
                                    v-model="formData.dialogpay_private_key" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.private_key_required'),
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
                                <v-switch v-model="formData.dialogpay_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.dialogpay_client_description"  variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
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
    name: "DialogPay",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        DialogPayObj: {
            type: Object,
            required: true
        },
        saveDialogPaySettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                dialogpay_client_name: this.DialogPayObj?.credential.client_name,
                dialogpay_client_description: this.DialogPayObj?.credential.client_description,
                dialogpay_username: this.DialogPayObj?.credential.username,
                dialogpay_password: this.DialogPayObj?.credential.password,
                dialogpay_database_name: this.DialogPayObj?.credential.database_name,
                dialogpay_merchant_id: this.DialogPayObj?.credential.merchant_id,
                dialogpay_payment_provider_id: this.DialogPayObj?.credential.payment_provider_id,
                dialogpay_payment_service_id: this.DialogPayObj?.credential.payment_service_id,
                dialogpay_public_key: this.DialogPayObj?.credential.public_key,
                dialogpay_private_key: this.DialogPayObj?.credential.private_key,
                dialogpay_is_active: this.DialogPayObj?.credential.is_active,
            },
            logo: this.DialogPayObj.logo_url,
            displayName: this.DialogPayObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.DialogPayObj.transaction_obj.provider_name,
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
                this.saveDialogPaySettings(finalData);
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
