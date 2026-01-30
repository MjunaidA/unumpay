<template>
    <div class="reconciliation-form-container" v-if="recReportSettings != null && !recReportSettingsLoading">
        <div class="reconciliation-form-wrapper">
            <div class="reconciliation-head d-flex justify-space-between align-center">
                <div>
                    <h1 class="cstm-heaing fontWeight600 fontSize20">{{
                        $t('setting_page.text.reconciliation_report_settings') }}</h1>
                </div>
                <div>
                    <v-btn class="config-download-btn mr-3 capatilize border-radius fontSize14 fontWeight500"
                        @click="downloadGuide()" :class="isRtl ? 'ml-3' : 'mr-3'">
                        <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_fe8dbdc2-0dea-4ec7-aeda-d6079073b3f7.svg?v=1755688947"
                            alt="search" style="width:20px; height:20px;"  :class="isRtl ? 'ml-2' : 'mr-2'" /> {{ $t('setting_page.text.download_guide')
                            }}</v-btn>
                    <v-btn class="reconciliation-save save-btn capatilize border-radius fontSize14 fontWeight500"
                        @click="handleSave()" :disabled="recReportSettingsLoading">{{ $t('$vuetify.save') }}</v-btn>
                </div>
            </div>

            <div class="reconciliation-body">
                <div class="form mt-6">
                    <v-form v-model="valid" ref="form">
                        <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                            $t('payment-providers_page.form.api_key') }}</label>
                        <v-text-field v-model="localRecReportSettings.shopify_api_key" variant="outlined" hide-details
                            :placeholder="$t('payment-providers_page.form.api_key')" class="mb-3"
                            :rules="[rules.required]"></v-text-field>
                        <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                            $t('payment-providers_page.form.api_password') }}</label>
                        <v-text-field v-model="localRecReportSettings.shopify_api_password" variant="outlined"
                            hide-details :placeholder="$t('payment-providers_page.form.api_password')" class="mb-3"
                            :rules="[rules.required]"></v-text-field>
                        <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                            $t('payment-providers_page.form.access_token') }}</label>
                        <v-text-field v-model="localRecReportSettings.shopify_access_token" variant="outlined"
                            hide-details :placeholder="$t('payment-providers_page.form.access_token')" class="mb-3"
                            :rules="[rules.required]"></v-text-field>

                    </v-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ContactForm",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        recReportSettings: Object,
        downloadGuide: Function,
        saveReconcilationForm: Function,
        recReportSettingsLoading: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            localRecReportSettings: { ...this.recReportSettings },
            rules: {
                required: (v) => !!v || this.$t('setting_page.text.field_required')
            },
            valid: false,
        };
    },
    watch: {
        '$i18n.locale'(newVal) {
            this.$emit('update:isRtl', newVal === 'ar');
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
                this.$nextTick(() => this.$refs.form.validate());
            }
        },
        recReportSettings: {
            handler(newVal) {
                this.localRecReportSettings = { ...newVal };
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        async handleSave() {
            const result = await this.$refs.form.validate();
            if (result.valid) {
                this.saveReconcilationForm(this.localRecReportSettings);
            } else {
                this.$emit("show-snackbar", {
                    text: this.$t('payment-providers_page.form.form_validation'),
                    status: "error"
                });
            }

        }
    }
}
</script>
