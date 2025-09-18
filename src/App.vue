<template>
  <v-app>
    <v-layout :class="{ rtl: isRtl, ltr: !isRtl }">
      <v-btn class="drawer-close-btn" color="black" :icon="getChevronIcon"
        variant="text" @click.stop="toggleRail" :class="[rail ? 'Notactive' : 'active', isRtl ? 'rtl' : 'ltr']" />
      <v-navigation-drawer :class="{ rtl: isRtl, ltr: !isRtl }" :location="isRtl ? 'right' : 'left'" class="nav-drawer"
        v-model="drawer" :rail="rail" permanent @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
        @click="rail = false">
        <v-list>
          <v-list-item class="pl-3">
            <template #prepend>
              <v-avatar size="32" tile class="border-radius">
                <img
                  src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/beee849f3ea4cd9f8381b45ce416150df533d2f9.png?v=1751896569"
                  alt="Logo" />
              </v-avatar>
            </template>
            <div>
              <v-list-item-title>{{ $t('appName') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t('tagline') }}</v-list-item-subtitle>
            </div>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list density="compact" nav>
          <!-- Dashboard link -->

          <v-list-item :to="{ path: '/dashboard' }" :exact="true" value="Dashboard" link>
            <template #prepend>
              <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Home.svg?v=1758191078" alt="Dashboard Icon"
                style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title>{{ $t('FirstNavTitle') }}</v-list-item-title>
          </v-list-item>

          <!-- Transaction link -->

          <v-list-item :to="{ path: '/transactions' }" :exact="true" value="Transactions" link>
            <template #prepend>
              <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Credit_card.svg?v=1758191423"
                alt="Transaction Icon" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title>{{ $t('SecondNavTitle') }}</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-navigation-drawer>
      <v-main>
        <TopBar :title="pageTitle" :description="pageDesc" :languages="languages" :currentLang="currentLang"
          :changeLanguage="changeLanguage" :isRtl="isRtl" />
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import TopBar from "@/components/ToBar.vue"
export default {
  name: 'App',
  components: { TopBar },
  data() {
    return {
      drawer: true,
      rail: true,
      hoverEnabled: true,
      isRtl: false,
      languages: [
        { code: 'en', displayCode: 'En', label: 'English', title: "English", flag: 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Country.png?v=1758176774' },
        { code: 'fr', displayCode: 'Fr', label: 'French', title: "Français", flag: 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/France.png?v=1758176745' },
        { code: 'ar', displayCode: 'Ar', label: 'Arabic', title: "العربية", flag: 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Saudi_Arabia.png?v=1758176790' },
      ],
      currentLang: { code: 'en', displayCode: 'En', label: 'English', flag: 'https://flagcdn.com/16x12/gb.png' },
    }
  },
  computed: {
    pageTitle() {
      return this.$route.meta.titleKey ? this.$t(this.$route.meta.titleKey) : ''
    },
    pageDesc() {
      return this.$route.meta.descKey ? this.$t(this.$route.meta.descKey) : ''
    },
    getChevronIcon() {
      if (this.isRtl) {
        return this.rail ? 'mdi-chevron-left' : 'mdi-chevron-right';
      } else {
        return this.rail ? 'mdi-chevron-right' : 'mdi-chevron-left';
      }
    }
  },
  mounted() {
    const savedLangCode = localStorage.getItem('lang')
    if (savedLangCode) {
      const foundLang = this.languages.find(l => l.code === savedLangCode)
      if (foundLang) {
        this.currentLang = foundLang
        this.$i18n.locale = foundLang.code
        this.isRtl = foundLang.code === 'ar'
        document.documentElement.dir = this.isRtl ? 'rtl' : 'ltr'
      }
    }
  },
  methods: {
    handleMouseEnter(e) {
      if (!this.hoverEnabled) return;
      if (e.target.closest(".drawer-close-btn") || e.relatedTarget?.closest(".drawer-close-btn")) return;
      this.rail = false;
    },
    handleMouseLeave(e) {
      if (!this.hoverEnabled) return;
      if (e.target.closest(".drawer-close-btn") || e.relatedTarget?.closest(".drawer-close-btn")) return;
      this.rail = true;
    },
    toggleRail() {
      if (this.rail) {
        this.rail = false;
        this.hoverEnabled = false;
      } else {
        this.rail = true;
        setTimeout(() => {
          this.hoverEnabled = true;
        }, 300);
      }
    },
    changeLanguage(lang) {
      this.currentLang = lang
      this.$i18n.locale = lang.code
      localStorage.setItem('lang', lang.code)
      this.isRtl = lang.code === 'ar'
      document.documentElement.dir = this.isRtl ? 'rtl' : 'ltr'

    }

  }
}
</script>

<style>
img {
  width: 100%;
  height: 100%;
}

.border-radius {
  border-radius: 8px !important;
}

.nav-drawer .v-avatar img {
  border-radius: 8px !important;
}

.nav-drawer {
  position: fixed !important;
  background: #f1f0f0 !important;
  border: 1px solid #E5E5E5 !important;
}

.drawer-close-btn {
  position: fixed !important;
  box-shadow: 2px 2px 8px 0px #0000001A;
  width: 28px !important;
  height: 28px !important;
  background: #fff !important;
  top: 15px;
  z-index: 999;
  border: 1px solid #d9d9d961;
  transition-duration: 0.3s !important;
  transition-property: left;
  transition-timing-function:
    cubic-bezier(0.4, 0, 0.2, 1);
}

.rtl.nav-drawer {
  direction: rtl;
}

.drawer-close-btn.ltr.Notactive {
  left: 43px;
}

.drawer-close-btn.ltr.active {
  left: 241px;
}

/* RTL */
.drawer-close-btn.rtl.Notactive {
  right: 43px;
}

.drawer-close-btn.rtl.active {
  right: 241px;
}

.nav-drawer .v-list-item-title {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
}

.nav-drawer .v-list-item-subtitle {
  font-weight: 550;
  font-size: 12px;
  color: #666666;
}

.relative {
  position: relative;
}

.fontWeight700 {
  font-weight: 700;
}

.fontWeight600 {
  font-weight: 600;
}

.fontWeight500 {
  font-weight: 500;
}

.fontWeight400 {
  font-weight: 400;
}

.fontSize16 {
  font-size: 16px;
}

.fontSize14 {
  font-size: 14px;
}

.fontSize12 {
  font-size: 12px;
}

.capatilize {
  text-transform: capitalize;
}

body::-webkit-scrollbar,
body *::-webkit-scrollbar {
  width: 0px;
  border-radius: 0;
}
</style>
