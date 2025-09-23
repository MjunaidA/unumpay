<template>
    <v-list class="nav-head">
        <v-list-item class="pl-3">
            <template #prepend>
                <v-avatar size="32" tile class="border-radius">
                    <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/beee849f3ea4cd9f8381b45ce416150df533d2f9.png?v=1751896569"
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

    <v-list density="compact" nav class="mt-4">
        <!-- Dashboard link -->

        <v-list-item class="mb-2" :to="{ path: '/dashboard' }"  value="Dashboard" link >
            <template #prepend>
                <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                   :src="$route.path === '/dashboard' 
                    ? 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_2_562cad63-6b27-48d4-9c37-faa1ec5806b4.svg?v=1758204786' 
                    : 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Home.svg?v=1758204859'"
                    alt="Dashboard Icon" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title class="fontWeight500 fontSize14 capatilize color535D6D">{{ $t('FirstNavTitle') }}</v-list-item-title>
        </v-list-item>

        <!-- Transaction link -->

        <v-list-item class="mb-2" :to="{ path: '/transactions' }"  value="Transactions" link >
            <template #prepend>
                <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                    :src="$route.path === '/transactions' 
                    ? 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Credit_card_1.svg?v=1758204989' 
                    : 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Credit_card.svg?v=1758191423'"
                    alt="Transaction Icon" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title class="fontWeight500 fontSize14 capatilize color535D6D">{{ $t('SecondNavTitle') }}</v-list-item-title>
        </v-list-item>

        <!-- Advance payment -->

        <v-list-item class="mb-2" :to="{ path: '/advance-payment' }"  value="Advance Payment" link >
            <template #prepend>
                <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                     :src="$route.path === '/advance-payment' 
                    ? 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Dollar.svg?v=1758205105' 
                    : 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_570dbd94-124c-473f-bebb-832505e539d5.svg?v=1758197467'"
                    alt="Advance Payment" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title class="fontWeight500 fontSize14 capatilize color535D6D">{{ $t('ThirdNavTitle') }}</v-list-item-title>
        </v-list-item>

        <!-- Reconciliation Report -->

        <v-list-item class="mb-2" :to="{ path: '/reconciliation-report' }"  value="Reconciliation Report"
            link >
            <template #prepend>
                <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                     :src="$route.path === '/reconciliation-report' 
                    ? 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Report_1.svg?v=1758205236' 
                    : 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Report.svg?v=1758197823'"
                    alt="Reconciliation Report" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title class="fontWeight500 fontSize14 capatilize color535D6D">{{ $t('FourthNavTitle') }}</v-list-item-title>
        </v-list-item>

        <!-- Payment Service Providers -->

        <v-list-item class="mb-2" :to="{ path: '/payment-service-providers' }" 
            value="Payment Service Providers" link >
            <template #prepend>
                <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                    :src="$route.path === '/payment-service-providers' 
                    ? 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_3_8630dbc2-e3e5-497f-ba1e-7c4b2a331e2d.svg?v=1758205346' 
                    : 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Group_1_5318c694-e1c4-45f8-b345-344e831a9301.svg?v=1758198905'"
                    alt="Payment Service Providers" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title class="fontWeight500 fontSize14 capatilize color535D6D">{{ $t('FifthNavTitle') }}</v-list-item-title>
        </v-list-item>

        <!-- settings -->

        <v-list-item class="mb-2" :to="{ path: '/settings' }"  value="Settings" link >
            <template #prepend>
                <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                     :src="$route.path === '/settings' 
                    ? 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Settings_1.svg?v=1758205345' 
                    : 'https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Settings.svg?v=1758200343'"
                    alt="Payment Service Providers" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title class="fontWeight500 fontSize14 capatilize color535D6D">{{ $t('SixthNavTitle') }}</v-list-item-title>
        </v-list-item>

    </v-list>

    <v-list class="nav-email" nav>
        <!-- Email -->
        <v-divider class="mb-3"></v-divider>
        <v-list-item class="mb-2" >
            <template #prepend>
                <img :class="[isRtl ? 'ml-5' : 'mr-5']"
                    src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Email.svg?v=1758200855"
                    alt="Email" style="width: 20px; height: 20px;" />
            </template>
            <v-list-item-title class="fontWeight500 fontSize12 capatilize">unum.pay@devsinc.com</v-list-item-title>
        </v-list-item>
    </v-list>




</template>


<script>
export default {
    name: "Nav",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
    },
};
</script>