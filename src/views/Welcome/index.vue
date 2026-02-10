<template>
  <div class="welcome-container border-radius bgWhite relative">
    <div class="welcome-wrapper">
      <div class="welcome-img-container mb-4">
        <v-img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Frame.svg?v=1758261087" alt="Frame Icon"
          width="100%" height="100%" contain></v-img>
      </div>
      <h1 class="mb-3 fontSize36 fontWeight700">{{ $t('welcomePageTitle') }}</h1>
      <span class="fontSize16 fontWeight700">{{ $t('welcomePageCaption') }}</span>
      <p class="fontSize16 fontWeight400">{{ $t('welcomePageDesc') }}</p>
      <router-link to="/payment-service-providers" exact-active-class="isActivated">
        <button class="border-radius fontSize14 mt-4 px-4 py-2 rounded get-started-btn">{{ $t('welcomePageButtonTitle')
        }}</button>
      </router-link>
    </div>
  </div>
</template>


<style scoped>
.welcome-container {
  width: 98%;
  margin: 1.5rem auto;
}

.welcome-img-container {
  display: inline-flex;
}

.welcome-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  h1 {
    color: #6900CD;
  }

  span,
  p {
    color: #666666;
  }

  .get-started-btn {
    background: #374151;
    color: white;
  }
}

@media screen and (max-width:767px) {
  .welcome-wrapper {
    width: 100%;
  }

  .welcome-container {
    min-height: 100vh;
  }

  .welcome-img-container {
    width: 100%;
  }
}

@media screen and (min-width:768px) {
  .welcome-img-container {
    width: 30rem;
  }

  .welcome-container {
    min-height: 85vh;
  }
}
</style>


<script>
export default {
  name: "Welcome",
  components: {}
}
</script>