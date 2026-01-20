export function toggleSelectAll(selectedArray, allItems) {
  if (selectedArray.length === allItems.length) {
    return [];
  } else {
    return [...allItems];
  }
}


export function englishOnlyRule(value, t) {
  if (!value) return true;

  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

  return !arabicRegex.test(value)
    || t('$vuetify.only_english_allowed');
}
