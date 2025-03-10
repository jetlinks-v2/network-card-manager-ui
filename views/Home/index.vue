<!-- 物联卡-首页 -->
<template>
  <j-page-container>
    <a-row :gutter="[24, 24]">
      <a-col :xxl="13" :xl="24">
        <div class="home-guide">
          <Guide :title="$t('Home.index.662663-0')"></Guide>
          <div
            class="home-guide-items"
            :style="`grid-template-columns: repeat(${
              guideList ? guideList.length : 1
            }, 1fr);`"
          >
            <div
              v-for="(item, index) in guideList"
              :key="index"
              class="home-guide-item step-bar arrow-2 pointer"
              @click="jumpPage(item)"
            >
              <div class="item-english">{{ item.english }}</div>
              <div class="item-title">{{ item.name }}</div>
              <div class="item-index">
                <img :src="Image[index + 1]" />
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :xxl="11" :xl="24">
        <div class="home-statistics">
          <Guide :title="$t('Home.index.662663-1')">
            <template #extra>
              <span class="extra-text" @click="jumpDashboard">{{ $t('Home.index.662663-2') }}</span>
            </template>
          </Guide>
          <div class="home-statistics-body">
            <div class="home-guide-item">
              <div class="item-english">{{ $t('Home.index.662663-3') }}</div>
              <div class="item-title">{{ currentSource }} M</div>
              <div
                class="item-index-echarts"
                style="height: 75px; width: 110px"
              >
                <div class="chart" ref="todayFlowChart"></div>
              </div>
            </div>
            <div class="home-guide-item">
              <div class="item-english">{{ $t('Home.index.662663-4') }}</div>
              <div class="item-content">
                <div
                  v-for="item in pieChartData"
                  :key="item.key"
                  class="item-node"
                >
                  <div class="item-node-text">
                    {{ item.value }}
                  </div>
                  <div :class="`state ${item.className}`">
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div
                class="item-index-echarts"
                style="height: 75px; width: 110px"
              >
                <div class="chart" ref="iotCardChart"></div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="24">
        <div class="home-body">
          <Guide :title="$t('Home.index.662663-5')" english="PLATFORM ARCHITECTURE DIAGRAM" />
          <div class="home-body-img">
            <img :src="iotCard.iotcardHome" />
          </div>
        </div>
      </a-col>
    </a-row>
  </j-page-container>
</template>

<script setup lang="ts" name="IotCardHome">
import { onlyMessage } from '@jetlinks-web/utils'
import Guide from '../components/Guide.vue'
import dayjs from 'dayjs'
import { queryFlow, list, getIsTimer } from '../../api/home'
import * as echarts from 'echarts'
import { useAuthStore, useMenuStore } from '@/store'
import { iotCard, home } from '../../assets'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const { proxy } = <any>getCurrentInstance()

interface GuideItemProps {
  key: string
  name: string
  english: string
  url: string
  param?: Record<string, any>
  index?: number
  auth: boolean
}

const menuStory = useMenuStore()
const menuHasPermission = useMenuStore().hasMenu
const btnHasPermission = useAuthStore().hasPermission
const isTimer = ref(false)
// 菜单权限
// const dashBoardUrl = menuHasPermission('iot-card/Dashboard')
// const platformUrl = menuHasPermission('iot-card/Platform/Detail')
const recordUrl = menuHasPermission('iot-card/Record')
// const cardUrl = menuHasPermission('iot-card/CardManagement')

// 按钮权限
const paltformPermission = btnHasPermission(`iot-card/Platform:add`)
const cardPermission = btnHasPermission(`iot-card/CardManagement:add`)

const Image = {
  1: home.home1,
  2: home.home2,
  3: home.home3
}
const guideList = [
  {
    key: 'EQUIPMENT',
    name: $t('Home.index.662663-6'),
    english: 'STEP1',
    auth: paltformPermission,
    // url: platformUrl,
    url: 'iot-card/Platform/Detail'
  },
  {
    key: 'SCREEN',
    name: $t('Home.index.662663-7'),
    english: 'STEP2',
    auth: !!cardPermission,
    // url: cardUrl,
    url: 'iot-card/CardManagement',
    param: { save: true }
  },
  {
    key: 'CASCADE',
    name: $t('Home.index.662663-8'),
    english: 'STEP3',
    auth: !!recordUrl,
    // url: recordUrl,
    url: 'iot-card/Record'
  }
]

const currentSource = ref<number>(0)
const barChartData = ref<any[]>([])
const pieChartData = ref<any[]>([
  {
    key: 'using',
    name: $t('Home.index.662663-9'),
    value: 0,
    className: 'normal'
  },
  {
    key: 'toBeActivated',
    name: $t('Home.index.662663-10'),
    value: 0,
    className: 'notActive'
  },
  {
    key: 'deactivate',
    name: $t('Home.index.662663-11'),
    value: 0,
    className: 'stopped'
  }
])

const jumpPage = (data: GuideItemProps) => {
  if (!data.auth) {
    onlyMessage($t('Home.index.662663-12'), 'warning')
    return
  }
  if (data.key === 'EQUIPMENT') {
    menuStory.jumpPage(data.url, { params: { id: ':id' } })
  } else {
    let params: any = undefined
    if (data.key === 'SCREEN') {
      params = { type: 'add' }
    }
    menuStory.jumpPage(data.url, { params })
  }
}

const jumpDashboard = () => {
  menuStory.jumpPage('iot-card/Dashboard', {})
}

/**
 * 获取昨日流量消耗
 */
const getTodayFlow = async () => {
  const beginTime = dayjs().subtract(1, 'days').startOf('day').valueOf()
  const endTime = dayjs().subtract(1, 'days').endOf('day').valueOf()
  const dParams = isTimer.value ? {
    context: {
      format: "M月dd日 HH:mm:ss",
      time: "1h",
      from: beginTime,
      to: endTime,
      limit: 24
    }
  } : {
    orderBy: 'date',
  }
  const resp: any = await queryFlow(beginTime, endTime, dParams)
  resp.result.map((item: any) => {
    currentSource.value += parseFloat(item.value.toFixed(2))
  })
}

/**
 * 获取最近15天流量消耗统计图数据
 */
const get15DaysTrafficConsumption = async () => {
  const beginTime = dayjs().subtract(15, 'days').startOf('day').valueOf();
  const endTime = dayjs().subtract(1, 'days').endOf('day').valueOf();
  const dParams = isTimer.value ? {
    context: {
      format: $t('Home.index.662663-13'),
      time: "1d",
      from: beginTime,
      to: endTime,
      limit: 15
    }
  } : {
    orderBy: 'date',
  }
  const resp: any = await queryFlow(beginTime, endTime, dParams);
  barChartData.value = resp.result
    .map((item: any) => ({
      ...item,
      value: item.value
    }))
    .reverse();
  createBarChart();
};

/**
 * 获取物联卡状态数据
 */
const getStateCard = async () => {
  Promise.all(
    pieChartData.value.map((item) => {
      const params = {
        terms: [
          {
            terms: [
              {
                column: 'cardStateType',
                termType: 'eq',
                value: item.key
              }
            ]
          }
        ]
      }
      return list(params)
    })
  )
    .then((resp) => {
      resp.forEach((i: any, index) => {
        if (i.success) {
          pieChartData.value[index].value = i.result.total
        }
      })
      createPieChart()
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * 最近15天流量消耗统计图
 */
const createBarChart = () => {
  const myChart = echarts.init(proxy.$refs.todayFlowChart)

  const options = {
    tooltip: {},
    xAxis: {
      show: false,
      data: barChartData.value.map((m) => m.date)
    },
    yAxis: {
      show: false
    },
    series: [
      {
        name: $t('Home.index.662663-14'),
        type: 'bar',
        color: '#FACD89',
        // barWidth: '5%', // 设单柱状置宽度
        showBackground: true, //设置柱状的背景虚拟
        data: barChartData.value.map((m) => parseFloat(m.value.toFixed(2)))
      }
    ]
  }
  myChart.setOption(options)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}
/**
 * 物联卡饼图
 */
const createPieChart = () => {
  nextTick(() => {
    const myChart = echarts.init(proxy.$refs.iotCardChart)

    const options = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      color: ['#85a5ff', '#f29b55', '#c4c4c4'],
      series: [
        {
          name: '',
          type: 'pie',
          avoidLabelOverlap: true, //是否启用防止标签重叠策略
          radius: ['50%', '90%'],
          center: ['50%', '50%'],
          itemStyle: {
            borderColor: 'rgba(255,255,255,1)',
            borderWidth: 2
          },
          label: {
            normal: {
              show: false
            }
          },
          data: pieChartData.value
        }
      ]
    }
    myChart.setOption(options)
    window.addEventListener('resize', function () {
      myChart.resize()
    })
  })
}

watch(
  barChartData.value,
  () => {
    createBarChart()
  },
  { deep: true }
)

getStateCard()

onMounted(() => {
  getIsTimer().then(resp => {
    if (resp.success) {
      isTimer.value = resp.result
      get15DaysTrafficConsumption();
      getTodayFlow();
    }
  })
})
</script>

<style scoped lang="less">
.home-base {
  position: relative;
  padding: 24px 16px;
  background-color: #fff;
}

.home-guide {
  padding: 24px 16px;
  background-color: #fff;

  .home-guide-items {
    display: grid;
    grid-column-gap: 56px;
  }
}

.home-guide-item {
  position: relative;
  padding: 16px;
  background: linear-gradient(
    135.62deg,
    #f6f7fd 22.27%,
    rgba(255, 255, 255, 0.86) 91.82%
  );
  border-radius: 2px;
  box-shadow: 0 4px 18px #efefef;
  .state {
    position: relative;
    padding-left: 8px;
    &::before {
      position: absolute;
      top: 7px;
      left: 0;
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 2px;
      content: '';
    }
    &.normal::before {
      background: #85a5ff;
    }
    &.notActive::before {
      background: #f29b55;
    }
    &.stopped::before {
      background: #c4c4c4;
    }
  }

  &.pointer {
    cursor: pointer;
  }

  .item-english {
    color: #4f4f4f;
  }

  .item-content {
    display: flex;
    margin-top: 15px;
    width: 80%;
    gap: 8px;
  }

  .item-node {
    min-width: 52px;
    z-index: 1;

    .item-node-text {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .item-title {
    margin: 20px 0;
    color: @text-color;
    font-weight: 700;
    font-size: 20px;
  }

  .item-index {
    position: absolute;
    right: 10%;
    bottom: 0;
  }

  .item-index-echarts {
    .item-index;

    right: 12px;
    bottom: 5%;
    z-index: 0;
    width: 50%;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}

.home-body {
  .home-base;

  min-height: 444px;
  margin-bottom: 24px;
  // padding-bottom: 26.5%;
  padding-bottom: 30%;
  overflow: hidden;
  border-bottom: 1px solid #2f54eb;

  .home-body-img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;

    > img {
      width: 100%;
      height: 100%;
    }
  }
}

.home-statistics {
  .home-base;

  .extra-text {
    cursor: pointer;
    color: @primary-color;
  }

  .home-statistics-body {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

.step-item-after {
  position: absolute;
  top: 50%;
  right: -60px;
  width: 60px;
  height: 40px;
  transform: translateY(-50%);
  content: ' ';
}

.home-step {
  .home-base;

  .home-step-items {
    display: grid;
    grid-column-gap: 66px;

    .step-item {
      display: flex;
      flex-direction: column;

      .step-item-title {
        position: relative;
        padding: 16px 24px;
        color: #333;
        font-weight: bold;
        font-size: 14px;
        background-color: #f8f9fd;
        cursor: pointer;

        .step-item-img {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 1;
          height: 100%;

          img {
            height: 100%;
          }
        }

        > span {
          position: relative;
          z-index: 2;
        }
      }

      .step-item-content {
        flex-grow: 1;
        height: auto;
        padding: 24px;
        border-right: 1px solid #e5edf4;
        border-bottom: 1px solid #e5edf4;
        border-left: 1px solid #e5edf4;
      }
    }
  }
}

.step-bar {
  position: relative;

  &.arrow-1 {
    &:not(:last-child) {
      &::after {
        .step-item-after;

        background: url('../../assets/home/arrow-1.png') no-repeat center;
      }
    }
  }

  &.arrow-2 {
    &:not(:last-child) {
      &::after {
        .step-item-after;

        background: url('../../assets/home/arrow-2.png') no-repeat center;
      }
    }
  }
}
</style>
