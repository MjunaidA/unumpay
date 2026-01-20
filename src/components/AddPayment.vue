<template>
    <v-dialog v-model="localDialog" max-width="800px">
        <v-card>
            <div v-if="!loading_data" class="add-payment-dialog">
                <v-card-title class="d-flex align-center justify-space-between mb-3">
                    <div class="add-payment-heading d-flex align-center">
                        <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Frame_2612.svg?v=1754987214"
                            alt="icon" style="width: 20px; height: 20px;" :class="isRtl ? 'ml-2' : 'mr-2'" />
                        <h3 class="fontWeight700 fontSize16">{{ $t('advance-payment_table.add_payment_popup.title') }}
                        </h3>
                    </div>
                    <div class="cross-btn">
                        <v-btn icon @click="closeDialog">
                            <v-icon color="#000">mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <!-- First Name -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.first_name') }}</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_firstname"
                                hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.first_name_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Last Name -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.last_name') }}</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_lastname"
                                hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.last_name_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Email -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.email') }}</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_email" hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.email_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Phone -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.phone') }}</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_phone" hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.phone_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Country -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.country') }}</h4>
                            <v-select dense variant="outlined" density="compact" :items="translatedCountryList"
                                v-model="localAdvancePaymentItem.country_code" hide-details item-value="code"
                                item-title="name"
                                :placeholder="$t('advance-payment_table.add_payment_popup.country_placeholder')"
                                v-model:menu="isCountryMenuOpen"
                                :append-inner-icon="isCountryMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                        </v-col>

                        <!-- City -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.city') }}</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_city" hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.city_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Zip Code -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.zip_code') }}</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.postal_code" hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.zip_code_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Amount -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.amount') }}</h4>
                            <v-text-field dense required type="number" v-model="localAdvancePaymentItem.amount"
                                hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.amount_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Currency -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.currency') }}</h4>
                            <v-select v-model:menu="isCurrencyMenuOpen"
                                :append-inner-icon="isCurrencyMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" dense
                                variant="outlined" density="compact" :items="currency_list"
                                v-model="localAdvancePaymentItem.currency" hide-details item-value="currency_code"
                                item-title="currency_code"
                                :placeholder="$t('advance-payment_table.add_payment_popup.currency_placeholder')" />
                        </v-col>

                        <!-- Address -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.address') }}</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_address" hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.address_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                        <!-- Description -->
                        <v-col cols="12" sm="12">
                            <h4 class="mb-2">{{ $t('advance-payment_table.add_payment_popup.description') }}</h4>
                            <v-textarea dense required v-model="localAdvancePaymentItem.description" hide-details
                                :placeholder="$t('advance-payment_table.add_payment_popup.description_placeholder')"
                                variant="outlined" density="compact" />
                        </v-col>

                    </v-row>
                </v-card-text>

                <!-- Actions -->
                <v-card-actions class="add-pay-action-btn pa-4">
                    <v-row no-gutters class="w-100">
                        <v-col cols="6" :class="isRtl ? 'pl-2' : 'pr-2'">
                            <v-btn block depressed @click="closeDialog"
                                style="background: #fff;border: 1px solid #c4c2c2;border-radius: 8px;">
                                {{ $t('$vuetify.close') }}
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="pl-2" :class="isRtl ? 'pr-2' : 'pl-2'">
                            <v-btn block color="primary" depressed @click="submitPayment"
                                style="background-color: #16A349!important;border: 1px solid #c4c2c2;border-radius: 8px;color:#fff!important">
                                {{ $t('$vuetify.save') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "AddPayment",
    props: {
        dialog: Boolean,
        advance_payment_item: { type: Object, required: true },
        loading_data: Boolean,
        currency_list: Array,
        country_list: Array,
        translatedCountryList: Array,
        isRtl: Boolean,
    },
    data() {
        return {
            localDialog: this.dialog,
            localAdvancePaymentItem: {
                ...this.advance_payment_item,
                country_code: this.advance_payment_item.country_code || null,
                currency: this.advance_payment_item.currency || null
            },
            isCountryMenuOpen: false,
            isCurrencyMenuOpen: false,
        };
    },
    watch: {
        dialog(val) { this.localDialog = val; },
        localDialog(val) { this.$emit("update:dialog", val); },

        // deep watch for changes to advance_payment_item
        advance_payment_item: {
            handler(newVal) {
                this.localAdvancePaymentItem = {
                    ...newVal,
                    country_code: newVal.country_code || null,
                    currency: newVal.currency || null
                };
            },
            deep: true,
            immediate: true
        },
    },
    methods: {
        closeDialog() { this.localDialog = false; },
        submitPayment() {
            this.$emit("submit", this.localAdvancePaymentItem);
        }
    }
};
</script>
