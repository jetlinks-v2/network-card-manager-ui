<!-- 物联卡-仪表盘 -->
<template>
  <j-page-container>
    <div class="card-dashboard-container">
      <a-card style="margin-bottom: 24px">
        <a-row :gutter="24">
          <a-col :span="24">
            <Guide :title="$t('Dashboard.index.537937-0')"/>
          </a-col>
          <a-col :span="6">
            <div class="data-statistics-item">
              <div class="flow-info" style="width: 100%">
                <div class="label">{{ $t('Dashboard.index.537937-1') }}</div>
                <a-tooltip placement="bottomLeft">
                  <template #title>
                    <span>{{ dayTotal }} M</span>
                  </template>
                  <div class="value">
                    {{ dayTotal }}
                    <span class="unit">M</span>
                  </div>
                </a-tooltip>
              </div>
              <LineChart color="#FBA500" :chartData="dayOptions"/>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="data-statistics-item">
              <div class="flow-info" style="width: 100%">
                <div class="label">{{ $t('Dashboard.index.537937-2') }}</div>
                <a-tooltip placement="bottomLeft">
                  <template #title>
                    <span>{{ monthTotal }} M</span>
                  </template>
                  <div class="value">
                    {{ monthTotal }}
                    <span class="unit">M</span>
                  </div>
                </a-tooltip>
              </div>
              <LineChart :chartData="monthOptions"/>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="data-statistics-item">
              <div class="flow-info" style="width: 100%">
                <div class="label">{{ $t('Dashboard.index.537937-3') }}</div>
                <a-tooltip placement="bottomLeft">
                  <template #title>
                    <span>{{ yearTotal }} M</span>
                  </template>
                  <div class="value">
                    {{ yearTotal }}
                    <span class="unit">M</span>
                  </div>
                </a-tooltip>
              </div>
              <LineChart color="#58E1D3" :chartData="yearOptions"/>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="data-statistics-item">
              <div class="flow-info" style="width: 100%">
                <div class="label">
                  {{ $t('Dashboard.index.537937-16') }}
                  <a-button type="link" @click="gotoAlarmLog">{{ $t('Dashboard.index.537937-17') }}</a-button>
                </div>
                <div class="value">
                  {{ alarmTotal }}
                </div>
              </div>
              <img :src="trafficImg"/>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-row :gutter="24">
        <a-col :span="16">
          <div class="static-card">
            <Guide :title="$t('Dashboard.index.537937-4')">
              <template #extra>
                <TimeSelect
                    key="flow-static"
                    :type="'week'"
                    :quickBtnList="quickBtnList"
                    @change="getEcharts"
                    :isShowTime="false"
                />
              </template>
            </Guide>
            <FullPage :fixed="false" v-if="flowData.length !== 0">
              <LineChart
                  :showX="true"
                  :showY="true"
                  style="min-height: 490px"
                  :chartData="flowData"
              />
            </FullPage>
            <div class="empty-body" v-else>
              <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="static-card">
            <Guide :title="$t('Dashboard.index.537937-5')">
              <template #extra>
                <TimeSelect
                    key="flow-top10"
                    :quickBtn="false"
                    :type="'week'"
                    @change="getTopRang"
                />
              </template>
            </Guide>
            <a-radio-group v-model:value="topType" button-style="solid" @change="onTypeChange">
              <a-radio-button value="single">
                {{ $t('Dashboard.index.537937-18') }}
              </a-radio-button>
              <a-radio-button value="pool">
                {{ $t('Dashboard.index.537937-19') }}
              </a-radio-button>
            </a-radio-group>
            <FullPage :fixed="false" v-if="topList.length !== 0">
              <div v-if="topList.length !== 0" class="rankingList">
                <div
                    v-for="(item, index) in topList"
                    :key="item.cardNum"
                    class="rankItem"
                >
                  <div class="number" :class="`number-item-${index + 1}`">
                    {{ index + 1 }}
                  </div>
                  <div class="cardNum">
                    <j-ellipsis>
                      {{ item.cardId }}
                    </j-ellipsis>
                  </div>
                  <div class="progress">
                    <a-progress
                        :strokeColor="'#ADC6FF'"
                        :trailColor="'#E0E4E8'"
                        :strokeLinecap="'butt'"
                        :showInfo="false"
                        :percent="Math.ceil((item.value / topTotal) * 100)"
                    ></a-progress>
                  </div>
                  <div class="total">{{ item?.value?.toFixed(2) }} M</div>
                </div>
              </div>
            </FullPage>
            <div class="empty-body" v-else>
              <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </j-page-container>
