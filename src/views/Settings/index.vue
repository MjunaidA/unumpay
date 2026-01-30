<template>
  <div class="tab-container">
    <div class="tab-wrapper">
      <v-row class="d-flex mb-4 tab-parent pageWidth bgWhite border-radius border mt-4">
        <v-col>
          <v-btn class="border-radius capatilize fontSize12 fontWeight500"
            :class="activeTab === 'contact' ? 'tab-active' : 'tab-inactive'" :disabled="contactLoading"
            @click="activeTab = 'contact'; getContactForm()">
            {{ $t('setting_page.text.contact_detail') }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn class="border-radius capatilize fontSize12 fontWeight500"
            :class="activeTab === 'report' ? 'tab-active' : 'tab-inactive'"
            @click="activeTab = 'report'; getRecoReportSettings()">
            {{ $t('setting_page.text.reconciliation_report_settings') }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn class="border-radius capatilize fontSize12 fontWeight500"
            :class="activeTab === 'other' ? 'tab-active' : 'tab-inactive'"
            @click="activeTab = 'other'; getAdvanceSetting()">
            {{ $t('setting_page.text.advanced_setting') }}
          </v-btn>
        </v-col>
      </v-row>
      <div class="content-container pageWidth border-radius bgWhite mt-4 pa-4">
        <div class="content-wrapper">
          <div v-if="activeTab === 'contact'">
            <ContactForm :save-contact-form="saveContactForm" :get-contact-form="getContactForm" :NameField="fullName"
              :EmailField="email" :phoneField="phone" :contactField="contactMethod" :jobField="jobTitle"
              @show-snackbar="triggerSnackbar" :field_loading="field_loading" :contactLoading="contactLoading" />
          </div>
          <div v-else-if="activeTab === 'report'">
            <div v-if="recReportSettingsLoading">
              <div v-for="n in 3" :key="n">
                <v-skeleton-loader type="text" class="inline-skeleton" width="100%" height="120px" />
              </div>
            </div>
            <ReportSettings :isRtl="isRtl" :recReportSettings="recReportSettings" :recReportSettingsLoading="recReportSettingsLoading"
              @show-snackbar="triggerSnackbar" :downloadGuide="downloadGuide" :saveReconcilationForm="saveReconcilationForm" />
          </div>
          <div v-else-if="activeTab === 'other'"></div>
        </div>
      </div>
    </div>

    <v-snackbar :class="{ 'rtl-rotate': isRtl }" v-model="snackbar" location="top right" :timeout="snackbar_timeout"
      :color="snackbar_status">
      {{ snackbar_text
        ? ($te('setting_page.snackbar.' + snackbar_text)
          ? $t('setting_page.snackbar.' + snackbar_text)
          : snackbar_text)
        : ''
      }}
    </v-snackbar>
  </div>
</template>




<script>
import script from './Settings.js'

export default {
  ...script
}
</script>

<style lang="scss" src="./Settings.scss"></style>
