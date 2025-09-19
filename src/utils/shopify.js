// src/utils/shopify.js
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge-utils";

export async function getShopifySessionToken(apiKey, host) {
  const app = createApp({
    apiKey: apiKey,
    host: host,
    forceRedirect: true,
  });

  const token = await getSessionToken(app);
  return token;
}
