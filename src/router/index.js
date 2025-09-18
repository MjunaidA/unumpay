import { createRouter, createWebHistory } from "vue-router"
import Welcome from "@/views/Welcome/index.vue"
import Dashboard from "@/views/Dashboard/index.vue"
import Transactions from "@/views/Transactions/index.vue"

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    meta: { titleKey: "welcomeTopBarTitle", descKey: "welcome_desc" }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { titleKey: "welcomeTopBarTitle", descKey: "welcome_desc" }
  },
  {
    path: "/transactions",
    name: "Transaction",
    component: Transactions,
    meta: { titleKey: "transactionTopBarTitle", descKey: "transaction_desc" }
  },
]

const router = createRouter({
  history: createWebHistory('/frontend'),
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes,
})

export default router
