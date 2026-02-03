<template>
    <div class="contact-form-container">
        <div class="contact-form-wrapper">
            <div class="contact-head cstm-head pb-3 d-flex justify-space-between align-center">
                <h1 class="cstm-heaing fontWeight600 fontSize20">{{ $t('setting_page.text.contact_detail') }}</h1>
                <v-btn class="contact-save save-btn capatilize border-radius fontSize14 fontWeight500" @click="saveForm"
                    :disabled="contactLoading">{{ $t('$vuetify.save') }}</v-btn>
            </div>

            <div class="contact-body">
                <div class="form mt-6">
                    <v-form v-model="valid" ref="form">
                        <v-row v-if="field_loading" dense>
                            <v-col cols="12" md="6" v-for="n in 5" :key="n">
                                <v-skeleton-loader type="text" class="mb-4" height="98px" />
                            </v-col>
                        </v-row>
                        <v-row dense v-else>
                            <v-col cols="12" md="6">
                                <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('setting_page.text.full_name') }}</label>
                                <v-text-field v-model="formData.fullName"
                                    :placeholder="$t('setting_page.text.full_name')" :rules="[rules.required]"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('setting_page.text.job_title') }}</label>
                                <v-select v-model="formData.jobTitle" :items="jobTitles" item-title="title"
                                    item-value="value" :placeholder="$t('setting_page.text.job_title')"
                                    variant="outlined"
                                    :append-inner-icon="show_job_title ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_job_title" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('setting_page.text.email_address') }}</label>
                                <v-text-field v-model="formData.email"
                                    :placeholder="$t('setting_page.text.email_address')"
                                    :rules="[rules.required, rules.email]" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('advance-payment_table.add_payment_popup.phone') }}</label>
                                <v-text-field type="number" v-model="formData.phone"
                                    :placeholder="$t('advance-payment_table.add_payment_popup.phone')"
                                    :rules="[rules.required]" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="mb-2 fontWeight400 fontSize13 mediumgreyColor">{{
                                    $t('setting_page.text.contact_method') }}</label>
                                <v-select v-model="formData.contactMethod" :items="contactMethods"
                                    :placeholder="$t('setting_page.text.contact_method')" variant="outlined"
                                    :rules="[rules.required]" hide-details
                                    :append-inner-icon="show_contact_method ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_contact_method" />

                            </v-col>
                        </v-row>
                    </v-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { englishOnlyRule } from "@/utils/selectUtils.js";

export default {
    name: "ContactForm",
    props: {
        saveContactForm: Function,
        getContactForm: Function,
        NameField: String,
        EmailField: String,
        phoneField: String,
        contactField: String,
        jobField: String,
        contactLoading: {
            type: Boolean,
            default: true,
        },
        field_loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            valid: false,
            contactMethodMenu: false,
            formData: {
                fullName: this.NameField || "",
                email: this.EmailField || "",
                phone: this.phoneField || "",
                contactMethod: this.contactField || null,
                jobTitle: this.jobField || null,
            },
            jobTitles: ["Owner", "Founder", "CO-Founder", "CEO", "Managing Director", "Finance Head", "Partner", "Ecommerce Manager", "Other"],
            contactMethods: ["Email", "Phone"],
            rules: {
                required: (v) => !!v || this.$t('setting_page.text.field_required'),
                email: (v) => /.+@.+\..+/.test(v) || this.$t('setting_page.text.email_must_be_valid'),
            },
            show_job_title: false,
            show_contact_method: false,
        };
    },
    watch: {
        NameField(val) {
            this.formData.fullName = val;
        },
        EmailField(val) {
            this.formData.email = val;
        },
        phoneField(val) {
            this.formData.phone = val;
        },
        contactField(val) {
            this.formData.contactMethod = val;
        },
        jobField(val) {
            this.formData.jobTitle = val;
        },
        '$i18n.locale'(newVal) {
            this.$emit('update:isRtl', newVal === 'ar');
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
                this.$nextTick(() => this.$refs.form.validate());
            }
        }
    },
    methods: {
        selectJobTitle(title) {
            this.formData.jobTitle = title;
            this.jobTitleMenu = false;
        },
        selectContactMethod(method) {
            this.formData.contactMethod = method;
            this.contactMethodMenu = false;
        },
        englishRule(v) {
            return englishOnlyRule(v, this.$t);
        },
        async saveForm() {
            const result = await this.$refs.form.validate();
            if (result.valid) {
                this.saveContactForm({ ...this.formData });
                console.log("Please fill all required fields correctly.",this.formData);
                return;
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
