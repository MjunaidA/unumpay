<template>
    <v-dialog v-model="dialog"  max-width="550px">
        <v-card>
            <v-card-title class="popup-heading-container d-flex">
                <div class="d-flex align-center">
                    <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Frame_2612.svg?v=1754987214"
                        alt="icon" style="width: 20px; height: 20px;" :class="isRtl ? 'ml-2' : 'mr-2'" />
                    <span class="popup-heading fontSize14 fontWeight600 capatilize">{{ $t('transaction_popup.title') }}</span>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon color="#000">mdi-close</v-icon>
                </v-btn>
            </v-card-title>
 
            <v-card-text class="pa-5">
                <div class="customer-detail-container d-flex justify-space-between border border-radius">
                    <div class="customer-name-status">
                        <div class="ctmr-name d-flex align-center gap10">
                            <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Done_Check.svg?v=1754483259"
                                alt="View Details" style="width:20px; height:20px;"  />
                            <strong class="fontSize12 fontWeight700 capatilize" :class="isRtl ? 'mr-1' : 'ml-1'">{{ transaction.customer_name }}</strong>
                        </div>
                        <div class="cstmr-status ml-5">
                            <v-chip size="small" dark :class="{
                                'status-success': transaction.status === 'success',
                                'status-pending': transaction.status === 'pending',
                                'status-failed': transaction.status === 'failed'
                            }">{{ $t('status.' + transaction.status?.toLowerCase()) }}</v-chip>
                        </div>
                    </div>
                    <div class="customer-amt-detail">
                        <h4 class="fontSize16 fontWeight600"><span>{{ transaction.currency_symbol }}</span>{{ transaction.amount }}</h4>
                        <div class="unumpay-charges fontSize10 fontWeight500 mt-1" v-if= "transaction.status == 'success'">
                            {{ $t('payment_providers.unumpay-charges') }}: {{ currency }} {{ transaction.application_value }}
                        </div>
                    </div>
                </div>


                <v-row class="mt-5 cstmr-full-detail-container" col="12" md="4">
                    <v-col class="cstmr-full-detail border border-radius" cols="6">
                        <strong class="d-flex align-center gap05 cstm-style fontSize12 fontWeight400">
                            <img :class="isRtl ? 'ml-1' : 'mr-1'" src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_1.svg?v=1754994857"
                                alt="View Details" style="width:20px; height:20px;" />{{ $t('transaction_popup.transaction_id') }}:
                        </strong>
                        <strong class="item-value mt-2 pl-2">{{ transaction.order_reference }}</strong>
                    </v-col>
                    <v-col class="cstmr-full-detail border border-radius" cols="6">
                        <strong class="d-flex align-center gap05 cstm-style fontSize12 fontWeight400">
                            <img :class="isRtl ? 'ml-1' : 'mr-1'" src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Icon_6.svg?v=1754994857"
                                alt="View Details" style="width:20px; height:20px;" />{{ $t('transaction_popup.response_code') }}:
                        </strong>
                        <strong class="item-value mt-2 pl-2" v-if="transaction.response_code == null">-</strong>
                        <strong class="item-value mt-2 pl-2" v-else>{{ transaction.response_code }}</strong>
                    </v-col>
                    <v-col class="cstmr-full-detail border border-radius" cols="6">
                        <strong class="d-flex align-center gap05 cstm-style fontSize12 fontWeight400">
                            <img :class="isRtl ? 'ml-1' : 'mr-1'" src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Icon_7.svg?v=1754994857"
                                alt="View Details" style="width:20px; height:20px;" />{{ $t('transaction_popup.payment_session_id') }}:
                        </strong>
                        <strong class="item-value mt-2 pl-2">{{ transaction.payment_session_id }}</strong>
                    </v-col>
                    <v-col class="cstmr-full-detail border border-radius" cols="6">
                        <strong class="d-flex align-center gap05 cstm-style fontSize12 fontWeight400">
                            <img :class="isRtl ? 'ml-1' : 'mr-1'" src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Icon_8.svg?v=1754994857"
                                alt="View Details" style="width:20px; height:20px;" />{{ $t('transaction_popup.payment_provider') }}:
                        </strong>
                        <strong class="item-value mt-2 pl-2">
                            {{
                                transaction.payment_source && transaction.payment_source !== "-" && transaction.payment_source !== null
                                ? $t(`payment_provider.${transaction.payment_source}`)
                                : "-"
                            }}
                        </strong>
                    </v-col>
                    <v-col class="cstmr-full-detail border border-radius" cols="12" style="max-width: 100%;">
                        <strong class="d-flex align-center gap05 cstm-style fontSize12 fontWeight400">
                            <img :class="isRtl ? 'ml-1' : 'mr-1'" src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Date_Icon_8bea9c7e-3d2d-4756-a392-7ca8560d09d5.svg?v=1754994857"
                                alt="View Details" style="width:20px; height:20px;" />{{ $t('transaction_popup.transaction_date_time') }}:
                        </strong>
                        <strong class="item-value mt-2 pl-2">{{ transaction.transaction_datetime }}</strong>
                    </v-col>
                    <v-col class="cstmr-full-detail border border-radius" cols="12" style="max-width: 100%;">
                        <strong class="d-flex align-center gap05 cstm-style fontSize12 fontWeight400">
                            <img :class="isRtl ? 'ml-1' : 'mr-1'" src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Date_Icon_8bea9c7e-3d2d-4756-a392-7ca8560d09d5.svg?v=1754994857"
                                alt="View Details" style="width:20px; height:20px;" />{{ $t('transaction_popup.response_detail') }}:
                        </strong>
                        <strong class="item-value mt-2 pl-2">Dear Customer, Thank you for your payment, Your transaction
                            has been received successfully.</strong>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: "TransactionsDetails",
  props: {
    isOpen: Boolean,
    isRtl:Boolean,
    charges: {
      type: [String, Number],
      default: "",
    },
    currency: {
      type: [String, Number],
      default: "",
    },
    transaction: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    dialog: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:isOpen", value);
      },
    },
  },
};

</script>
