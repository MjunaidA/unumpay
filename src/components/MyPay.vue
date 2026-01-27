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
                                    v-model="formData.mypay_client_name" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.client_name_required'),
                                    v => englishRule(v, $t)]"></v-text-field>
                            </div>
                            <div class="publish-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.publishable_key') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.publishable_key')"
                                    v-model="formData.mypay_publishable_key" required variant="outlined"
                                    density="compact" :rules="[v => !!v || $t('payment-providers_page.form.publishable_key_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="secret-key">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.secret_key') }}</label>
                                <v-text-field dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.secret_key')"
                                    v-model="formData.mypay_secret_key" required variant="outlined" density="compact"
                                    :rules="[v => !!v || $t('payment-providers_page.form.secret_key_required'),
                                    v => englishRule(v, $t)
                                    ]"></v-text-field>
                            </div>
                            <div class="special-field mb-6">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.hide_for_special_countries') }}</label>
                                <v-select v-model="countrySelectedArray" :items="country_codes"
                                    :placeholder="$t('payment-providers_page.form.select_country_code')" multiple chips
                                    variant="outlined" density="compact" hide-details dense
                                    :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_country">
                                    <template v-slot:prepend-item>
                                        <v-list-item ripple @click="handleToggleSelectAll">
                                            <v-list-item-action>
                                                <v-icon>
                                                    {{ selectAllIcon }}
                                                </v-icon>
                                            </v-list-item-action>
                                            <v-list-item-title>
                                                {{ isAllSelected ? $t('payment-providers_page.text.deselect_all') :
                                                $t('payment-providers_page.text.select_all') }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-select>
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
                                <v-switch v-model="formData.mypay_is_active" hide-details inset :true-value="true"
                                    class="custom-switch mt-0" color="#000" :ripple="false"
                                    :false-value="false"></v-switch>
                            </div>
                        </div>
                        <div class="description-field mt-3">
                            <h5>{{ $t('payment-providers_page.form.message') }}</h5>
                            <div class="message-description">
                                <label class="mb-3 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('payment-providers_page.form.client_description') }}</label>
                                <v-textarea dense color="red darken-2"
                                    :placeholder="$t('payment-providers_page.form.client_description')"
                                    v-model="formData.mypay_client_description" variant="outlined" density="compact"
                                    :rules="[v => englishRule(v, $t)]" />
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
import { toggleSelectAll } from "@/utils/selectUtils.js";
import { englishOnlyRule } from "@/utils/selectUtils.js";

export default {
    name: "MyPay",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        MyPayObj: {
            type: Object,
            required: true
        },
        saveMyPaySettings: Function,
        country_codes: Array,
        saveDataLoading: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            countrySelectedArray: [],
            formData: {
                mypay_client_name: this.MyPayObj.credential.client_name,
                mypay_client_description: this.MyPayObj.credential.client_description,
                mypay_publishable_key: this.MyPayObj.credential.publishable_key,
                mypay_secret_key: this.MyPayObj.credential.secret_key,
                mypay_is_active: this.MyPayObj.credential.is_active,
                mypay_hide_countries_list: this.MyPayObj.credential.hide_countries_list,
            },
            logo: this.MyPayObj.logo_url,
            displayName: this.MyPayObj.transaction_obj.display_name,
            isFormValid: false,
            providerName: this.MyPayObj.transaction_obj.provider_name,
            show_country: false,
        };
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
    computed: {
        isAllSelected() {
            return this.countrySelectedArray.length === this.country_codes.length;
        },
        isPartialSelected() {
            return (
                this.countrySelectedArray.length > 0 &&
                this.countrySelectedArray.length < this.country_codes.length
            );
        },
        selectAllIcon() {
            if (this.isAllSelected) return "mdi-checkbox-marked";
            if (this.isPartialSelected) return "mdi-minus-box";
            return "mdi-checkbox-blank-outline";
        }
    },
    mounted() {
        this.initializeSelectedProviders();
    },
    methods: {
        initializeSelectedProviders() {
            if (this.MyPayObj?.credential.hide_countries_list) {
                this.countrySelectedArray = this.MyPayObj?.credential.hide_countries_list.split(",").map(s => s.trim());
                console.log(this.countrySelectedArray)
            }
        },
        handleToggleSelectAll() {
            this.countrySelectedArray = toggleSelectAll(this.countrySelectedArray, this.country_codes);
        },
        englishRule(v) {
            return englishOnlyRule(v, this.$t);
        },
        async SaveData() {
            const result = await this.$refs.form.validate();
            if (result.valid) {
                const finalData = {
                    ...this.formData,
                    mypay_hide_countries_list: this.countrySelectedArray.join(",")
                };
                this.saveMyPaySettings(finalData);
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