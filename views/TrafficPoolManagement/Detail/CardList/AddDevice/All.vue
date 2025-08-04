<template>
  <pro-search
      :columns="columns"
      target="traffic-pool-manage-search-select-device-all"
      @search="handleSearch"
      style="padding: 0"
  />
  <div style="flex: 1; min-height: 0">
    <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :columns="columns"
        :request="(e) => queryDevice(e)"
        :defaultParams="{sorts: [{name: 'createTime', order: 'desc'}]}"
        :params="_params"
        :bodyStyle="{padding: 0}"
    >
      <template #productId="slotProps">
        <span>{{ slotProps.productName }}</span>
      </template>
      <template #state="slotProps">
        <a-badge
            :text="slotProps.state?.text"
            :status="statusMap.get(slotProps.state?.value)"
        />
      </template>
      <template #version="slotProps">
        <span>{{ slotProps.firmwareInfo?.version || '--' }}</span>
      </template>
      <template #createTime="slotProps">
        <span>{{ slotProps.createTime ? dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}</span>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import {queryDevice} from '@networkCardManager/api/trafficPoolManagement';
import {useI18n} from 'vue-i18n';
import dayjs from "dayjs";
import {onlyMessage} from "@jetlinks-web/utils";
import {useRouteQuery} from "@vueuse/router/index";

const {t: $t} = useI18n();
const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
  defaultParams: {
    type: Object,
    default: () => ({}),
  }
});

const params = ref({});
const tableRef = ref()
const search = useRouteQuery('q')

const statusMap = new Map();
statusMap.set('online', 'processing');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const columns = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    fixed: 'left',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Save.SelectDevices.386303-5'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-47'),
    dataIndex: 'productName',
    key: 'productName',
    ellipsis: true,
    search: {
      type: 'select',
      rename: 'productId',
      options: () =>
          new Promise((resolve) => {
            queryNoPagingPost({paging: false}).then((resp) => {
              resolve(
                  resp.result.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })),
              );
            });
          }),
    },
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-48'),
    key: 'createTime',
    dataIndex: 'createTime',
    search: {
      type: 'date',
    },
    width: 200,
    scopedSlots: true,
  },
  {
    title: $t('Save.SelectDevices.386303-8'),
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: $t('Save.SelectDevices.386303-9'), value: 'online'},
        {label: $t('Save.SelectDevices.386303-10'), value: 'offline'},
        {label: $t('Save.SelectDevices.386303-11'), value: 'notActive'},
      ],
    },
    width: 150,
  },
];

const _params = computed(() => {
  return {
    terms: [
      {
        column: "id",
        termType: "card_bind_device$not",
        value: "",
        terms: [
          ...props.defaultParams,
          ...(params.value.terms || []),
        ]
      }
    ]
  }
})
const handleSearch = (e) => {
  params.value = e
};

const onSave = () => {
  return new Promise((resolve) => {
    if(tableRef.value.dataSource?.length){
      resolve(params.value)
      search.value = encodeURI(JSON.stringify({}))
    } else {
      onlyMessage($t('Save.SelectDevices.386303-19'), 'error')
      resolve(false)
    }
  });
};

defineExpose({onSave})
</script>

<style lang="less" scoped>
</style>
