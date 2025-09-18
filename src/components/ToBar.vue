<template>
  <div class="top-bar py-3 px-6 bg-white d-flex justify-space-between align-center"
  :class="{ 'flex-row-reverse': isRtl }"
  >
    <div>
      <h1 class="h1 capatilize fontWeight600 fontSize16"
      :class="{ 'text-right': isRtl, 'text-left': !isRtl }"
      >{{ title }}</h1>
      <p class="desc mb-0 fontSize12"
      :class="{ 'text-right': isRtl, 'text-left': !isRtl }"
      >{{ description }}</p>
    </div>
    <div>
      <div class="language-selector">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn v-bind="props" class="lang-selected">
              <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Globe.svg?v=1758191119"
                alt="world icon" />
              <span class="lang-code fontSize16 fontWeight600 ">{{ currentLang.displayCode }}</span>
            </v-btn>
          </template>

          <v-list class="lang-list pt-0 pb-0">
            <v-list-item class="pt-2 pb-2" v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang)">
              <div class="flag-img-container">
                <img :src="lang.flag" alt="flag" />
              </div>
              <v-list-item-title class="d-flex flex-column">
                <strong class="lang-title fontWeight700 fontSize14">{{ lang.title }}</strong>
                <label class="lang-label fontWeight600 fontSize14">{{ lang.label }}</label>
              </v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopBar",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isRtl: {
      type: Boolean,
      default: false
    },
    languages: Array,
    currentLang: Object,
    changeLanguage: Function
  },
};
</script>

<style>
.top-bar {
  border-bottom: 0.5px solid #E5E5E5;
}

.language-selector {
  min-width: 138px;
  border-radius: 8px;
  display: inline-flex;
  justify-content: center;
}

.flag-img-container img {
  width: 24px;
  height: 16px;
}

.v-list-item__content {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.flag-img-container {
  width: 24px;
  height: 16px;
}

.lang-selected {
  box-shadow: none;
}

.language-selector {
  .v-btn {
    width: 100%;
  }

  .v-btn--elevated:hover,
  .v-btn--elevated:focus,
  .v-btn--variant-elevated {
    box-shadow: none;
  }

  .v-btn__overlay {
    opacity: 0 !important;
  }

  .v-btn__content {
    gap: 8px;
  }
}

.lang-code {
  color: #666666;
}

.lang-list {
  border: 1px solid #EBEBEB;

  .v-list-item {
    border-bottom: 1px solid #EBEBEB;
  }
}
</style>
