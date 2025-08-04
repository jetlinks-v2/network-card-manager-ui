<template>
  <a-alert :message="$t('Save.SelectDevices.386303-18', [deviceCount])"/>
  <pro-search
      :columns="columns"
      @search="handleSearch"
      type="simple"
      style="padding: 0; margin: 16px 0"
  />
  <div style="min-height: 0; flex: 1">
    <j-pro-table
        mode="TABLE"
        type="TREE"
        :columns="columns"
        :request="getTreeData_api"
        :bodyStyle="{padding: 0}"
        :params="params"
        :alertShow="false"
        :rowSelection="{
          type: 'radio',
          selectedRowKeys: _selectedRowKeys,
          onChange: onChange,
      }"
    />
  </div>
</template>

<script setup>
import {getTreeData_api} from "@/api/system/department";
import {useI18n} from "vue-i18n";
import {onlyMessage} from "@jetlinks-web/utils";
import {queryDetailList} from "@device/api/firmware";
import {map} from "lodash-es";
import {queryDeviceNoPagingPost} from "@networkCardManager/api/trafficPoolManagement";

const props = defineProps({
  defaultParams: {
    type: Object,
    default: () => ({})
  },
});

const {t: $t} = useI18n();
const columns = [
  {
    title: $t('Save.index.902471-6'),
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
    },
    ellipsis: true,
  },
  {
    title: $t('Search.Sort.467776-0'),
    dataIndex: 'sortIndex',
    key: 'sortIndex',
  },
]
const _selectedRowKeys = ref([])
const params = ref({});
const deviceCount = ref(0);
const handleSearch = (e) => {
  params.value = e
}

const handleData = async () => {
  const resp = await queryDeviceNoPagingPost({
    paging: false, terms: [
      {
        column: "id",
        termType: "card_bind_device$not",
        value: "",
        terms: [
            ...props.defaultParams,
          {
            column: "id$dim-assets",
            value: JSON.stringify({
              assetType: 'device',
              targets: [
                {
                  type: 'org',
                  id:  _selectedRowKeys.value?.[0]
                },
              ],
            })
          }
        ]
      }
    ]
  })
  if(resp.success){
    deviceCount.value = resp.result.length
  }
}

const onChange = (_keys) => {
  _selectedRowKeys.value = _keys
  handleData()
};

const onSave = () => {
  return new Promise((resolve) => {
    if (deviceCount.value > 0) {
      resolve({
        terms: [{
          column: "id$dim-assets",
          value: JSON.stringify({
            assetType: 'device',
            targets: [
              {
                type: 'org',
                id: _selectedRowKeys.value?.[0]
              },
            ],
          })
        }],
      })
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
