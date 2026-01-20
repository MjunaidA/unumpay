<template>
  <div class="filter-bar mt-4">
    <v-row class="filter-bar-wrapper cstm-filter-bar border pageWidth bgWhite border-radius pa-2">
      <v-col cols="12" sm="6" md="4" class="search pa-2 filter-col">
        <v-text-field height="37px" :label="$t('$vuetify.search')" class="border-radius" variant="outlined"
          density="compact" v-model="search" hide-details>
          <template v-slot:prepend-inner>
            <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Search.svg?v=1754892504" alt="Search"
              style="width:20px; height:20px; cursor:pointer;" />
          </template>
        </v-text-field>

      </v-col>
      <v-col cols="12" sm="6" md="3" class="date pa-2 filter-col">
        <v-menu v-model="menu" :close-on-content-click="false" offset-y transition="scale-transition" max-width="350">
          <template #activator="{ props }">
            <v-text-field density="compact" v-bind="props" :placeholder="$t('$vuetify.date_range_placeholder')"
              v-model="rangeText" readonly hide-details="auto" variant="outlined">
              <template #prepend-inner>
                <img
                  src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Calendar_Schedule_c5140360-d30c-4cf5-8ce7-22e166040901.svg?v=1760610746"
                  alt="Calendar" style="width:20px; height:20px; cursor:pointer;" />
              </template>
            </v-text-field>
          </template>

          <VcDatePicker expanded :columns="$vuetify.display.smAndDown ? 1 : 2" :class="{ 'rtl-calendar': isRtl }"
            :locale="$i18n.locale" v-model.range="range" mode="date" :disabled-dates="disabledDates">
            <template #footer>
              <div class="flex justify-end p-2 pb-4" :class="isRtl ? 'pr-4' : 'pl-4'">
                <v-btn class="calandar-save-btn" size="small" color="#2563eb" @click="applyDateRange()">
                  {{ $t('$vuetify.doneBtn') }}
                </v-btn>
              </div>
            </template>
          </VcDatePicker>
        </v-menu>

      </v-col>
      <v-col cols="12" sm="6" md="2" class="payment-provider pa-2 capatilize color535D6D filter-col">
        <v-select v-model="paymentProviderSelect" :items="paymentProviders.filter(p => p.is_active)"
          :item-title="item => $t('payment_provider.' + (item.backend_value || 'all'))" item-value="backend_value"
          variant="outlined" density="compact" placeholder="Payment Provider" hide-details class="no-caret"
          :menu-props="{ contentClass: 'custom-dropdown' }" />


      </v-col>
      <v-col cols="12" sm="6" md="1" class="status pa-2 capatilize color535D6D filter-col">
        <v-select variant="outlined" density="compact" v-model="statusSelect" :items="[
          { value: 'all', text: $t('status.all') },
          { value: 'success', text: $t('status.success') },
          { value: 'pending', text: $t('status.pending') },
          { value: 'failed', text: $t('status.failed') }
        ]" item-title="text" item-value="value" placeholder="Status" outlined hide-details dense
          :menu-props="{ contentClass: 'custom-dropdown' }"></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="2" class="download-btn pa-2 filter-col">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn class="lowercase" block variant="outlined" density="compact" v-bind="props">
              <img :class="isRtl ? 'ml-4' : 'mr-4'"
                src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Download_Save_Upload.svg?v=1754894696"
                alt="download icon" style="width:20px; height:20px;">
              {{ $t('download.title') }}
              <img :class="isRtl ? 'mr-4' : 'ml-4'"
                src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Arrow.png?v=1754894657" alt="down icon"
                style="width:20px; height:20px;">
            </v-btn>
          </template>
          <v-list class="action-list custom-dropdown">
            <v-list-item class="cursorPointer" @click="downloadActivitiesCSV()">
              <v-list-item-title>{{ $t('download.activities_csv') }}</v-list-item-title>
            </v-list-item>

            <v-list-item class="cursorPointer" @click="downloadPendingReportCSV()">
              <v-list-item-title>{{ $t('download.pending_report_csv') }}</v-list-item-title>
            </v-list-item>

            <v-list-item class="cursorPointer" @click="downloadCardPreportCSV">
              <v-list-item-title>{{ $t('download.card_report_csv') }}</v-list-item-title>
            </v-list-item>

            <v-list-item class="cursorPointer" @click="downloadBillingReportCSV()">
              <v-list-item-title>{{ $t('download.billing_report_csv') }}</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>

      </v-col>
    </v-row>
  </div>
  <div class="transaction-stats mt-4">
    <v-container class="pa-0 pageWidth">
      <v-row class="stats-row" dense :class="isRtl ? 'right' : 'left'">
        <v-col class="pa-0 column" cols="12" sm="6" md="4">
          <div class="col-wrapper bgWhite border-radius pa-4">
            <div class="box-header d-flex align-center justify-space-between mb-3">
              <div class="left-col d-flex align-center">
                <span class="fontSize18 fontWeight700 LightgreyColor">{{ $t('transaction_stats.successful') }}</span>
              </div>
              <div class="right-col">
                <img :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Icon_5.svg?v=1754633445'" contain
                  width="25px" />
              </div>
            </div>
            <div class="tra-amount">
              <v-skeleton-loader v-if="stats_loading" type="text" class="inline-skeleton" width="100%" height="36px" />
              <div v-else class="d-flex align-center justify-space-between">
                <h4 class="trans-count greyColor fontSize16 fontWeight600">{{ transactionsStats.success_transaction }}
                </h4>
                <h2 class="trans-amt fontSize24 fontWeight6700"><span>{{ transactionsStats.currency_symbol }}</span>{{
                  transactionsStats.success_transaction_amount }}</h2>
              </div>
            </div>
          </div>
        </v-col>
        <v-col class="pa-0 column" cols="12" sm="6" md="4">
          <div class="col-wrapper bgWhite border-radius pa-4">
            <div class="box-header d-flex align-center justify-space-between mb-3">
              <div class="left-col d-flex align-center">
                <span class="fontSize18 fontWeight700 LightgreyColor">{{ $t('transaction_stats.in_progress') }}</span>
              </div>
              <div class="right-col">
                <img
                  :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_565db073-4839-43ff-bf0c-5b4da34e4047.svg?v=1754907181'"
                  contain width="25px" />
              </div>
            </div>
            <div class="tra-amount">
              <v-skeleton-loader v-if="stats_loading" type="text" class="inline-skeleton" width="100%" height="36px" />
              <div v-else class="d-flex align-center justify-space-between">
                <h4 class="trans-count greyColor fontSize16 fontWeight600">{{ transactionsStats.pending_transaction }}
                </h4>
                <h2 class="trans-amt fontSize24 fontWeight6700"><span>{{ transactionsStats.currency_symbol }}</span>{{
                  transactionsStats.pending_transaction_amount }}</h2>
              </div>
            </div>
          </div>
        </v-col>
        <v-col class="pa-0 column" cols="12" sm="6" md="4">
          <div class="col-wrapper bgWhite border-radius pa-4">
            <div class="box-header d-flex align-center justify-space-between mb-3">
              <div class="left-col d-flex align-center">
                <span class="fontSize18 fontWeight700 LightgreyColor">{{ $t('transaction_stats.failed') }}</span>
              </div>
              <div class="right-col">
                <img
                  :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_163000e1-003c-498e-bde5-40a728854fb4.svg?v=1754907213'"
                  contain width="25px" />
              </div>
            </div>
            <div class="tra-amount">
              <v-skeleton-loader v-if="stats_loading" type="text" class="inline-skeleton" width="100%" height="36px" />
              <div v-else class="d-flex align-center justify-space-between">
                <h4 class="trans-count greyColor fontSize16 fontWeight600">{{ transactionsStats.failed_transaction }}
                </h4>
                <h2 class="trans-amt fontSize24 fontWeight6700"><span>{{ transactionsStats.currency_symbol }}</span>{{
                  transactionsStats.failed_transaction_amount }}</h2>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div class="transaction-details mt-4">
    <v-container class="pageWidth bgWhite border border-radius">
      <div class="table-headings d-flex align-center justify-space-between mb-3">
        <h2 class="fontSize16 fontWeight600 ">{{ $t('transaction_table.title') }}</h2>
        <v-skeleton-loader v-if="stats_loading" type="text" class="inline-skeleton" width="100px" height="30px" />
        <h5 v-else class="fontSize12 fontWeight500 greyColor d-flex">
          <span>{{ $t('transaction_table.charges') }}:</span>
          <span>
            <span>{{ transactionsStats.currency_symbol }}</span>
            <span>{{ transactionsStats.unumpay_charges }}</span>
          </span>
        </h5>
      </div>
      <template v-if="trans_loading">
        <v-skeleton-loader class="mb-4" type="table-row" v-for="n in 4" :key="n" width="100%" height="40px" />
      </template>
      <v-data-table :headers="headers" :items="searchedAndFilteredTransactions" density="compact" :items-per-page="15"
        v-else>
        <template #no-data>
          <div class="text-center py-6">
            <span class="text-grey">
              {{ $t('$vuetify.no_data_available') }}
            </span>
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip size="small" dark :class="{
            'status-success': item.status === 'success',
            'status-pending': item.status === 'pending',
            'status-failed': item.status === 'failed'
          }">
            {{ $t('status.' + item.status?.toLowerCase()) }}
          </v-chip>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.currency_symbol + item.amount }}
        </template>

        <template v-slot:[`item.payment_source`]="{ item }">
          {{
            item.payment_source && item.payment_source !== "-" && item.payment_source !== null
              ? $t(`payment_provider.${item.payment_source}`)
              : "-"
          }}
        </template>



        <template v-slot:[`item.action`]="{ item }">
          <v-btn icon @click="handleViewAction(item)" style="background-color: transparent; box-shadow: none;">
            <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/View_Details.svg?v=1754915701"
              alt="View Details" style="width:20px; height:20px;" />
          </v-btn>
        </template>

      </v-data-table>


    </v-container>
  </div>
  <div class="snackbar">
    <v-snackbar :class="{ 'rtl-rotate': isRtl }" v-model="snackbar" location="top right" :timeout="snackbar_timeout"
      :color="snackbar_status">
      {{ snackbar_text
        ? ($te('transaction_snackbar.' + snackbar_text)
          ? $t('transaction_snackbar.' + snackbar_text)
          : snackbar_text)
        : ''
      }}
    </v-snackbar>
  </div>
  <!-- popup -->
  <div class="trans-popup">
    <TransactionsDetails v-if="selectedTransaction != null" v-model:isOpen="popupOpen"
      :charges="transactionsStats.unumpay_charges" :currency="transactionsStats.currency"
      :transaction="selectedTransaction" :isRtl="isRtl" />


  </div>
</template>





<script>
import script from './Transaction.js'

export default {
  ...script,
};
</script>

<style lang="scss" src="./Transaction.scss"></style>
