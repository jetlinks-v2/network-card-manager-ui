import { iotCard } from '../assets/index'
import i18n from '@/locales/index'
const $t = i18n.global.t

// 平台类型
export const platformTypeList = [
  {
    label: $t('views.data.812529-0'),
    value: 'onelink',
    imgUrl: iotCard.onelink,
    imgSize: ['78px', '20px']
  },
  {
    label: $t('views.data.812529-1'),
    value: 'ctwing',
    imgUrl: iotCard.ctwingCmp,
    imgSize: ['52px', '25px']
  },
  {
    label: $t('views.data.812529-2'),
    value: 'unicom',
    imgUrl: iotCard.unicom,
    imgSize: ['56px', '41px']
  }
]

export const OperatorMap = {
  onelink: $t('views.data.812529-3'),
  ctwing: $t('views.data.812529-4'),
  unicom: $t('views.data.812529-5')
}

//运营商
export const OperatorList = [
  {
    label: $t('views.data.812529-3'),
    value: 'onelink'
  },
  {
    label: $t('views.data.812529-4'),
    value: 'ctwing'
  },
  {
    label: $t('views.data.812529-5'),
    value: 'unicom'
  }
]

// 类型
export const TypeList = [
  {
    label: $t('views.data.812529-6'),
    value: 'year'
  },
  {
    label: $t('views.data.812529-7'),
    value: 'season'
  },
  {
    label: $t('views.data.812529-8'),
    value: 'month'
  },
  {
    label: $t('views.data.812529-9'),
    value: 'other'
  }
]

// 支付方式
export const PaymentMethod = [
  {
    label: $t('views.data.812529-10'),
    value: 'ALIPAY_WAP'
  },
  {
    label: $t('views.data.812529-11'),
    value: 'ALIPAY_WEB'
  },
  {
    label: $t('views.data.812529-12'),
    value: 'WEIXIN_JSAPI'
  },
  {
    label: $t('views.data.812529-13'),
    value: 'WEIXIN_NATIVE'
  }
]
