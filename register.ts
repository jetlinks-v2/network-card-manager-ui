import { defineAsyncComponent, type Component } from 'vue'
import i18n from '@jetlinks-web-core/locales'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'
import type { DeviceDetailTabProvider } from '@device-manager-ui/deviceDetailProvider'

/** 通过设备模块公开的组件复用旧版物联卡详情，避免物联卡模块引用其私有目录。 */
const IotCardDetail = defineAsyncComponent(async () => {
  const component = moduleRegistry.getResourceItem<Component>('device-manager-ui', 'components', 'IotCardDetail')
  if (!component) throw new Error('IotCardDetail component is unavailable')
  return component
})

export default {
  // 物联卡模块加载后自行注册页签；卸载模块时注册表会同步移除，宿主无需维护模块名单。
  deviceDetailTabs: {
    iotCard: {
      key: 'iot-card',
      label: () => i18n.global.t('Detail.index.957187-17'),
      icon: 'CreditCardOutlined',
      menuCode: 'iot-card/CardManagement',
      order: 20,
      matches: () => true,
      component: IotCardDetail,
      props: device => ({ type: 'device', deviceId: device.id }),
    } satisfies DeviceDetailTabProvider,
  },
  moduleId: 'network-card-manager-ui',
}
