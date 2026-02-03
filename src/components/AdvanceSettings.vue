<template>
    <div class="advance-setting-form-container">
        <div class="advance-setting-reconciliation-form-wrapper">
            <div class="advance-setting-head cstm-head pb-3 d-flex justify-space-between align-center">
                <h1 class="cstm-heaing fontWeight600 fontSize20">{{ $t("setting_page.text.advance_settings") }}</h1>
                <v-btn class="advance-setting-save save-btn capatilize border-radius fontSize14 fontWeight500"
                    @click="handleSave()" :disabled="advanceSettingsLoading">{{ $t("$vuetify.save") }}</v-btn>
            </div>

            <div class="advance-setting-body" v-if="!advanceSettingsLoading">
                <div class="advance-setting-body-wrapper">
                    <div class="message-container">
                        <div class="msg-txt d-flex justify-space-between mt-4">
                            <p class="fontSize13 fontWeight400 mediumgreyColor mb-4">{{ $t("setting_page.text.msg") }}
                            </p>
                            <v-tooltip bottom content-class="custom-tooltip">
                                <template #activator="{ props }">
                                    <v-btn density="comfortable" v-bind="props" icon variant="plain">
                                        <v-icon color="#666666">mdi-information-outline</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t("setting_page.text.tool_tip_text") }}</span>
                            </v-tooltip>

                        </div>
                        <div class="msg-field">
                            <v-textarea class="border-radius fontSize12" row="2" variant="outlined"
                                v-model="localadvanceSettings.payment_provider_message"
                                :placeholder="$t('setting_page.text.textarea_placeholder')"
                                :rules="[v => englishRule(v, $t)]"></v-textarea>
                        </div>
                        <div class="round-off-field">
                            <div class="d-flex justify-space-between align-center">
                                <h4 class="head-h4 fontWeight700 fontSize14">{{ $t("setting_page.text.round_off_amount")
                                }}</h4>
                                <v-switch hide-details v-model="localadvanceSettings.is_round_off_amount" inset
                                    :true-value="true" class="custom-switch" color="#000" :ripple="false"
                                    :false-value="false"></v-switch>
                            </div>
                            <div class="roundoff-note pa-2 border-radius border"
                                v-if="localadvanceSettings.is_round_off_amount == true">
                                <p class="d-flex gap05 ma-0 fontWeight300 fontSize12">
                                    <v-btn density="comfortable" color="#ff0000" icon variant="plain"
                                        style="opacity: 1;">
                                        <v-icon color="#ff0000">mdi-information-outline</v-icon>
                                    </v-btn>
                                    <span>{{ $t("setting_page.text.round_off_tooltip1") }}<br />
                                        {{ $t("setting_page.text.round_off_tooltip2") }}</span>
                                </p>
                            </div>
                            <div class="extra-charge">
                                <div class="d-flex justify-space-between align-center">
                                    <h4 class="head-h4 fontWeight700 fontSize14">{{ $t("setting_page.text.extra_amount")
                                    }}</h4>
                                    <v-switch v-model="localadvanceSettings.is_extra_charge" inset :true-value="true"
                                        class="custom-switch" color="#000000" :ripple="false"
                                        :false-value="false"></v-switch>
                                </div>
                                <v-card-text>
                                    <v-row v-if="localadvanceSettings.is_extra_charge == true"
                                        class="extra-amount-container">
                                        <v-col cols="12" md="6" class="pa-0 pr-2 column">
                                            <p class="ma-0 fontSize13 fontWeight400 mediumgreyColor mb-4 cstm-label">{{
                                                $t("setting_page.text.charge_type") }}</p>
                                            <v-select v-model="localadvanceSettings.charge_category"
                                                :items="charge_type_list"
                                                :placeholder="$t('setting_page.text.charge_type')" variant="outlined"
                                                density="comfortable" hide-details
                                                :append-inner-icon="show_charge_type ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                                v-model:menu="show_charge_type" />
                                        </v-col>
                                        <v-col cols="12" md="6" class="pa-0 column">
                                            <div v-if="localadvanceSettings.charge_category == 'Percentage'">
                                                <p
                                                    class="ma-0 fontSize13 fontWeight400 mediumgreyColor mb-4 cstm-label">
                                                    {{
                                                        $t("setting_page.text.fixed_percentage") }}%</p>
                                                <v-text-field density="comfortable" type="number" min=0 max=100
                                                    color="red darken-2"
                                                    :placeholder="$t('setting_page.text.fixed_percentage')"
                                                    v-model="localadvanceSettings.charge_value" required
                                                    variant="outlined" :rules="[
                                                        v => !localadvanceSettings.is_extra_charge || !!v || $t('setting_page.text.charge_value_required'),
                                                    ]"></v-text-field>
                                            </div>
                                            <div v-if="localadvanceSettings.charge_category == 'Fixed Amount'">
                                                <p class="ma-0 mb-4 cstm-label">{{ $t("setting_page.text.fixed_amount")
                                                    }}</p>
                                                <v-text-field type="number" density="comfortable" min=0
                                                    color="red darken-2"
                                                    :placeholder="$t('setting_page.text.fixed_amount')"
                                                    v-model="localadvanceSettings.charge_value" required
                                                    variant="outlined" :rules="[
                                                        v => !localadvanceSettings.is_extra_charge || !!v || $t('setting_page.text.charge_value_required')
                                                    ]"></v-text-field>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <div class="extraoff-note mb-4" v-if="localadvanceSettings.is_extra_charge == true">
                                    <div class="d-flex gap05 ma-0 pa-2 border-radius border">
                                        <v-btn density="comfortable" color="#ff0000" icon variant="plain"
                                            style="opacity: 1;">
                                            <v-icon color="#ff0000">mdi-information-outline</v-icon>
                                        </v-btn>
                                        <div>
                                            <p class="ma-0 fontWeight300 fontSize12" style="color:red;">{{
                                                $t("setting_page.text.round_off_tooltip3") }}</p>
                                            <p class="ma-0 fontWeight300 fontSize12" style="color: #3D81F6;"><strong>{{
                                                $t("setting_page.text.percentage_fee") }}:</strong>
                                                {{ $t("setting_page.text.round_off_tooltip4") }} </p>
                                            <p class="ma-0 fontWeight300 fontSize12" style="color: #3D81F6;"><strong>{{
                                                $t("setting_page.text.fixed_fee") }}:</strong>
                                                {{ $t("setting_page.text.round_off_tooltip5") }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="payment-provider-sorting mt-6">
                            <div class="payment-provider-wrapper">
                                <div class="payment-provider-head d-flex justify-space-between align-center">
                                    <div>
                                        <h4 class="head-h4 fontSize14 fontWeight700">{{
                                            $t("setting_page.text.payment_provider_sorting") }}</h4>
                                        <p class="ma-0 fontSize12 fontWeight400" style="color: #444444;">{{
                                            $t("setting_page.text.payment_provider_sorting_desc") }}</p>
                                    </div>
                                    <div>
                                        <v-btn @click="openProviderDialog"
                                            class="arrange-provider-btn fontSize12 fontWeight300 border-radius capatilize">
                                            <img :class="isRtl ? 'ml-2' : 'mr-2'"
                                                src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Sort.svg?v=1755762006"
                                                alt="sort" style="width:20px; height:20px;" />
                                            {{ $t("setting_page.text.arrange_providers") }}
                                        </v-btn>
                                    </div>
                                </div>
                                <div class="payment-provider-body">
                                    <v-list class="provider-grid">
                                        <v-list-item v-for="(provider, index) in selectedProviders" :key="index"
                                            class="provider-item">
                                            <div
                                                class="d-flex align-center justify-space-between provider-list-wrapper">
                                                <div class="cstm-img-container"><img :src="provider.logo" alt="logo"
                                                        width="40" height="40" />
                                                </div>
                                                <div class="fontSize14 fontWeight600">{{
                                                    $t(`payment_provider.${provider.name.toLowerCase().replace(/\s+/g,
                                                        '_')}`) }}</div>
                                            </div>
                                        </v-list-item>
                                    </v-list>

                                </div>
                            </div>
                        </div>
                        <div class="hide-payment-provider mt-6 mb-4">
                            <div>
                                <h4 class="head-h4 mb-4 fontSize14 fontWeight700">{{ $t("setting_page.text.hide_payment_provider") }}</h4>
                            </div>
                            <div class="provider-list-select">

                                <v-select v-model="hideProviders" :items="providers_list" dense hide-details
                                    item-title="name" item-value="name"
                                    :label="$t('setting_page.text.select_payment_service_provider')" multiple
                                    clearable variant="outlined"
                                    :append-inner-icon="show_provider_list ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    v-model:menu="show_provider_list">

                                    <template v-slot:selection></template>
                                </v-select>


                                <div class="mt-3 d-flex flex-wrap gap05 align-center">
                                    <v-chip v-for="(provider, index) in hideProviders" :key="index"
                                    >
                                        <div class="d-flex align-center gap05">
                                            <h5 class="fontSize14 fontWeight500">{{ $t(`payment_provider.${provider.toLowerCase().replace(/\s+/g, '_')}`) }}</h5>
                                            <v-icon class="cursorPointer" @click="removeProvider(provider)">mdi-close</v-icon>
                                        </div>
                                    </v-chip>

                                    <span v-if="hideProviders.length" class="ml-2 clear-btn cursorPointer fontSize12 fontWeight500"
                                        @click="hideProviders = []">
                                        {{ $t("$vuetify.clear_all") }}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div class="country-select mt-6">
                            <div>
                                <h4 class="head-h4 mb-4 fontSize14 fontWeight700">{{ $t("setting_page.text.select_country_code") }}</h4>
                            </div>
                            <v-select v-model="countrySelectedArray" :items="country_codes"
                                :placeholder="$t('setting_page.text.select_country_code')" multiple chips
                                variant="outlined" dense v-model:menu="show_country"
                                :append-inner-icon="show_country ? 'mdi-chevron-up' : 'mdi-chevron-down'">
                                <template v-slot:prepend-item>
                                    <v-list-item ripple @click="handleToggleSelectAll">
                                        <v-list-item-action>
                                            <v-icon>
                                                {{ selectAllIcon }}
                                            </v-icon>
                                        </v-list-item-action>
                                        <div>
                                            <v-list-item-title>
                                               {{ isAllSelected ? $t('payment-providers_page.text.deselect_all') : $t('payment-providers_page.text.select_all') }}
                                            </v-list-item-title>
                                        </div>
                                    </v-list-item>
                                    <v-divider class="mt-2"></v-divider>
                                </template>
                            </v-select>

                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-for="n in 5" :key="n">
                    <v-skeleton-loader type="text" class="inline-skeleton mt-4" width="100%" height="100px" />
                </div>
            </div>
            <!-- dialog box start -->
            <template>
                <div>
                    <v-dialog v-model="Providerdialog" max-width="800px" content-class="provider-dialog"
                        v-if="!providerListLoading">
                        <v-card>
                            <v-card-title
                                class="mb-2 d-flex align-center justify-space-between border-bottom ml-5 mr-5 pl-0 pr-0 pt-3 pb-3">
                                <h2 class="d-flex align-center gap05 fontSize14 fontWeight700">
                                    <img src="https://cdn.shopify.com/s/files/1/0612/1662/0768/files/Frame_2612_c93047f0-d2a3-4cc8-96fd-22298ac672de.svg?v=1755770682"
                                        alt="list" style="width:20px; height:20px; cursor: pointer;" />
                                    {{ $t("setting_page.text.provider_sorting_list") }}
                                </h2>
                                <div class="d-flex align-center gap05">
                                    <v-chip class="fontSize12 fontWeight700" size="small" dark color="#00527C">{{
                                        $t("setting_page.text.active_providers") }}</v-chip>
                                    <span @click="Providerdialog = false"
                                        class="cursor cstm-close fontSize14 cursorPointer"> <v-icon
                                            color="#000">mdi-close</v-icon></span>
                                </div>
                            </v-card-title>

                            <v-card-text>
                                <div class="d-flex justify-space-between provider-dialog-body">
                                    <div class="provider-list">
                                        <p class="ma-0 descr fontSize12 fontWeight500 mb-3">{{
                                            $t("setting_page.text.select_providers_desc") }}</p>
                                        <v-text-field :placeholder="$t('$vuetify.search')" density="compact"
                                            class="rounded-search" variant="outlined" v-model="search" hide-details
                                            dense></v-text-field>
                                        <v-list style="height: 300px; overflow-y: auto;"
                                            class="cstm-provider-list mt-2">
                                            <v-list-item v-for="(provider, index) in filteredProviders" :key="index"
                                                class="justify-space-between border justify-space-between border-radius mb-4">

                                                <div class="d-flex align-center justify-space-between ">
                                                    <v-list-item-action class="mr-4">
                                                        <v-checkbox color="#000" hide-details :value="provider.name"
                                                            v-model="tempCheckedProviders"
                                                            @update:modelValue="() => toggleProvider(provider)" />

                                                    </v-list-item-action>
                                                    <v-list-item-title class="fontSize14 fontWeight600">{{
                                                        $t(`payment_provider.${provider.name.toLowerCase().replace(/\s+/g,
                                                            '_')}`) }}</v-list-item-title>
                                                </div>


                                                <v-list-item-action class="cstm-action">
                                                    <img :src="provider.logo" alt="logo" width="100%" height="100%" />
                                                </v-list-item-action>
                                            </v-list-item>
                                            <div v-if="filteredProviders.length === 0"
                                                class="text-center pa-4 fontSize12 fontWeight400" style="color:#777;">
                                                {{ $t("setting_page.text.activate_provider_desc") }}
                                            </div>
                                        </v-list>

                                    </div>
                                    <div class="provider-sorting-list">
                                        <p class="ma-0 ml-4 descr fontSize12 fontWeight500  mb-3">{{
                                            $t("setting_page.text.organize_providers_desc") }}</p>
                                        <v-list style="height: 300px; overflow-y: auto;"
                                            class="cstm--selected-provider-list pl-4 pr-4">
                                            <v-list-item
                                                class="justify-space-between border justify-space-between border-radius mb-4"
                                                v-for="(provider, index) in tempSelectedProviders" :key="provider.name"
                                                draggable="true" @dragstart="startDrag($event, index)" @dragover.prevent
                                                @drop="onDrop($event, index)">

                                                <div class="d-flex align-center">
                                                    <v-list-item-title class="d-flex align-center">
                                                        <span class="drag-handle" :class="isRtl ? 'ml-2' : 'mr-2'"
                                                            style="cursor: grab;color:#777777">⠿</span>
                                                        <div class="fontSize14 fontWeight600">
                                                            {{
                                                                $t(`payment_provider.${provider.name.toLowerCase().replace(/\s+/g,
                                                                    '_')}`) }}
                                                            <p class="position-div ma-0 fontSize10 fontWeight500">{{
                                                                $t("setting_page.text.position") }} {{ index + 1 }}</p>
                                                        </div>
                                                    </v-list-item-title>
                                                </div>
                                                <v-list-item-action class="cstm-action mr-2">
                                                    <img :src="provider.logo" alt="logo" width="30" height="30" />
                                                </v-list-item-action>
                                            </v-list-item>
                                            <div v-if="tempSelectedProviders.length === 0"
                                                class="text-center pa-4 fontSize12 fontWeight400" style="color:#777;">
                                                {{ $t("setting_page.text.add_provider_desc") }}
                                            </div>
                                        </v-list>

                                    </div>
                                </div>
                            </v-card-text>

                            <v-card-actions class="d-flex pa-0 popup-actions pb-5">
                                <v-btn text class="popup-cancel" @click="Providerdialog = false">
                                    {{ $t("$vuetify.cancel") }}
                                </v-btn>

                                <v-btn class="popup-save" @click="saveProviderOrder">
                                    {{ $t("$vuetify.save_order") }}
                                </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-dialog>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { englishOnlyRule } from "@/utils/selectUtils.js";
import { toggleSelectAll } from "@/utils/selectUtils.js";

export default {
    name: "ContactForm",
    props: {
        isRtl: {
            type: Boolean,
            default: false
        },
        advanceSettings: Object,
        providers_list: Array,
        country_codes: Array,
        saveAdvanceSettingForm: Function,
        advanceSettingsLoading: {
            type: Boolean,
            default: false
        },
        providerListLoading: {
            type: Boolean,
            default: true,
        },
        charge_type_list: Array
    },
    data() {
        return {
            chargeTypeMenu: false,
            Providerdialog: false,
            search: "",
            selectedProviders: [],
            tempSelectedProviders: [],
            providerSortingArray: [],
            checkedProviders: [],
            tempCheckedProviders: [],
            hideProviders: [],
            countrySelectedArray: [],
            localadvanceSettings: { ...this.advanceSettings },
            show_charge_type: false,
            show_provider_list: false,
            show_country: false,
            formData: {
                is_extra_charge: this.advanceSettings?.is_extra_charge,
                charge_category: this.advanceSettings?.charge_category,
                charge_value: this.advanceSettings?.charge_value,
                provider_sorting: "",
                hide_payment_provider: "",
                selected_country_codes: "",
                is_round_off_amount: this.advanceSettings?.is_round_off_amount,
                payment_provider_message: this.advanceSettings?.payment_provider_message
            },
        };
    },

    watch: {
        advanceSettings: {
            handler(newVal) {
                this.localadvanceSettings = { ...newVal };
                this.initializeSelectedProviders();
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        filteredProviders() {
            if (!this.search) return this.providers_list;
            return this.providers_list.filter(p =>
                this.$t(`payment_provider.${p.name.toLowerCase().replace(/\s+/g, '_')}`)
                    .toLowerCase()
                    .includes(this.search.toLowerCase())
            );
        },

        isAllSelected() {
            return this.countrySelectedArray.length === this.country_codes.length;
        },
        isPartialSelected() {
            return (
                this.countrySelectedArray.length > 0 &&
                this.countrySelectedArray.length < this.country_codes.length
            );
        },
        selectAllIcon() {
            if (this.isAllSelected) return "mdi-checkbox-marked";
            if (this.isPartialSelected) return "mdi-minus-box";
            return "mdi-checkbox-blank-outline";
        }
    },
    mounted() {
        this.initializeSelectedProviders();
        console.log("advanceSettings")
    },
    methods: {
        selectChargeType(type) {
            this.formData.charge_category = type;
            this.chargeTypeMenu = false;
        },
        handleToggleSelectAll() {
            this.countrySelectedArray = toggleSelectAll(this.countrySelectedArray, this.country_codes);
        },
        removeProvider(provider) {
            this.hideProviders = this.hideProviders.filter(p => p !== provider);
        },
        initializeSelectedProviders() {
            if (this.localadvanceSettings?.provider_sorting) {
                const sortingArray = this.localadvanceSettings.provider_sorting.split(",").map(s => s.trim());
                this.selectedProviders = this.providers_list.filter(p =>
                    sortingArray.includes(p.name)
                );
            }
            if (this.localadvanceSettings?.hide_payment_provider) {
                const hideArray = this.localadvanceSettings.hide_payment_provider.split(",").map(s => s.trim());
                this.hideProviders = hideArray
            }
            if (this.localadvanceSettings?.selected_country_codes) {
                            console.log("run",this.localadvanceSettings.selected_country_codes)
                this.countrySelectedArray = this.localadvanceSettings.selected_country_codes.split(",").map(s => s.trim());
                console.log("countrySelectedArray", this.countrySelectedArray)
            }

        },
        englishRule(v) {
            return englishOnlyRule(v, this.$t);
        },
        openProviderDialog() {
            // Copy old selected data to temp
            this.tempSelectedProviders = JSON.parse(
                JSON.stringify(this.selectedProviders)
            );
            this.tempCheckedProviders = this.tempSelectedProviders.map((p) => p.name);
            this.Providerdialog = true;
        },
        toggleProvider(provider) {
            const isChecked = this.tempCheckedProviders.includes(provider.name);

            if (isChecked) {
                if (!this.tempSelectedProviders.some(p => p.name === provider.name)) {
                    this.tempSelectedProviders.push(provider);
                }
            } else {
                this.tempSelectedProviders = this.tempSelectedProviders.filter(
                    p => p.name !== provider.name
                );
            }
        },
        startDrag(event, index) {
            this.dragIndex = index;
        },
        onDrop(event, dropIndex) {
            const draggedItem = this.tempSelectedProviders[this.dragIndex];
            this.tempSelectedProviders.splice(this.dragIndex, 1);
            this.tempSelectedProviders.splice(dropIndex, 0, draggedItem);
            this.dragIndex = null;
        },

        //Save pe final list update
        saveProviderOrder() {
            this.selectedProviders = JSON.parse(
                JSON.stringify(this.tempSelectedProviders)
            );
            this.Providerdialog = false;
        },
        handleSave() {
            if (this.localadvanceSettings.is_extra_charge && !this.localadvanceSettings.charge_value) {
                this.localadvanceSettings.charge_value = 0;
            }
            this.localadvanceSettings.provider_sorting = this.selectedProviders.map(p => p.name).join(",");
            this.localadvanceSettings.hide_payment_provider = this.hideProviders.join(",");
            this.localadvanceSettings.selected_country_codes = this.countrySelectedArray.join(",");
            this.saveAdvanceSettingForm(this.localadvanceSettings)
            console.log("formData", this.localadvanceSettings)
        },
    }
};
</script>