</template>

<script setup lang="ts">
import Guide from '../components/Guide.vue'
import LineChart from '../components/LineChart.vue'
import dayjs from 'dayjs'
import TimeSelect from '../components/TimeSelect.vue'
import {Empty} from 'ant-design-vue'
import {useI18n} from 'vue-i18n';
import trafficImg from '@network-card-manager-ui/assets/dashboard/traffic-pool.png'
import { dashboard, queryCardList } from '@network-card-manager-ui/api/cardManagement'
import {queryAlarmCount} from "@network-card-manager-ui/api/trafficPoolManagement";
import {map} from 'lodash-es'
import {useMenuStore} from "@/store";

const {t: $t} = useI18n();
const dayTotal = ref(0)
const monthTotal = ref(0)
const yearTotal = ref(0)
const dayOptions = ref<any[]>([])
const monthOptions = ref<any[]>([])
const yearOptions = ref<any[]>([])

const flowData = ref<any[]>([])
const topList = ref<any[]>([])
const topTotal = ref(0)
const alarmTotal = ref(0)
// const isTimer = ref(undefined)
const topType = ref('single')
const times = ref({})
const menuStory = useMenuStore();

const quickBtnList = [
  {label: $t('Dashboard.index.537937-6'), value: 'yesterday'},
  {label: $t('Dashboard.index.537937-7'), value: 'week'},
  {label: $t('Dashboard.index.537937-8'), value: 'month'},
  {label: $t('Dashboard.index.537937-9'), value: 'year'}
]

// const getData = (start: number, end: number, params: any): Promise<{ sortArray: any[] }> => {
//   return new Promise((resolve) => {
//     queryFlow(start, end, params).then((resp: any) => {
//       if (resp.status === 200) {
//         let sortArray = [];
//         if (isTimer.value) {
//           sortArray = resp.result.reverse()
//         } else {
//           sortArray = resp.result.sort(
//               (a: any, b: any) =>
//                   new Date(a.date).getTime() - new Date(b.date).getTime(),
//           );
//         }
//         const arr = sortArray.map(i => ({...i, value: Number(i.value)}))
//         resolve({
//           sortArray: arr
//         });
//       }
//     });
//   });
// }

const gotoAlarmLog = () => {
  menuStory.jumpPage(`rule-engine/Alarm/Log`, {query: {tab: 'networkCardPool'}});
};

const getData = (list = [], key: string) => {
  return list.filter(i => {
    return i.group === key
  }).map(i => i.data).reverse()
}

/**
 * 查询今日、当月、本年数据
 */
