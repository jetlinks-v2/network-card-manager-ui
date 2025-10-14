import i18n from "@/locales";
import registerSetting from './register'
import { name } from './package.json'
import { moduleRegistry } from '@/utils/module-registry'

const routerModules = import.meta.glob('./views/**/index.vue')
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
        },
        // {
        //   code: 'Record',
        //   url: '/Record/:id',
        //   name: i18n.global.t('network-card-manager-ui.index.390590-1'),
        //   component: () => import('./views/CardManagement/SyncRecord/index.vue')
        // }
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
    },
    [`${MODULE_CODE}/TrafficPoolManagement`]: {
      children: [
        {
          code: 'Detail',
          url: '/detail/:id',
          name: i18n.global.t('network-card-manager-ui.index.390590-0'),
          component: () => import('./views/TrafficPoolManagement/Detail/index.vue')
        },
        // {
        //   code: 'Record',
        //   url: '/Record/:id',
        //   name: i18n.global.t('network-card-manager-ui.index.390590-1'),
        //   component: () => import('./views/TrafficPoolManagement/SyncRecord/index.vue')
        // }
      ]
    },
  }
}

const register = () => {
  moduleRegistry.register(name, registerSetting)
}

export default {
  getAsyncRoutesMap,
  getExtraRoutesMap,
  register
}
