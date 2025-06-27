export const tabs = {
  DataOverview: defineAsyncComponent(() => import('./DataOverview/index.vue')),
  CardList: defineAsyncComponent(() => import('./CardList/index.vue')),
};
