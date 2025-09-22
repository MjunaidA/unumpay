import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/views/Welcome/index.vue";
import Dashboard from "@/views/Dashboard/index.vue";
import Transactions from "@/views/Transactions/index.vue";
import AdvancePayments from "@/views/AdvancePayments/index.vue";
import ReconciliationReport from "@/views/ReconciliationReport/index.vue";
import PaymentServiceProviders from "@/views/PaymentServiceProviders/index.vue";
import Settings from "@/views/Settings/index.vue";
import Error from "@/views/Error/index.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    meta: { titleKey: "welcomeTopBarTitle", descKey: "welcome_desc" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { titleKey: "welcomeTopBarTitle", descKey: "welcome_desc" },
  },
  {
    path: "/transactions",
    name: "Transaction",
    component: Transactions,
    meta: { titleKey: "transactionTopBarTitle", descKey: "transaction_desc" },
  },
  {
    path: "/advance-payment",
    name: "AdvancePayments",
    component: AdvancePayments,
    meta: {
      titleKey: "advancePaymentTopBarTitle",
      descKey: "advancePayment_desc",
    },
  },
  {
    path: "/reconciliation-report",
    name: "ReconciliationReport",
    component: ReconciliationReport,
    meta: {
      titleKey: "ReconciliationReportTopBarTitle",
      descKey: "ReconciliationReport_desc",
    },
  },
  {
    path: "/payment-service-providers",
    name: "PaymentServiceProviders",
    component: PaymentServiceProviders,
    meta: {
      titleKey: "PaymentServiceProvidersTopBarTitle",
      descKey: "PaymentServiceProviders_desc",
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      titleKey: "SettingsTopBarTitle",
      descKey: "Settings_desc",
    },
  },
  {
    path: "/error",
    name: "Error",
    component: Error,
    meta: {
      titleKey: "ErrorTopBarTitle",
      descKey: "Error_desc",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      titleKey: "NotFoundTitle",
      descKey: "NotFound_desc",
    },
  },
];

const router = createRouter({
  history: createWebHistory("/frontend"),
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes,
});

export default router;
