<template>
  <v-app>
    <v-layout :class="{ rtl: isRtl, ltr: !isRtl }">
      <v-btn class="drawer-close-btn" color="black" :icon="getChevronIcon" variant="text" @click.stop="toggleRail"
        :class="[rail ? 'Notactive' : 'active', isRtl ? 'rtl' : 'ltr']" />
      <v-navigation-drawer :class="{ rtl: isRtl, ltr: !isRtl }" :location="isRtl ? 'right' : 'left'" class="nav-drawer"
        v-model="drawer" :rail="rail" permanent @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
        @click="rail = false">

         <Nav :isRtl="isRtl" />

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
import appScript from './index.js'

export default {
  ...appScript
}
</script>

<style lang="scss" src="./index.scss"></style>

