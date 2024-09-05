import { request } from '@jetlinks-web/core'

/**
 * 分页查询操作记录列表
 * @param data
 */
export const queryList = (data: any) =>
  request.post(`/network/card/stateOperate/_log`, data)
