<template>
  <div class="dashboard-container">
    <div class="dashboard-details">
      <div class="contact-details-error mb-4">
        <template v-if="stats_loading == false">
          <div class="contact-alert mt-4 pageWidth" v-if="dashboard_stats?.data?.is_contact_detail == false">
            <router-link to="/settings" style="text-decoration:none;">
              <v-alert color="#FFF1E3" dark>
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/AlertTriangle.svg?v=1755608164"
                      alt="alert icon" style="width:20px; height:20px; margin-right:8px;" />
                    <p class="warning-desc fontSize14 fontWeight400">{{ $t('contact_detail_warning_desc') }}</p>
                  </div>
                  <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Chevron.svg?v=1755608806"
                    alt="alert icon" style="width:20px; margin-right:8px;" :class="{ 'rtl-rotate': isRtl }" />
                </div>
              </v-alert>
            </router-link>
          </div>
        </template>
        <div class="mt-4" v-if="stats_loading">
          <v-skeleton-loader class="pageWidth pa-2" type="text" color="#fff1e3" />
        </div>
      </div>
      <div class="stats-container">
        <v-container class="pa-0 pageWidth">
          <v-row cols="12" md="4" class="stats-row">
            <v-col class="pa-0">
              <div class="col-wrapper bgWhite border-radius pa-4">
                <div class="box-header d-flex align-center justify-space-between mb-2">
                  <div class="left-col d-flex align-center">
                    <div class="revenue-tooltip" :class="isRtl ? 'ml-2' : 'mr-2'">
                      <v-tooltip content-class="custom-tooltip" color="#fff" :text="$t('total_revenue_tooltip_desc')"
                        :location="isRtl ? 'top right' : 'top left'" interactive>
                        <template #activator="{ props }">
                          <v-btn density="comfortable" v-bind="props" icon variant="plain">
                            <v-icon color="#454444">mdi-information-outline</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                    <span class="heading LightgreyColor fontSize14 fontWeight600">{{ $t('total_revenue_heading')
                    }}</span>
                  </div>
                  <div class="right-col">
                    <img :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_5.svg?v=1752473717'"
                      class="mr-2" contain width="17px" />
                  </div>
                </div>
                <div class="amount mb-3">
                  <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                    width="100%" height="25px" />
                  <h2 v-else class="fontSize24 fontWeight700">
                    <span class="pr-1">{{ dashboard_stats?.data?.currency_symbol }}</span>
                    <span>{{ dashboard_stats?.data?.success_transaction_amount }}</span>
                  </h2>
                </div>

                <div class="monthly-transaction">
                  <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                    width="100%" height="30px" />
                  <span v-else><span class="monthly-price green fontSize12 fontWeight500"><span class="pr-0">
                        {{ dashboard_stats.data.currency_symbol }}
                      </span>
                      <span> {{ dashboard_stats.data.last_month_success_transaction_amount }}</span>
                    </span>
                    <span class="fontSize12 greyColor fontWeight500" :class="isRtl ? 'pr-1' : 'pl-1'">{{ $t('so_far_in')
                    }}
                      <span>{{
                        new Intl.DateTimeFormat($i18n.locale, {
                          month: 'long',
                          year: 'numeric'
                        }).format(new Date(dashboard_stats?.data?.last_month_with_year))
                      }}</span>
                    </span>
                  </span>
                </div>
              </div>
            </v-col>
            <v-col class="pa-0">
              <div class="col-wrapper bgWhite border-radius pa-4">
                <div class="box-header d-flex align-center justify-space-between mb-2">
                  <div class="left-col d-flex align-center">
                    <div class="revenue-tooltip" :class="isRtl ? 'ml-2' : 'mr-2'">
                      <v-tooltip content-class="custom-tooltip" color="#fff" :text="$t('transactions_tooltip_desc')"
                        :location="isRtl ? 'top right' : 'top left'" interactive>
                        <template #activator="{ props }">
                          <v-btn density="comfortable" v-bind="props" icon variant="plain">
                            <v-icon color="#454444">mdi-information-outline</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                    <span class="heading LightgreyColor fontSize14 fontWeight600">{{ $t('transactions_heading')
                    }}</span>
                  </div>
                  <div class="right-col">
                    <img :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/transaction.svg?v=1752228642'"
                      class="mr-2" contain width="17px" />
                  </div>
                </div>
                <div class="amount mb-3">
                  <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                    width="100%" height="25px" />
                  <h2 v-else class="fontSize24 fontWeight700">
                    {{
                      dashboard_stats.data.success_transaction_count +
                      dashboard_stats.data.failed_transaction_count
                    }}
                  </h2>
                </div>
                <div class="monthly-transaction">
                  <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                    width="100%" height="30px" />
                  <span v-else class="monthly-price green fontSize12 fontWeight500">
                    {{ dashboard_stats.data.success_transaction_count }}
                    <span class="fontSize12 greyColor fontWeight500" :class="isRtl ? 'pr-1' : 'pl-1'">{{
                      $t('successful_ransactions') }}</span>
                  </span>
                </div>
              </div>
            </v-col>
            <v-col class="pa-0">
              <div class="col-wrapper bgWhite border-radius pa-4">
                <div class="box-header d-flex align-center justify-space-between mb-2">
                  <div class="left-col d-flex align-center">
                    <div class="revenue-tooltip" :class="isRtl ? 'ml-2' : 'mr-2'">
                      <v-tooltip content-class="custom-tooltip" color="#fff" :text="$t('success_rate_tooltip_desc')"
                        :location="isRtl ? 'top right' : 'top left'" interactive>
                        <template #activator="{ props }">
                          <v-btn density="comfortable" v-bind="props" icon variant="plain">
                            <v-icon color="#454444">mdi-information-outline</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                    <span class="heading LightgreyColor fontSize14 fontWeight600">{{ $t('success_rate_heading')
                    }}</span>
                  </div>
                  <div class="right-col">
                    <img :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/success-rate.svg?v=1752228738'"
                      class="mr-2" contain width="17px" />
                  </div>
                </div>
                <div class="amount mb-3">
                  <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                    width="120px" height="36px" />
                  <h2 v-else class="fontSize24 fontWeight700">
                    {{ dashboard_stats.data.success_rate_percent }}%
                  </h2>
                </div>
                <div class="monthly-transaction">
                  <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                    width="120px" height="20px" />
                  <span v-else><span class="monthly-price green fontSize12 fontWeight500">{{
                    dashboard_stats.data.last_month_success_rate
                      }}%</span><span class="fontSize12 greyColor fontWeight500" :class="isRtl ? 'pr-1' : 'pl-1'">{{
                        $t('last_month_success_rate')
                      }}</span></span>
                </div>
              </div>
            </v-col>
            <v-col class="pa-0">
              <div class="col-wrapper bgWhite border-radius pa-4">
                <div class="box-header d-flex align-center justify-space-between mb-2">
                  <div class="left-col d-flex align-center">
                    <div class="revenue-tooltip" :class="isRtl ? 'ml-2' : 'mr-2'">
                      <v-tooltip content-class="custom-tooltip" color="#fff" :text="$t('in_progress_tooltip_desc')"
                        :location="isRtl ? 'top right' : 'top left'" interactive>
                        <template #activator="{ props }">
                          <v-btn density="comfortable" v-bind="props" icon variant="plain">
                            <v-icon color="#454444">mdi-information-outline</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                    <span class="heading LightgreyColor fontSize14 fontWeight600">{{ $t('in_progress_heading') }}</span>
                  </div>
                  <div class="right-col">
                    <img :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/progress.svg?v=1752228795'"
                      class="mr-2" contain width="17px" />
                  </div>
                </div>
                <div class="amount mb-3">
                  <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                    width="120px" height="25px" />
                  <h2 v-else class="fontSize24 fontWeight700">{{ dashboard_stats.data.pending_transaction_count }}</h2>
                </div>
                <v-skeleton-loader v-if="stats_loading || !dashboard_stats.data" type="text" class="inline-skeleton"
                  width="120px" height="30px" />
                <div class="monthly-transaction" v-else>
                  <span class="monthly-price yellow fontSize12 fontWeight500"><span>{{
                    dashboard_stats.data.currency_symbol
                      }}</span>{{
                        dashboard_stats.data.pending_transaction_amount }}</span><span
                    class="fontSize12 greyColor fontWeight500" :class="isRtl ? 'pr-1' : 'pl-1'">
                    {{
                      $t('amount_of_transactions')
                    }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="graph-container border pa-4 pageWidth bgWhite border-radius mt-4">
        <div class="graph-headings-container pl-4 mb-4 d-flex align-center justify-space-between flex-wrap">
          <div class="heading-left">
            <h2 class="fontWeight600 fontSize18 mb-1 fontSize18 fontWeight600">{{ $t('payment_trend_title') }}</h2>
            <p class="p-dashboard fontSize12 fontWeight500">{{ $t('payment_trend_desc') }}</p>
          </div>
          <div class="select-right">
            <v-select v-model="selectedRange" :items="[
              { value: '6m', text: $t('6months'), props: { class: 'cst-range' } },
              { value: '1y', text: $t('1year'), props: { class: 'cst-range' } }
            ]" placeholder="Duration" class="custom-select" variant="outlined" density="compact" item-title="text"
               item-value="value" hide-details append-icon=""
              :append-inner-icon="menuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" v-model:menu="menuOpen"
              @update:model-value="updateChartData" />
          </div>
        </div>
        <LineChart :chart-data="datacollection" :chart-options="chartOptions" :key="shop_currency" />
      </div>
    </div>
    <div class="snackbar">
      <v-snackbar :class="{ 'rtl-rotate': isRtl }" v-model="snackbar" :location="isRtl ? 'top left' : 'top right'"
        :timeout="snackbar_timeout" :color="snackbar_status">
        {{ snackbar_text ? $t(snackbar_text) : snackbar_text }}
        <template #action="{ attrs }">
          <v-btn color="#fff" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import script from './Dashboard.js'

export default {
  ...script
}
</script>

<style lang="scss" src="./Dashboard.scss"></style>
