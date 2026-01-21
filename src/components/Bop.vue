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
                                    v-model="formData.bop_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                        v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="merchant-id">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.merchant_id') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.merchant_id')"
                                    v-model="formData.bop_merchant_id" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.merchant_id_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="api-username">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.api_username') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.api_username')"
                                    v-model="formData.bop_api_username" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.api_username_required'),
                                        v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="api-password">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.api_password') }}</label>
                                <v-text-field dense color="red darken-2" :placeholder="$t('payment-providers_page.form.api_password')"
                                    v-model="formData.bop_api_password" required variant="outlined" density="compact"
                                    :append-inner-icon="show_bop_main_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_bop_main_password ? 'text' : 'password'"
                                    @click:append-inner="show_bop_main_password = !show_bop_main_password"
                                    :rules="[v => !!v || $t('payment-providers_page.form.api_password_required'),
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
                                <v-switch v-model="formData.bop_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false" :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{ $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2" :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.bop_client_description" variant="outlined" density="compact" :rules="[v => englishRule(v, $t)]" />
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
    name: "BOP",
    props: {
        BOPObj: {
            type: Object,
            required: true
        },
        saveBopSettings: Function,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            formData: {
                bop_client_name: this.BOPObj.credential.client_name,
                bop_merchant_id: this.BOPObj.credential.merchant_id,
                bop_client_description: this.BOPObj.credential.client_description,
                bop_api_username: this.BOPObj.credential.api_username,
                bop_api_password: this.BOPObj.credential.api_password,
                bop_is_active: this.BOPObj.credential.is_active,

            },
            logo: this.BOPObj.logo_url,
            displayName: this.BOPObj.transaction_obj.display_name,
            show_bop_main_password: false,
            isFormValid: false,
            providerName: this.BOPObj.transaction_obj.provider_name,
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
                this.saveBopSettings(finalData);
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