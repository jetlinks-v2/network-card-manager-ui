import { request } from '@jetlinks-web/core'


export const query = (data?: Record<string, any>) => request.post('/network/card/pool/query/_detail', data)


export const queryDetailById = (poolId: string) => request.get(`/network/card/pool/${poolId}/_detail`)

export const update = (poolId: string, data: any) => request.post(`/network/card/pool/${poolId}/_update`, data)

// 流量池同步
export const syncTrafficPool = (poolId: string, data: any) => request.post(`/network/card/pool/${poolId}/flow/_sync`, data)

// 状态数量统计查询
export const queryStatusNumber = (data: any) => request.post(`/network/card/status/number/_query`, data)

// 同步记录查询
export const querySyncLog = (data: any) => request.post(`/network/card/pool/sync/_log`, data)

// 批量绑定设备
export const batchBindDevice = (data: any) => request.post(`/network/card/batch/device/_bind`, data)

/**
 * 不分页查询设备
 * @param data
 * @returns
 */
export const queryDeviceNoPagingPost = (data?: Record<string, any>) => request.post('/device-instance/_query/no-paging?paging=false', data)

export const queryDevice = (data?: Record<string, any>) => request.post('/device-instance/_query', data)

export const dashboard = (data:Record<string,any[]>)=> request.post('/dashboard/_multi',data);
    export const queryAlarmCount = (targetId: string, data:Record<string,any[]>)=> request.post(`/alarm/history/_count?targetType=networkCardPool${targetId ? `&targetId=${targetId}` : ''}`,data);


