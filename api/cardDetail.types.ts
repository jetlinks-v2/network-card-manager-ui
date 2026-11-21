import type { EnumValue } from '../views/components/list/types'
import type { CardFlow } from '../views/CardManagement/flow'

export interface CardResponse<T> {
  status: number
  success: boolean
  result?: T
}

export interface CardDetail extends CardFlow {
  id: string
  name?: string
  iccId?: string
  operatorName?: string
  platformType?: EnumValue
  comboType?: EnumValue
  platformConfigName?: string
  platformConfigId?: string
  deviceId?: string
  deviceName?: string
  poolId?: string
  poolName?: string
  poolAlias?: string
  activationDate?: number | string
  updateTime?: number | string
  describe?: string
  cardState?: EnumValue
  cardStateType?: EnumValue
  syncCardStatus?: EnumValue
  errorMessage?: string
  flowError?: boolean
  flowErrorMessage?: string
}

export interface CardPosition {
  error: boolean
  longitude?: number
  latitude?: number
  location?: string
}

export interface DashboardQuery {
  dashboard: string
  object: string
  measurement: string
  dimension: string
  group?: string
  params: Record<string, unknown>
}
export interface FlowSample {
  timeString: string
  value: number | string | null
}
export interface FlowBucket {
  group?: string
  data?: FlowSample
}
