<template>
  <div class="provider-filter">
    <div>
      <v-row
        class="provider-filter-wrapper border cstm-filter-bar filter-bar d-flex flex-wrap align-center pageWidth bgWhite border-radius mt-4">
        <v-col class="search" v-if="activeTab == 'overview'">
          <v-text-field height="37px" :label="$t('$vuetify.search')" class="border-radius" variant="outlined"
            density="compact" v-model="search" hide-details>
            <template v-slot:prepend-inner>
              <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Search.svg?v=1754892504" alt="Search"
                style="width:20px; height:20px; cursor:pointer;" />
            </template>
          </v-text-field>
        </v-col>
        <v-col class="country" v-if="activeTab == 'overview'">
          <v-select v-model="selectedCountry" :items="mappedCountries" item-title="title" hide-details
            item-value="value" :label="$t('payment-providers_page.country_filter_label')" variant="outlined"
            density="compact" v-model:menu="isCountryMenuOpen"
            :append-inner-icon="isCountryMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </v-col>
        <v-col class="status" v-if="activeTab == 'overview'">
          <v-select v-model="statusSelect" :items="statusOptions" item-title="label" item-value="value"
            :label="$t('payment-providers_page.status_filter_label')" variant="outlined" density="compact" hide-details
            v-model:menu="isStatusMenuOpen"
            :append-inner-icon="isStatusMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </v-col>
        <v-col class="payment-provider" v-if="activeTab == 'configuration'">
          <v-select v-model="selectedProvider" :items="ProviderTitle" item-title="display_name"
            item-value="provider_name" :label="$t('payment-providers_page.payment_provider_filter_label')"
            variant="outlined" density="compact" hide-details style="width: 100%;" v-model:menu="isSelectorMenuOpen"
            :append-inner-icon="isSelectorMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </v-col>
        <v-col class="overview">
          <v-btn class="tab" :class="{ active: activeTab === 'overview' }"
            :disabled="AllProviderLoading || saveDataLoading"
            @click="() => { activeTab = 'overview'; getAllProviderData(); countryMenu = false; statusMenu = false }">
            {{ $t('payment-providers_page.buttons.overview') }}
          </v-btn>
        </v-col>
        <v-col class="configuration">
          <v-btn class="tab" :class="{ active: activeTab === 'configuration' }"
            :disabled="AllProviderLoading || saveDataLoading" @click="tabClick()">
            {{ $t('payment-providers_page.buttons.configuration') }}
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="activeTab == 'overview'">
        <div class="provider-config-list">
          <div class="provider-config-wrapper mt-6 mb-15">
            <v-row v-if="AllProviderLoading" class="pageWidth">
              <v-col cols="12" md="6" v-for="n in 4" :key="n" class="bgWhite border-radius provider-loading-row">
                <v-skeleton-loader type="image, text, text" class="skeleton-box bgWhite border-radius" />
              </v-col>
            </v-row>
            <v-row v-else class="pageWidth">
              <v-col cols="12" md="6" v-for="(provider, index) in filteredProviders" :key="index"
                class="bgWhite border border-radius provider-loading-row">
                <div class="box">
                  <div class="provider-name d-flex justify-space-between mb-4">
                    <div class="p-name-logo d-flex gap05 align-center">
                      <div class="provider-logo">
                        <img :src="provider.logo_url" alt="payment provider icon" />
                      </div>
                      <h3 class="fontWeight600 fontSize16 capitalize">{{
                        $t(`payment_provider.${provider.transaction_obj.provider_name}`) }}</h3>
                      <img v-if="provider.is_configured" :src="provider.credential.is_active
                        ? 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Done_Check.svg?v=1754483259'
                        : 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group.svg?v=1754483619'"
                        alt="payment provider icon" :style="{ width: '20px' }" />
                      <img v-if="!provider.is_configured"
                        :src="'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Status.svg?v=1757411351'"
                        alt="payment provider icon" :style="{ width: '20px' }" />
                    </div>
                    <div class="provider-status" v-if="provider.is_configured">
                      <v-chip size="small" dark :class="{
                        'status-success capatilize fontWeight500 fontSize12': provider.credential.is_active === true,
                        'status-pending capatilize fontWeight500 fontSize12': provider.credential.is_active === false
                      }">{{ $t('status.' + (provider.credential.is_active ? 'active' : 'inactive')) }}

                      </v-chip>
                    </div>
                    <div v-else class="provider-status">
                      <v-chip size="small" dark class="capatilize fontWeight500 fontSize12">
                        {{ $t('status.configure') }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="provider-trans-deail d-flex justify-space-between mb-4">
                    <div class="provider-transactions">
                      <h4 class="ma-0 mb-2 capatilize fontSize12 fontWeight500 greyColor">{{
                        $t('payment-providers_page.text.transactions') }}</h4>
                      <div class="fontWeight700 fontSize16">{{ provider.is_configured ?
                        provider.transaction_obj.success_transaction : '--' }}
                      </div>
                    </div>
                    <div class="provider-volume">
                      <h4 class="ma-0 mb-2 capatilize fontSize12 fontWeight500 greyColor">{{
                        $t('payment-providers_page.text.volume') }}</h4>
                      <div class="fontWeight700 fontSize16" v-if="provider.is_configured">
                        <span>{{ provider.transaction_obj.currency_symbol
                        }}</span>{{ provider.transaction_obj.success_transaction_amount }}
                      </div>
                      <div v-else>
                        --
                      </div>
                    </div>
                  </div>
                  <div class="provider-success-rate">
                    <div class="success-rate d-flex justify-space-between align-center mb-2">
                      <h4 class="capatilize fontSize12 fontWeight500 greyColor">{{
                        $t('payment-providers_page.text.success_rate') }}</h4>
                      <div class="rate-percentage fontWeight700 fontSize16" v-if="provider.is_configured">{{
                        provider.transaction_obj.success_rate }}%
                      </div>
                      <div class="rate-percentage" v-else>-%
                      </div>
                    </div>
                    <div class="success-bar mb-2">
                      <v-progress-linear :model-value="provider.transaction_obj.success_rate" height="8" rounded
                        color="#0f172a" background-color="#f4f7fb" />

                    </div>
                    <div class="u-charges mb-4 fontWeight400 fontSize10">{{
                      $t('payment-providers_page.text.unumpay_charges')
                    }}:<span class="inline-flex" :class="[isRtl ? 'row-reverse' : '']"><span>{{
                        provider.transaction_obj.application_percentage }}</span><span>%</span></span>
                      <span> | </span>
                      <span class="inline-flex unumpay-price" :class="[isRtl ? 'row-reverse' : '']">
                        <span>{{ provider.transaction_obj.currency_symbol }}</span>
                        <span>{{ provider.transaction_obj.application_value }}</span></span>
                    </div>
                  </div>
                  <div class="provider-action-btn">
                    <div class="actions-btn">
                      <v-row>
                        <v-col cols="12" :md="12">
                          <v-btn outlined @click="goToConfigSetting(provider.transaction_obj.provider_name)" block
                            class="fontWeight400 fontSize13">
                            <img :class="[isRtl ? 'ml-2' : 'mr-2']"
                              src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_2_02e57ab4-e7df-47ae-bd26-2084c1548dee.svg?v=1756193753"
                              alt="search" style="width:20px; height:20px;">
                            {{ $t('payment-providers_page.text.configure') }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <div v-if="filteredProviders.length == 0 && !AllProviderLoading" class="empty-box pageWidth bgWhite">
              {{ $t('$vuetify.noDataText') }}
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab == 'configuration'" class="config-settings">
        <v-row v-if="saveDataLoading" class="mt-6 pageWidth">
          <v-col cols="12" md="6" v-for="n in 2" :key="n" class="config-left-col config-col">
            <div class="config-col-wrapper">
              <v-skeleton-loader type="image, text, text" height="300" />
              <v-skeleton-loader type="image, text, text" height="600" />
            </div>
          </v-col>
        </v-row>
        <div class="provider-component pageWidth mt-6 mb-15">
          <div v-for="(provider, index) in AllProviderList" :key="index">
            <div v-if="provider.transaction_obj.provider_name === 'baf'">
              <div v-if="selectedProvider == 'baf'">
                <AlfalahMPGS :BAFArrayData="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :currency_list="currency_list" :country_codes="country_codes"
                  :saveBafSettings="saveBafSettings" @show-snackbar="triggerSnackbar" :isRtl="isRtl"
                  @update:isRtl="isRtl = $event" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'abhipay'">
              <div v-if="selectedProvider == 'abhipay'">
                <AbhiPay :AbhiPayObj="provider" :AllProviderLoading="AllProviderLoading" :currency_list="currency_list"
                  :saveDataLoading="saveDataLoading" :saveAbhiPaySettings="saveAbhiPaySettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'apg'">
              <div v-if="selectedProvider == 'apg'">
                <AlfalahAPG :AlfalahAPGObj="provider" :AllProviderLoading="AllProviderLoading"
                  :currency_list="currency_list" :saveDataLoading="saveDataLoading" @show-snackbar="triggerSnackbar"
                  :transaction_types_list="transaction_types_list" :saveApgSettings="saveApgSettings" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'authorize.net'">
              <div v-if="selectedProvider == 'authorize.net'">
                <AuthorizeNet :AuthorizeNetObj="provider" :AllProviderLoading="AllProviderLoading"
                  :currency_list="currency_list" :saveDataLoading="saveDataLoading"
                  :transaction_types_list="transaction_types_list" :country_codes="country_codes"
                  :saveAuthorizeSettings="saveAuthorizeSettings" @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'blinq'">
              <div v-if="selectedProvider == 'blinq'">
                <Blinq :BlinqObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveBlinqSettings="saveBlinqSettings" :saveDataLoading="saveDataLoading"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'bop'">
              <div v-if="selectedProvider == 'bop'">
                <Bop :BOPObj="provider" :AllProviderLoading="AllProviderLoading" :saveDataLoading="saveDataLoading"
                  :saveBopSettings="saveBopSettings" @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'ccavenue'">
              <div v-if="selectedProvider == 'ccavenue'">
                <Ccavenue :ccavenueObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :saveCCAvenueSettings="saveCCAvenueSettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'ccbill'">
              <div v-if="selectedProvider == 'ccbill'">
                <Ccbill :CcbillObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :saveCCBillSettings="saveCCBillSettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'checkout'">
              <div v-if="selectedProvider == 'checkout'">
                <CheckoutDotCom :CheckoutObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :saveCheckoutSettings="saveCheckoutSettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'citybank'">
              <div v-if="selectedProvider == 'citybank'">
                <Citybank :CitybankObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :saveCityBankSettings="saveCityBankSettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'easypaisa'">
              <div v-if="selectedProvider == 'easypaisa'">
                <EasyPaisa :EasyPaisaObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :saveEasyPaisaSettings="saveEasyPaisaSettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'flutterwave'">
              <div v-if="selectedProvider == 'flutterwave'">
                <FlutterWave :FlutterWaveObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :saveFlutterwaveSettings="saveFlutterwaveSettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'hbl'">
              <div v-if="selectedProvider == 'hbl'">
                <HBL :HBLObj="provider" :AllProviderLoading="AllProviderLoading" :saveDataLoading="saveDataLoading"
                  :currency_list="currency_list" :country_codes="country_codes" :saveHBLSettings="saveHBLSettings"
                  @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'hbl_hosted'">
              <div v-if="selectedProvider == 'hbl_hosted'">
                <HblHosted :HblHostedObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :currency_list="currency_list" :country_codes="country_codes"
                  :saveHBLHostedSettings="saveHBLHostedSettings" @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
            <div v-if="provider.transaction_obj.provider_name === 'hbl_unified_checkout'">
              <div v-if="selectedProvider == 'hbl_unified_checkout'">
                <HBLUnifiedCheckout :HBLUnifiedCheckoutObj="provider" :AllProviderLoading="AllProviderLoading"
                  :saveDataLoading="saveDataLoading" :allowed_payment_types_list="allowed_payment_types_list"
                  :allowed_card_networks_list="allowed_card_networks_list" :currency_list="currency_list"
                  :saveHBLUnifiedCheckoutSettings="saveHBLUnifiedCheckoutSettings" @show-snackbar="triggerSnackbar" :isRtl="isRtl" />
              </div>
            </div>
          </div>
          <div v-if="selectedProvider == '' || selectedProvider == null" class="mt-4 empty-box border ml-0 mr-0">
            <div class="cstm-main empty-provider">
              <p class="fontSize16 greyColor">{{ $t('payment-providers_page.text.select_provider') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <v-snackbar :class="{ 'rtl-rotate': isRtl }" v-model="snackbar" location="top right" :timeout="snackbar_timeout"
    :color="snackbar_status">
    {{ snackbar_text
      ? ($te('payment-providers_snackbar.' + snackbar_text)
        ? $t('payment-providers_snackbar.' + snackbar_text)
        : snackbar_text)
      : ''
    }}
  </v-snackbar>
</template>

<script>
import script from './PaymentServiceProviders.js'


export default {
  ...script
}
</script>

<style lang="scss" src="./PaymentServiceProviders.scss"></style>
