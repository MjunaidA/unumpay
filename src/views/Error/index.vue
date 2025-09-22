<template>
    <div class="error-container border-radius bgWhite relative">
        <div class="error-wrapper">
            <div class="error-img-container mb-4">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" aria-label="Session timeout clock">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                    <path d="M18 2l2 2" />
                </svg>
            </div>
            <p class="fontSize18 fontWeight700">{{ $t('errorPageCaption') }}</p>
            <h1 class="mb-3 fontSize18 fontWeight700">{{ $t('errorPageTitle') }}</h1>
            <p class="fontSize18 fontWeight400">{{ $t('errorPageDesc') }}</p>
        </div>
    </div>
</template>


<style scoped>
.error-container {
    min-height: 85vh;
    width: 98%;
    margin: 1.5rem auto;
}

.error-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    h1,p {
        color: red;
        font-size: 18px;
    }
}
</style>


<script>
export default {
    name: "Error",
    components: {}
}
</script>