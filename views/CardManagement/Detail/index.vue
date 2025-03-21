<!-- 物联卡查看 -->
<template>
  <j-page-container v-if="type === 'card'">
    <!-- 新增 -->
    <FullPage :fixed="false" style="background: transparent">
      <Save
        v-if="visible"
        :type="saveType"
        :data="current"
        @change="saveChange"
      />
      <a-row :gutter="[24, 24]">
        <a-col :span="24">
          <a-card>
            <a-descriptions size="small" :column="3" bordered>
              <template #title>
                <Guide>
                  <template #title>
                    <span>{{ $t("Detail.index.427958-0") }}</span>
                    <j-permission-button
                      type="link"
                      hasPermission="iot-card/CardManagement:update"
                      @click="
                        () => {
                          visible = true;
                          current = detail;
                          saveType = 'edit';
                        }
                      "
                    >
                      <AIcon type="EditOutlined"></AIcon>
                      {{ $t("Detail.index.427958-1") }}
                    </j-permission-button>
                  </template>
                </Guide>
              </template>

              <a-descriptions-item :label="$t('Detail.index.427958-2')">{{
                detail.id
              }}</a-descriptions-item>
              <a-descriptions-item label="ICCID">{{
                detail.iccId
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-3')">{{
                detail.deviceName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-4')">{{
                platformTypeList.find(
                  (item) => item.value === detail.operatorName
                )?.label || detail.operatorName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-5')">{{
                detail.platformConfigName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-6')">{{
                OperatorList.find((item) => item.value === detail.operatorName)
                  ?.label || detail.operatorName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-7')">{{
                detail.cardType?.text
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-8')">{{
                detail.activationDate
                  ? dayjs(detail.activationDate).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-9')">{{
                detail.updateTime
                  ? dayjs(detail.updateTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-10')">{{
                detail.totalFlow ? detail.totalFlow.toFixed(2) + " M" : "0 M"
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-11')">{{
                detail.usedFlow ? detail.usedFlow.toFixed(2) + " M" : "0 M"
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-12')">{{
                detail.residualFlow
                  ? detail.residualFlow.toFixed(2) + " M"
                  : "0 M"
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-13')">
                {{ detail?.cardState?.text }}
                <span v-if="deactivateData.show" style="padding-left: 8px">
                  <a-tooltip :title="deactivateData.tip">
                    <AIcon
                      type="ExclamationCircleOutlined"
                      style="color: var(--ant-error-color)"
                    />
                  </a-tooltip>
                </span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-14')">
                {{ detail?.cardStateType?.text }}
              </a-descriptions-item>
              <a-descriptions-item>
                <template #label>
                  <div>
                    {{ $t("Detail.index.427958-25") }}
                    <a-tooltip>
                      <template #title>{{
                        $t("Detail.index.427958-26")
                      }}</template>
                      <AIcon type="QuestionCircleOutlined"></AIcon>
                    </a-tooltip>
                  </div>
                </template>
                <div style="display: flex; gap: 10px; align-items: center">
                  <div style="min-width: 60px">
                    {{ detail?.syncCardStatus?.text }}
                  </div>
                  <div
                    style="
                      display: flex;
                      color: red;
                      align-items: center;
                      gap: 5px;
                    "
                    v-if="detail?.syncCardStatus?.value === 'failed'"
                  >
                    <AIcon type="ExclamationCircleFilled" />
                    <j-ellipsis>{{ detail?.errorMessage }}</j-ellipsis>
                  </div>
                </div>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-15')">{{
                detail?.describe
              }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="24">
          <!-- {{ $t('Detail.index.427958-16') }} -->
          <a-row :gutter="24">
            <a-col :span="16">
              <div class="card">
                <Guide :title="$t('Detail.index.427958-16')">
                  <template #extra>
                    <TimeSelect
                      :type="'week'"
                      :is-timer="isTimer"
                      :quickBtnList="quickBtnList"
                      @change="getEcharts"
                      :is-show-time="false"
                    />
                  </template>
                </Guide>
                <LineChart
                  :showX="true"
                  :showY="true"
                  style="min-height: 490px"
                  :chartData="flowData"
                />
              </div>
            </a-col>
            <a-col :span="8">
              <div class="card h-100">
                <Guide :title="$t('Detail.index.427958-17')" />
                <div class="static-info" style="min-height: 490px">
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        {{ $t("Detail.index.427958-18") }}
                      </div>
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
                    <LineChart color="#FBA500" :chartData="dayOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        {{ $t("Detail.index.427958-19") }}
                      </div>
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
                    <LineChart :chartData="monthOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        {{ $t("Detail.index.427958-20") }}
                      </div>
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
                    <LineChart color="#58E1D3" :chartData="yearOptions" />
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </FullPage>
  </j-page-container>
  <div v-else>
    <div v-if="cardId">
      <Save
        v-if="visible"
        :type="saveType"
        :data="current"
        @change="saveChange"
      />
      <a-row :gutter="[24, 24]">
        <a-col :span="24">
          <a-card>
            <a-descriptions size="small" :column="3" bordered>
              <template #title>
                <Guide>
                  <template #title>
                    <span>{{ $t("Detail.index.427958-0") }}</span>
                    <a-button
                      type="link"
                      @click="
                        () => {
                          visible = true;
                          current = detail;
                          saveType = 'edit';
                        }
                      "
                    >
                      <AIcon type="EditOutlined"></AIcon>
                      {{ $t("Detail.index.427958-1") }}
                    </a-button>
                  </template>
                </Guide>
              </template>

              <a-descriptions-item :label="$t('Detail.index.427958-2')">{{
                detail.id
              }}</a-descriptions-item>
              <a-descriptions-item label="ICCID">{{
                detail.iccId
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-3')">{{
                detail.deviceName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-4')">{{
                platformTypeList.find(
                  (item) => item.value === detail.operatorName
                )?.label || detail.operatorName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-5')">{{
                detail.platformConfigName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-6')">{{
                OperatorList.find((item) => item.value === detail.operatorName)
                  ?.label || detail.operatorName
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-7')">{{
                detail.cardType?.text
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-8')">{{
                detail.activationDate
                  ? dayjs(detail.activationDate).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-9')">{{
                detail.updateTime
                  ? dayjs(detail.updateTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-10')">{{
                detail.totalFlow ? detail.totalFlow.toFixed(2) + " M" : "0 M"
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-11')">{{
                detail.usedFlow ? detail.usedFlow.toFixed(2) + " M" : "0 M"
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-12')">{{
                detail.residualFlow
                  ? detail.residualFlow.toFixed(2) + " M"
                  : "0 M"
              }}</a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-13')">
                {{ detail?.cardState?.text }}
                <span v-if="deactivateData.show" style="padding-left: 8px">
                  <a-tooltip :title="deactivateData.tip">
                    <AIcon
                      type="ExclamationCircleOutlined"
                      style="color: var(--ant-error-color)"
                    />
                  </a-tooltip>
                </span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-14')">
                {{ detail?.cardStateType?.text }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.427958-15')">{{
                detail?.describe
              }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="24">
          <!-- {{ $t('Detail.index.427958-16') }} -->
          <a-row :gutter="24">
            <a-col :span="16">
              <div class="card">
                <Guide :title="$t('Detail.index.427958-16')">
                  <template #extra>
                    <TimeSelect
                      :type="'week'"
                      :is-timer="isTimer"
                      :quickBtnList="quickBtnList"
                      @change="getEcharts"
                      :is-show-time="false"
                    />
                  </template>
                </Guide>
                <LineChart
                  :showX="true"
                  :showY="true"
                  style="min-height: 490px"
                  :chartData="flowData"
                />
              </div>
            </a-col>
            <a-col :span="8">
              <div class="card" >
                <Guide :title="$t('Detail.index.427958-17')" />
                <div class="static-info" style="min-height: 490px">
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        {{ $t("Detail.index.427958-18") }}
                      </div>
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
                    <LineChart color="#FBA500" :chartData="dayOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        {{ $t("Detail.index.427958-19") }}
                      </div>
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
                    <LineChart :chartData="monthOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        {{ $t("Detail.index.427958-20") }}
                      </div>
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
                    <LineChart color="#58E1D3" :chartData="yearOptions" />
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <JEmpty v-else></JEmpty>
  </div>
</template>

<script setup lang="ts" name="CardDetail">
import dayjs from "dayjs";
import type { CardManagement } from "../typing";
import {
  queryDeactivate,
  queryDetail,
  query,
} from "../../../api/cardManagement";
import Save from "../Save.vue";
import Guide from "../../components/Guide.vue";
import LineChart from "../../components/LineChart.vue";
import { queryFlow } from "../../../api/home";
import TimeSelect from "../../components/TimeSelect.vue";
import { OperatorList, platformTypeList } from "../../data";
import { getIsTimer } from "@networkCardManager/api/home";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const props = defineProps({
  type: {
    type: String,
    default: "card",
  },
});

const route = useRoute();
const cardId = ref();
const isTimer = ref(false);
const visible = ref<boolean>(false);
const current = ref<Partial<CardManagement>>({});
const saveType = ref<string>("");
const detail = ref<any>({});

const flowData = ref<any[]>([]);
const dayTotal = ref(0);
const monthTotal = ref(0);
const yearTotal = ref(0);
const dayOptions = ref<any[]>([]);
const monthOptions = ref<any[]>([]);
const yearOptions = ref<any[]>([]);

const deactivateData = reactive({
  show: false,
  tip: "",
});

const quickBtnList = [
  { label: $t("Detail.index.427958-21"), value: "yesterday" },
  { label: $t("Detail.index.427958-22"), value: "week" },
  { label: $t("Detail.index.427958-23"), value: "month" },
  { label: $t("Detail.index.427958-24"), value: "year" },
];

const getDetail = () => {
  queryDetail(cardId.value).then((resp: any) => {
    if (resp.success) {
      detail.value = resp.result;

      if (
        resp.result.cardStateType?.value === "deactivate" &&
        detail.value.operatorName === "onelink"
      ) {
        deactivateData.show = true;
        //   获取停机原因
        queryDeactivate(cardId.value).then((deacResp: any) => {
          if (deacResp.success && deacResp.result?.message) {
            deactivateData.tip = deacResp.result.message.toString();
          }
        });
      }
    }
  });
};

/**
 * 新增、编辑关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
  visible.value = false;
  current.value = {};
  if (val) {
    getDetail();
  }
};

const getData = (
  start: number,
  end: number,
  params: any
): Promise<{ sortArray: any[] }> => {
  return new Promise((resolve) => {
    queryFlow(start, end, params).then((resp: any) => {
      if (resp.status === 200) {
        let sortArray = [];
        if (isTimer.value) {
          sortArray = resp.result.reverse();
        } else {
          sortArray = resp.result.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
        resolve({
          sortArray,
        });
      }
    });
  });
};

/**
 * 查询左日、当月、本年数据
 */
const getDataTotal = () => {
  const dTime = [
    dayjs(new Date()).subtract(1, "day").startOf("day").valueOf(),
    dayjs(new Date()).subtract(1, "day").endOf("day").valueOf(),
  ];
  const dParams = isTimer.value
    ? {
        context: {
          format: "M月dd日 HH:mm:ss",
          time: "1h",
          from: dTime?.[0],
          to: dTime?.[1],
          cardId: cardId.value,
          limit: 24,
        },
      }
    : {
        orderBy: "date",
        terms: [
          {
            column: "cardId",
            termType: "eq",
            value: cardId.value,
          },
        ],
      };
  const mTime = [
    dayjs().startOf("month").valueOf(),
    dayjs().endOf("month").valueOf(),
  ];
  const mParams = isTimer.value
    ? {
        context: {
          format: "Y年M月d日",
          time: "1d",
          from: mTime?.[0],
          to: mTime?.[1],
          cardId: cardId.value,
          limit: 31,
        },
      }
    : {
        orderBy: "date",
        terms: [
          {
            column: "cardId",
            termType: "eq",
            value: cardId.value,
          },
        ],
      };
  const yTime = [
    dayjs().startOf("year").valueOf(),
    dayjs().endOf("year").valueOf(),
  ];
  const yParams = isTimer.value
    ? {
        context: {
          format: "Y年M月",
          time: "1M",
          from: yTime?.[0],
          to: yTime?.[1],
          cardId: cardId.value,
          limit: 12,
        },
      }
    : {
        orderBy: "date",
        terms: [
          {
            column: "cardId",
            termType: "eq",
            value: cardId.value,
          },
        ],
      };
  getData(dTime[0], dTime[1], dParams).then((resp) => {
    dayTotal.value = resp.sortArray
      .reduce((r, n) => r + Number(n.value), 0)
      .toFixed(2);
    dayOptions.value = resp.sortArray;
  });
  getData(mTime[0], mTime[1], mParams).then((resp) => {
    monthTotal.value = resp.sortArray
      .reduce((r, n) => r + Number(n.value), 0)
      .toFixed(2);
    monthOptions.value = resp.sortArray;
  });
  getData(yTime[0], yTime[1], yParams).then((resp) => {
    yearTotal.value = resp.sortArray
      .reduce((r, n) => r + Number(n.value), 0)
      .toFixed(2);
    yearOptions.value = resp.sortArray;
  });
};

/**
 * 流量统计
 * @param data
 */
const getEcharts = (data: any) => {
  let startTime = data.start;
  let endTime = data.end;
  if (data.type !== "day") {
    startTime = dayjs(data.start).startOf("days").valueOf();
    endTime = dayjs(data.end).startOf("days").valueOf();
  }
  let _time = "1m";
  let format = "M月dd日 HH:mm";
  let limit = 12;
  const dt = endTime - startTime;
  const hour = 60 * 60 * 1000;
  const days = hour * 24;
  const months = days * 30;
  const year = 365 * days;
  if (dt <= hour + 10) {
    _time = "1h";
    limit = 24;
    format = "HH:mm";
  } else if (dt > hour && dt <= days) {
    _time = "1h";
    limit = 24;
  } else if (dt > days && dt < year) {
    limit = Math.abs(Math.ceil(dt / days)) + 1;
    _time = "1d";
    format = "M月dd日";
  } else if (dt >= year) {
    limit = Math.abs(Math.floor(dt / months));
    _time = "1M";
    format = "yyyy年-M月";
  }
  const params = isTimer.value
    ? {
        context: {
          time: _time,
          format: format,
          limit: limit,
          cardId: cardId.value,
          from: data.start,
          to: data.end,
        },
      }
    : {
        orderBy: "date",
        terms: [
          {
            column: "cardId",
            termType: "eq",
            value: cardId.value,
          },
        ],
      };
  getData(startTime, endTime, params).then((resp) => {
    flowData.value = resp.sortArray;
  });
};

/**
 * 获取绑定设备的物联卡的信息
 */
const queryCard = async () => {
  const res: any = await query({
    terms: [
      {
        column: "deviceId",
        termType: "eq",
        value: route.params.id,
      },
    ],
  });
  if (res.success && res.result?.data) {
    cardId.value = res.result?.data?.[0]?.id;
  }
};

onMounted(async () => {
  if (props.type === "device") {
    await queryCard();
  } else {
    cardId.value = route.params.id;
  }
  if (cardId.value) {
    getDetail();
    getIsTimer().then((resp) => {
      if (resp.success) {
        isTimer.value = resp.result;
        getDataTotal();
      }
    });
  }
});
</script>
<style scoped lang="less">
.card {
  padding: 24px;
  background-color: #fff;
}

.h-100 {
  height: 100%;
}

.static-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
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
}
</style>
