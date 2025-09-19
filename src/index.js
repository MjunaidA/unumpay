import TopBar from "@/components/ToBar.vue"
import Nav from "./components/Nav.vue"
export default {
  name: 'App',
  components: { TopBar,Nav },
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