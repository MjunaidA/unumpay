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
                                    v-model="formData.ccbill_client_name" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="acc-number">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.account_number') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.account_number')"
                                    v-model="formData.ccbill_account_number" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.account_number_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="sub-acc-number">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.sub_account_number') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.sub_account_number')"
                                    v-model="formData.ccbill_sub_account_number" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.sub_account_number_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="flexform-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.flexform_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.flexform_id')"
                                    v-model="formData.ccbill_flexform_id" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.flexform_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="slay-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.saly_key') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.saly_key')"
                                    v-model="formData.ccbill_salt_key" required  variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.saly_key_required'),
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
                                <v-switch v-model="formData.ccbill_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.ccbill_client_description"  variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
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
    name: "Ccbill",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        CcbillObj: {
            type: Object,
            required: true
        },
        saveCCBillSettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                ccbill_client_name: this.CcbillObj.credential.client_name,
                ccbill_client_description: this.CcbillObj.credential.client_description,
                ccbill_account_number: this.CcbillObj.credential.account_number,
                ccbill_sub_account_number: this.CcbillObj.credential.sub_account_number,
                ccbill_flexform_id: this.CcbillObj.credential.flexform_id,
                ccbill_salt_key: this.CcbillObj.credential.salt_key,
                ccbill_is_active: this.CcbillObj.credential.is_active,
            },
            logo: this.CcbillObj.logo_url,
            displayName: this.CcbillObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.CcbillObj.transaction_obj.provider_name,
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
                this.saveCCBillSettings(finalData);
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