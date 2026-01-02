<template>
    <v-dialog v-model="localDialog" max-width="800px">
        <v-card>
            <div v-if="!loading_data" class="add-payment-dialog">
                <v-card-title class="d-flex align-cPlease enter justify-space-between mb-3">
                    <div class="add-payment-heading d-flex align-cPlease enter">
                        <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Frame_2612.svg?v=1754987214"
                            alt="icon" style="width: 20px; height: 20px; margin-right: 8px;" />
                        <h3 class="fontWeight700 fontSize16">Advance Payment</h3>
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
                            <h4 class="mb-2">First Name</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_firstname"
                                hide-details placeholder="Please enter first name" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Last Name -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Last Name</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_lastname"
                                hide-details placeholder="Please enter last name" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Email -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Email</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_email" hide-details
                                placeholder="Please enter email" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Phone -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Phone number</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_phone" hide-details
                                placeholder="Please enter phone number" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Country -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Country</h4>
                            <v-select dense variant="outlined" density="compact" :items="country_list"
                                v-model="localAdvancePaymentItem.country_code" hide-details item-value="code"
                                item-title="name" placeholder="Select country" />
                        </v-col>

                        <!-- City -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">City</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_city" hide-details
                                placeholder="Please enter city name" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Zip Code -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Zip Code</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.postal_code" hide-details
                                placeholder="Please enter zip code" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Amount -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Amount</h4>
                            <v-text-field dense required type="number" v-model="localAdvancePaymentItem.amount"
                                hide-details placeholder="Please enter amount" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Currency -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Currency</h4>
                            <v-select append-icon="mdi-chevron-down" dense variant="outlined" density="compact" :items="currency_list"
                                v-model="localAdvancePaymentItem.currency" hide-details item-value="currency_code"
                                item-title="currency_code" placeholder="Select currency" />
                        </v-col>

                        <!-- Address -->
                        <v-col cols="12" sm="6">
                            <h4 class="mb-2">Address</h4>
                            <v-text-field dense required v-model="localAdvancePaymentItem.customer_address" hide-details
                                placeholder="Please enter address" variant="outlined" density="compact" />
                        </v-col>

                        <!-- Description -->
                        <v-col cols="12" sm="12">
                            <h4 class="mb-2">Description</h4>
                            <v-textarea dense required v-model="localAdvancePaymentItem.description" hide-details
                                placeholder="Write Something..." variant="outlined" density="compact" />
                        </v-col>

                    </v-row>
                </v-card-text>

                <!-- Actions -->
                <v-card-actions class="add-pay-action-btn">
                    <v-row no-gutters class="w-100">
                        <v-col cols="6" class="pr-2">
                            <v-btn block depressed @click="closeDialog"
                                style="background: #fff;border: 1px solid #c4c2c2;border-radius: 8px;">
                                Close
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="pl-2">
                            <v-btn block color="primary" depressed @click="submitPayment"
                                style="background-color: #16A349!important;border: 1px solid #c4c2c2;border-radius: 8px;color:#fff">
                                Save
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
        country_list: Array
    },
    data() {
        return {
            localDialog: this.dialog,
            localAdvancePaymentItem: {
                ...this.advance_payment_item,
                country_code: this.advance_payment_item.country_code?.code || this.advance_payment_item.country_code || "",
                currency: this.advance_payment_item.currency?.currency_code || this.advance_payment_item.currency || ""
            }
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
                    country_code: newVal.country_code?.code || newVal.country_code || "",
                    currency: newVal.currency?.currency_code || newVal.currency || ""
                };
            },
            deep: true,
            immediate: true
        },
    },
    methods: {
        closeDialog() { this.localDialog = false; },
        submitPayment() { this.$emit("submit", this.localAdvancePaymentItem); }
    }
};
</script>