const getDataTotal = async () => {
  const dTime = [
    dayjs().subtract(1, 'day').startOf('day').valueOf(),
    dayjs().subtract(1, 'day').endOf('day').valueOf(),
  ];
  // const dParams = isTimer.value ? {
  //   context: {
  //     format: $t('Dashboard.index.537937-10'),
  //     time: "1h",
  //     from: dTime?.[0],
  //     to: dTime?.[1],
  //     limit: 24
  //   }
  // } : {
  //   orderBy: 'date',
  // }
  const mTime = [
    dayjs().startOf('month').valueOf(),
    dayjs().endOf('month').valueOf(),
  ];
  // const mParams = isTimer.value ? {
  //   "context": {
  //     format: $t('Dashboard.index.537937-11'),
  //     time: "1d",
  //     from: mTime?.[0],
  //     to: mTime?.[1],
  //     limit: 31
  //   }
  // } : {
  //   orderBy: 'date',
  // }
  const yTime = [
    dayjs().startOf('year').valueOf(),
    dayjs().endOf('year').valueOf(),
  ];
  // const yParams = isTimer.value ? {
  //   "context": {
  //     "format": $t('Dashboard.index.537937-12'),
  //     "time": "1M",
  //     from: yTime?.[0],
  //     to: yTime?.[1],
  //     "limit": 12
  //   }
  // } : {
  //   orderBy: 'date',
  // }
  // getData(dTime[0], dTime[1], dParams).then((resp) => {
  //   dayTotal.value = resp.sortArray
  //     .reduce((r, n) => r + Number(n.value), 0)
  //     .toFixed(2)
  //   dayOptions.value = resp.sortArray;
  // });
  // getData(mTime[0], mTime[1], mParams).then((resp) => {
  //   monthTotal.value = resp.sortArray
  //     .reduce((r, n) => r + Number(n.value), 0)
  //     .toFixed(2);
  //   monthOptions.value = resp.sortArray;
  // });
  // getData(yTime[0], yTime[1], yParams).then((resp) => {
  //   yearTotal.value = resp.sortArray
  //     .reduce((r, n) => r + Number(n.value), 0)
  //     .toFixed(2);
  //   yearOptions.value = resp.sortArray;
  // });
  const dParams = [
    {
      "dashboard": "flow",
      "object": "networkCardFlow",
      "measurement": "trend",
      "dimension": "agg",
      "group": "year",  //分组：本年year,当月month、昨日lastDay
      "params": {
        "format": $t('Dashboard.index.537937-12'),
        "time": "1M",
        from: yTime?.[0],
        to: yTime?.[1],
        "limit": 12
      }
    },
    {
      "dashboard": "flow",
      "object": "networkCardFlow",
      "measurement": "trend",
      "dimension": "agg",
      "group": "month",    //分组
      "params": {
        format: $t('Dashboard.index.537937-11'),
        time: "1d",
        from: mTime?.[0],
        to: mTime?.[1],
        limit: 31
      }
    },
    {
      "dashboard": "flow",
      "object": "networkCardFlow",
      "measurement": "trend",
      "dimension": "agg",
      "group": "lastDay",  //分组
      "params": {
        format: $t('Dashboard.index.537937-10'),
        time: "1h",
        from: dTime?.[0],
        to: dTime?.[1],
        limit: 24
      }
    }
  ]
  const resp: any = await dashboard(dParams)
  if(resp.success){
    dayOptions.value = getData(resp.result, 'lastDay')
    monthOptions.value = getData(resp.result, 'month')
    yearOptions.value = getData(resp.result, 'year')
    dayTotal.value = dayOptions.value.reduce((r, n) => r + Number(n.value), 0).toFixed(2)
    monthTotal.value = monthOptions.value.reduce((r, n) => r + Number(n.value), 0).toFixed(2);
    yearTotal.value = yearOptions.value.reduce((r, n) => r + Number(n.value), 0).toFixed(2);
  }
  const resp1 = await queryAlarmCount(undefined, {
    terms: [
      {
        column: 'alarmTime',
        termType: 'btw',
        value: mTime
      }
    ]
  })
  if(resp1.success){
    alarmTotal.value = resp1.result || 0
  }
};

/**
 * 流量统计
 * @param data
 */
const getEcharts = async (data: any) => {
  let startTime = data.start;
  let endTime = data.end;

  if (data.type !== 'day') {
    startTime = dayjs(data.start).startOf('days').valueOf();
    endTime = dayjs(data.end).startOf('days').valueOf();
  }
  let _time = '1m';
  let format = $t('Dashboard.index.537937-13');
  let limit = 12;
  const dt = endTime - startTime;
  const hour = 60 * 60 * 1000;
  const days = hour * 24;
  const months = days * 30;
  const year = 365 * days;
  if (dt <= (hour + 10)) {
    _time = '1h'
    limit = 24
    format = 'HH:mm';
  } else if (dt > hour && dt <= days) {
    _time = '1h'
    limit = 24;

  } else if (dt > days && dt < year) {
    limit = Math.abs(Math.ceil(dt / days)) + 1;
    _time = '1d';
    format = $t('Dashboard.index.537937-14');
  } else if (dt >= year) {
    limit = Math.abs(Math.floor(dt / months));
    _time = '1M';
    format = $t('Dashboard.index.537937-15');
  }
  // const params = isTimer.value ? {
  //   context: {
  //     time: _time,
  //     format: format,
  //     limit: limit,
  //     from: data.start,
  //     to: data.end,
  //   }
  // } : {
  //   orderBy: 'date',
  // }
  // getData(startTime, endTime, params).then((resp) => {
  //   flowData.value = resp.sortArray;
  // });
  const params = {
    "dashboard": "flow",
    "object": "networkCardFlow",
    "measurement": "trend",
    "dimension": "agg",
    "params": {
      time: _time,
      format: format,
      limit: limit,
      from: data.start,
      to: data.end,
    }
  }
  const resp: any = await dashboard(params)
  if(resp.success){
    flowData.value = map(resp.result, 'data').reverse()
  }
};

