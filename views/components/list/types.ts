export interface QueryTerm {
  column?: string
  termType?: string
  value?: unknown
  type?: string
  terms?: QueryTerm[]
}

export interface ListQuery {
  terms?: QueryTerm[]
  pageIndex?: number
  pageSize?: number
  sorts?: { name: string; order: string }[]
}

export interface EnumValue { value: string; text: string }
export interface ListTableRef { reload: () => void }
export type Translate = (key: string) => string

export interface RowAction {
  key: string
  text: string
  icon?: string
  disabled?: boolean
  tooltip?: { title: string }
  popConfirm?: {
    title: string
    okText?: string
    cancelText?: string
    onConfirm: () => unknown
  }
  onClick?: () => void
}

export interface PlatformRow {
  id: string
  name: string
  operatorName: string
  state?: EnumValue
  explain?: string
  config?: Record<string, unknown>
}
