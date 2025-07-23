<template>
  <div class="unbind-device-list">
    <div class="header">
      <div class="title">{{ $t('TrafficPoolManagement.Detail.index.390590-24') }}</div>
      <j-permission-button
          @click="visible = true" type="text" size="small" style="padding: 0"
          :hasPermission="'iot-card/TrafficPoolManagement:add-device'"
      >
        <AIcon type="PlusOutlined"/>
      </j-permission-button>
      <a-dropdown>
        <AIcon type="MoreOutlined"/>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a-button danger type="text" :disabled="!_dataSource.length" @click="onClear">{{
                  $t('TrafficPoolManagement.Detail.index.390590-33')
                }}
              </a-button>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-input-search allowClear @search="onSearch" v-model:value="searchValue" placeholder="请输入名称"/>
    </div>
    <div class="content">
      <div v-if="!_dataSource.length" style="margin-top: 100px">
        <j-empty>
          {{ $t('TrafficPoolManagement.Detail.index.390590-25') }}
        </j-empty>
      </div>
      <template v-else>
        <div
            v-for="(item) in _dataSource"
            :key="item" class="list-item"
            :draggable="true"
            @dragstart="(e) => onStart(e, item)"
            @dragend="onEnd"
        >
          <div class="list-item-title">
            <j-ellipsis>{{ item.name || "--" }}</j-ellipsis>
          </div>
          <div class="list-item-content">
            <div class="list-item-content-item">
              <span>ID</span>
              <j-ellipsis>{{ item.id || "--" }}</j-ellipsis>
            </div>
            <div class="list-item-content-item">
              <span>{{ $t('TrafficPoolManagement.Detail.index.390590-34') }}</span>
              <j-ellipsis>{{ item.productName || '--' }}</j-ellipsis>
            </div>
            <div class="list-item-content-item">
              <span>{{ $t('Detail.index.707691-23') }}</span>
              <j-ellipsis>{{ item.describe || "--" }}</j-ellipsis>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <AddDevice v-if="visible" @close="visible = false" @save="onSave" :defaultParams="defaultParams"/>
</template>

<script setup>
import {Modal} from "ant-design-vue";
import AddDevice from './AddDevice/index.vue'
import {queryDeviceNoPagingPost} from "@networkCardManager/api/trafficPoolManagement";
import {useI18n} from "vue-i18n";
import {map} from "lodash-es";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const {t: $t} = useI18n();
const dataSource = ref([])
const visible = ref(false)
const searchValue = ref()
const _searchValue = ref()

const _dataSource = computed(() => {
  return dataSource.value.filter(i => {
    return !map(props.data, 'deviceId').includes(i.id) && (!_searchValue.value || i.name.includes(_searchValue.value))
  })
})

const defaultParams = computed(() => {
  const ids = [...map(props.data, 'deviceId'), ...map(_dataSource.value, 'id')]
  let terms = []
  if (ids.length) {
    terms = [
      {
        column: "id",
        termType: "nin",
        value: ids
      }
    ]
  }
  return terms
})

const onSearch = (e) => {
  _searchValue.value = e
}
const onStart = (e, item) => {
  e.dataTransfer.setData('application/json', JSON.stringify({
    deviceId: item.id,
    deviceName: item.name,
    state: item.state
  }));
  e.target.classList.add('dragging');
}

const onEnd = (e) => {
  e.target.classList.remove('dragging');
}

const onClear = () => {
  Modal.confirm({
    title: $t('TrafficPoolManagement.Detail.index.390590-35'),
    onOk() {
      dataSource.value = []
    }
  });
}

const handleSearch = async (dt) => {
  const resp = await queryDeviceNoPagingPost({
    paging: false, terms: [
      {
        column: "id",
        termType: "card_bind_device$not",
        value: "",
        terms: [
            ...defaultParams.value, ...dt.terms
        ]
      }
    ]
  })
  if (resp.success) {
    dataSource.value.push(...resp.result)
  }
}

const onSave = (dt) => {
  handleSearch(dt)
  visible.value = false
}
</script>

<style lang="less" scoped>
.unbind-device-list {
  border: 1px solid #B9B9B9;
  padding: 16px;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 16px;

    .title {
      font-size: 16px;
      white-space: nowrap;
    }
  }

  .content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}

.list-item {
  background-color: #F5F5F5;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid #D9D9D9;
  cursor: pointer;
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: 16px;
  }

  &-title {
    font-size: 16px;
  }

  &-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    color: #A3A3A3;

    span {
      white-space: nowrap;
    }

    &-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
}
</style>
