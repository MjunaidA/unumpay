<template>
  <div class="filter-bar-container cstm-filter-bar advance-payment-filters">
    <v-row
      class="payment-filter-wrapper align-center d-flex flex-wrap pageWidth bgWhite border-radius border mt-4 filter-bar">
      <v-col cols="12" class="advance-payment-search">
        <div class="advance-table-search">
          <v-text-field height="37px" :label="$t('$vuetify.search')" class="border-radius" variant="outlined"
            density="compact" v-model="search" hide-details>
            <template v-slot:prepend-inner>
              <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Search.svg?v=1754892504" alt="Search"
                style="width:20px; height:20px; cursor:pointer;" />
            </template>
          </v-text-field>
        </div>
      </v-col>
      <v-col cols="12" class="demo-btn d-flex align-center">
        <a target="_blank"
          class="d-flex alignCenter border border-radius pl-2 pr-2 pt-1 pb-1 align-center capatilize fontSize14"
          href="https://drive.google.com/file/d/1zkwiRRTLMZGgMpBkOTa2r7ex-89JmixT/view?usp=sharing">
          <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_3.svg?v=1755498014" alt="Play"
            width="20" />
          {{ $t('advance_payment.filter.button1') }}
        </a>
      </v-col>
      <v-col cols="12" class="advance-payment-btn d-flex">
        <v-btn class="advance-btn" @click="openAdvancePaymentDialog">
          <img :class="isRtl ? 'ml-4' : 'mr-4'"
            src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Plus_Add.svg?v=1755498029" alt="+"
            width="22px" />
          {{ $t('advance_payment.filter.button2') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <div class="advance-payment-details mt-4">
    <div class="table-wrapper pageWidth bgWhite border border-radius">
      <div class="table-headings d-flex align-center justify-space-between mb-3 pa-4">
        <h2 class="fontSize16 fontWeight600">{{ $t('advance_payment.table.title') }}</h2>
      </div>
      <template v-if="loading_data">
        <v-skeleton-loader class="mb-4" type="table-row" v-for="n in 4" :key="n" width="100%" height="40px" />
      </template>
      <v-data-table class="advance-pay-table" :headers="headers" :items="searchedAndFilteredTransactions" dense
        :items-per-page="15" v-else>

        <template #no-data>
          <div class="text-center py-6">
            <span class="text-grey">
              {{ $t('$vuetify.no_data_available') }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.payment_status`]="{ item }">
          <v-chip size="small" dark :class="{
            'status-success': item.payment_status === 'success',
            'status-pending': item.payment_status === 'pending',
            'status-failed': item.payment_status === 'failed'
          }">
            {{ $t('status.' + item.payment_status?.toLowerCase()) }}
          </v-chip>
        </template>

        <template v-slot:[`item.amount`]="{ item }">
          {{ item.currency_symbol + item.amount }}
        </template>


        <template v-slot:[`item.payment_link`]="{ item }">
          <v-btn class="copy-btn" variant="plain" v-if="item.payment_link" small
            @click="copyToClipboard(item.payment_link)">
            {{ $t('advance-payment_table.copy') }}
          </v-btn>
          <v-btn class="copy-btn" variant="plain" v-else small>
            -
          </v-btn>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn class="options-btn" text icon v-bind="props" variant="plain">
                <v-icon color="#16A349">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="editItem(item)">
                <v-list-item-title>{{ $t('advance-payment_table.edit') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="generateLink(item)" v-if="item.short_code == ''">
                <v-list-item-title>{{ $t('advance-payment_table.generate_link') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </template>
      </v-data-table>
    </div>
  </div>

  <div class="snackbar">
    <v-snackbar :class="{ 'rtl-rotate': isRtl }" v-model="snackbar" location="top right" :timeout="snackbar_timeout"
      :color="snackbar_status">
      {{ snackbar_text ? $t('advance-payment_snackbar.' + snackbar_text) : snackbar_text }}
    </v-snackbar>
  </div>
  <!-- popup -->
  <div class="add-payment-dialog">
    <AddPayment :advance_payment_item="advance_payment_item" :loading_data="loading_data" :currency_list="currency_list"
      :country_list="country_list" :translatedCountryList="translatedCountryList" v-model:dialog="dialog" :isRtl="isRtl"
      @submit="postAdvancePayment" />


  </div>
</template>


<script>
import script from './AdvancePayments.js'

export default {
  ...script
}
</script>

<style lang="scss" src="./AdvancePayments.scss"></style>