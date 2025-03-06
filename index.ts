const routerModules = import.meta.glob('./views/**/index.vue')
import i18n from "@/locales";

const MODULE_CODE = 'iot-card'
const getAsyncRoutesMap = () => {
  const modules = {}
  Object.keys(routerModules).forEach((item) => {
    const code = item.replace('./views/', '').replace('/index.vue', '')
    const key = `${MODULE_CODE}/${code}`
    modules[key] = routerModules[item]
  })
  return modules
}

const getExtraRoutesMap = () => {
  return {
    [`${MODULE_CODE}/CardManagement`]: {
      children: [
        {
          code: 'Detail',
          url: '/detail/:id',
          name: i18n.global.t('network-card-manager-ui.index.390590-0'),
          component: () => import('./views/CardManagement/Detail/index.vue')
        }
      ]
    },
    [`${MODULE_CODE}/Platform`]: {
      children: [
        {
          code: 'Detail',
          url: '/detail/:id',
          name: i18n.global.t('network-card-manager-ui.index.390590-0'),
          component: () => import('./views/Platform/Detail/index.vue')
        }
      ]
    }
  }
}

export default {
  getAsyncRoutesMap,
  getExtraRoutesMap
}