/**
 * 流量使用TOP10
 * @param star 开始时间
 * @param end 结束时间
 */
const getTopRang = async (data: any) => {
  times.value = data
  let startTime = data.start;
  let endTime = data.end;
  // const params = isTimer.value ? {
  //   orderBy: 'usage',
  //   context: {
  //     "from": startTime,
  //     "to": endTime,
  //     "limit": 10
  //   }
  // } : {
  //   orderBy: 'usage'
  // }
  // queryFlow(startTime, endTime, params).then((resp: any) => {
  //   if (resp.status === 200) {
  //     const arr = resp.result
  //         .slice(0, 10)
  //         .map(i => ({...i, value: i.value}))
  //         .sort((a: any, b: any) => b.value - a.value);
  //     topTotal.value = arr.length ? arr[0].value : 0;
  //     topList.value = arr;
  //   }
  // });
  const params = {
    "dashboard": "flow",
    "object": "networkCardFlow",
    "measurement": "rank",
    "dimension": "agg",
    "params": {
      "limit": 10,
      "from": startTime,
      "to": endTime,
    }
  }

  const isPool = topType.value === 'pool'
  let idKey = 'cardId'

  if(isPool){
    params.params.groupBy = 'poolId'
    idKey = 'poolId'
  }
  const resp: any = await dashboard(params)
  if(resp.success){
    const arr = resp.result
      .map(i => ({...i.data.value, cardNum: i.data.value.id, cardId: i.data.value[idKey],  value: i.data.value.sum}))
      .sort((a: any, b: any) => b.value - a.value);

    if (isPool && arr.length) {
      await queryCardList(arr.map(item => item.cardId)).then(listResp=> {
        if (listResp.success) {
          const _map = new Map(listResp.result.map(item => [item.id, item.alias || item.name]));
          arr.forEach((item) => {
            item.cardId = _map.get(item.cardId);
          })
        }
      })
    }


    topTotal.value = arr.length ? arr[0].value : 0;
    topList.value = arr;
  }
};

const onTypeChange = () => {
  getTopRang(times.value)
}

onMounted(() => {
  // getIsTimer().then(resp => {
  //   if (resp.success) {
  //     isTimer.value = resp.result
  getDataTotal();
  //   }
  // })
})
</script>
<style scoped lang="less">
.card-dashboard-container {
  .data-statistics-item {
    height: 140px;
    background: #fcfcfc;
    border: 1px solid #e0e4e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

    .flow-info {
      // width: 180px;
      width: 28%;

      .label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.64);
      }

      .value {
        font-size: 32px;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .unit {
          font-size: 20px;
          font-weight: normal;
        }
      }
    }
  }

  .static-card {
    background-color: #fff;
    padding: 24px;
  }

  .empty-body {
    height: 490px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    width: 100%;
    // height: 100%;
  }

  .rankingList {
    padding: 0;
    overflow-y: auto;
    list-style: none;

    .rankItem {
      display: flex;
      justify-content: space-between;
      min-width: 0;
      padding: 12px 0;
    }

    .number {
      flex: 0 0 24px;
      height: 24px;
      color: #fff;
      font-weight: bold;
      line-height: 24px;
      text-align: center;
      background-color: #d1d1d1;
    }

    .number-item-1 {
      color: #e50012;
      background-color: rgba(#e50012, 0.1);
    }

    .number-item-2 {
      color: #fba500;
      background-color: rgba(#fba500, 0.1);
    }

    .number-item-3 {
      color: #597ef7;
      background-color: rgba(#597ef7, 0.1);
    }

    .cardNum {
      flex: 0 0 100px;
      margin-left: 16px;
    }

    .progress {
      flex: 1 1 auto;
      margin: 0 8px;

      :deep(.ant-progress-inner) {
        border-radius: 0px;
      }

      :deep(.ant-progress-bg) {
        border-radius: 0px;
      }
    }

    .total {
      flex: 0 0 80px;
      color: #999;
      text-align: right;
    }
  }
}
</style>
