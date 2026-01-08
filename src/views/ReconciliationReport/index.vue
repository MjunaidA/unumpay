<template>
  <div class="reconciliation-page-container cstm-filter-bar" v-if="!loading_data && reportStatus == true">
    <div class="alert-container pageWidth border-radius mt-4">
      <v-alert color="#FFD2D2" dark style="color:#D60000;" class="align-center pa-2 border-radius">
        <img :class="isRtl ? 'ml-2' : 'mr-2'"
          src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_5_6d82280d-c27a-4a50-8955-2ce8dbfedd66.svg?v=1755585970"
          alt="alert icon" style="width:20px; height:20px;" />
        <span class="fontSize14 fontWeight400">{{ $t("reconciliationReportPage.alert_message") }}</span>
      </v-alert>

    </div>
    <v-row
      class="reconciliation-filter-wrapper align-center d-flex flex-wrap pageWidth bgWhite border-radius border mt-4 filter-bar">
      <v-col cols="12" class="search pa-2 filter-col">
        <v-text-field height="37px" :label="$t('$vuetify.search')" class="border-radius" variant="outlined"
          density="compact" v-model="search" hide-details>
          <template v-slot:prepend-inner>
            <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Search.svg?v=1754892504" alt="Search"
              style="width:20px; height:20px; cursor:pointer;" />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" class="date pa-2 filter-col">
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
      <v-col cols="12" class="download-btn pa-2 filter-col">
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
            <v-list-item class="cursorPointer" @click="downloadTransactions()">
              <v-list-item-title >{{ $t('reconciliationReportPage.download_csv') }}</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>

      </v-col>

    </v-row>

    <div class="data-table">
      <div class="data-table-container">
        <v-container class="pageWidth bgWhite border-radius border mt-4">
          <div class="table-header">
            <h3 class="mb-4 fontWeight600 fontSize16">{{ $t('reconciliationReportPage.table.title') }}</h3>
            <template v-if="table_loading">
              <v-skeleton-loader class="mb-4" type="table-row" v-for="n in 4" :key="n" width="100%" height="40px" />
            </template>
            <template v-else>
              <v-card v-for="(item, index) in filteredTransactions" :key="index" class="mb-4 pa-4 custom-outlined-card" variant="outlined"
                rounded="lg">
                <div class="d-flex justify-space-between align-center mb-3">
                  <div class="order-no fontSize12 fontWeight600">
                    {{ $t('reconciliationReportPage.table.order_no') }}. {{ item.order_number }}
                  </div>
                  <div class="customer-name fontSize12 fontWeight600">{{ item.first_name }} <span>{{ item.last_name
                      }}</span>
                  </div>
                </div>

                <v-row class="gap-4">

                  <v-col cols="12" sm="4" md="2" class="px-2">
                    <div class="table-col">
                      <span class="list-heading fontSize10 fontWeight400">{{ $t('reconciliationReportPage.table.transaction_id') }}</span>
                      <div class="fontWeight500 fontSize12">{{ item.id }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4" md="2" class="px-2">
                    <div class="table-col">
                      <span class="list-heading fontSize10 fontWeight400">{{ $t('reconciliationReportPage.table.email') }}:</span>
                      <div class="fontWeight500 fontSize12">{{ item.email }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4" md="2" class="px-2">
                    <div class="table-col">
                      <span class="list-heading fontSize10 fontWeight400">{{ $t('reconciliationReportPage.table.payment_session') }}:</span>
                      <div class="fontWeight500 fontSize12">{{ item.payment_session }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4" md="2" class="px-2">
                    <div class="table-col">
                      <span class="list-heading fontSize10 fontWeight400">{{ $t('reconciliationReportPage.table.payment_source') }}:</span>
                      <div class="fontWeight500 fontSize12">{{ item.payment_source? $t(`payment_provider.${item.payment_source.toLowerCase()}`): '-'}}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4" md="2" class="px-2">
                    <div class="table-col">
                      <span class="list-heading fontSize10 fontWeight400">{{ $t('reconciliationReportPage.table.amount') }}:</span>
                      <div class="fontWeight500 fontSize12"><span>{{ item.currency_symbol }}</span>{{ item.transaction_amount }}
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4" md="2" class="px-2">
                    <div class="table-col">
                      <span class="list-heading fontSize10 fontWeight400">{{ $t('reconciliationReportPage.table.order_amount') }}:</span>
                      <div class="fontWeight500 fontSize12"><span>{{ item.currency_symbol }}</span>{{ item.total_price }}
                      </div>
                    </div>
                  </v-col>

                </v-row>

                <div class="d-flex justify-space-between align-center w-100 mt-4">
                  <v-col class="d-flex align-center pa-0">
                    <div class="d-flex align-center cstm-style fontSize12 fontWeight400">
                      <img :class="isRtl ? 'ml-2' : 'mr-2'"
                        src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Calendar_Schedule.svg?v=1754896202"
                        alt="Calendar" style="width:16px; height:16px;">
                      <span>{{ item.created_date }}</span>
                    </div>
                  </v-col>

                  <v-col class="d-flex align-center justify-end pa-0">
                    <div class="d-flex align-center cstm-style fontSize12 fontWeight400">
                      <img :class="isRtl ? 'ml-2' : 'mr-2'" src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_6.svg?v=1755600626"
                        alt="Calendar" style="width:16px; height:16px;">
                      <span>{{ item.created_time }}</span>
                    </div>

                  </v-col>
                </div>
              </v-card>
            </template>
            <p v-if="transactions.length == 0 && !table_loading" class="empty-data  fontSize14 center">{{ $t('$vuetify.no_data_available') }}</p>
          </div>
        </v-container>
      </div>
    </div>
  </div>
  <div v-else-if="!loading_data && reportStatus == false"
    class="configuration-empty pageWidth bgWhite border border-radius mt-4">
    <div class="config-wrapper">
      <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Info_graphic_P.png?v=1755589724" />
      <p class="mt-3 fontWeight400 fontSize16">
        {{ $t("reconciliationReportPage.empty_config_desc") }}
      </p>
      <router-link to="/payment-service-providers" exact-active-class="isActivated">
        <button class="mt-2 px-4 py-2 rounded get-started-btn">
          {{ $t("reconciliationReportPage.go_to_settings") }}
        </button>
      </router-link>
    </div>
  </div>

  <div class="loader">
    <v-card-text v-if="loading_data == true">
      <v-progress-circular class="circular-loader" indeterminate color="black"></v-progress-circular>
    </v-card-text>
    <v-snackbar :class="{ 'rtl-rotate': isRtl }" v-model="snackbar" location="top right" :timeout="snackbar_timeout"
      :color="snackbar_status">
      {{ snackbar_text ? $t('reconciliation_report_snackbar.' + snackbar_text) : snackbar_text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="#fff" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import script from './ReconciliationReport.js'

export default {
  ...script
}
</script>

<style lang="scss" src="./ReconciliationReport.scss"></style>
