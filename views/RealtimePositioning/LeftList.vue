<template>
  <div class="left">
    <div class="header">
      <a-input-search
          :placeholder="$t('RealtimePositioning.index.390590-0')"
          v-model:value="searchValue"
          @search="onSearch"
          allow-clear
      />
      <a-button @click="visible = true" type="primary">
        <AIcon type="SwitcherOutlined"/>
        {{ $t('RealtimePositioning.index.390590-1') }}
      </a-button>
    </div>
    <div class="left-list">
      <j-pro-table
          :columns="[]"
          :request="query"
          :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }]
          }"
          :params="params"
          mode="CARD"
          :gridColumns="[1]"
          style="padding: 0; margin: 0"
      >
        <template #card="item">
          <div :key="item.id" class="items">
            <div class="_header">
              <div class="_header-left">
                <div class="title" @click="onClick(item)">{{ item.id }}</div>
                <a-tag :color="OperatorColor[item.operatorName]">{{ OperatorMap[item.operatorName] || '--' }}</a-tag>
              </div>
              <a-spin size="small" :spinning="!!loadings[item.iccId]">
                <div style="width: 30px">
                  <div class="actions1">
                    <a-tooltip :title="$t('Detail.index.427958-28')">
                      <a-button type="link" size="small" @click="setPosition(item)">
                        <AIcon style="font-size: 16px" type="EnvironmentFilled"/>
                      </a-button>
                    </a-tooltip>
                  </div>
                </div>
              </a-spin>
            </div>
            <div class="items-content">
              <div class="item">
                <span>ICCD</span>
                <j-ellipsis>{{ item.iccId || '--' }}</j-ellipsis>
              </div>
              <div class="item">
                <span>{{ $t('Detail.index.427958-3') }}</span>
                <j-ellipsis>{{ item.deviceName || '--' }}</j-ellipsis>
              </div>
            </div>
          </div>
        </template>
      </j-pro-table>
    </div>
  </div>
  <BatchSearch v-if="visible" @close="visible = false" @save="onSave"/>
</template>

<script setup>
import BatchSearch from './components/BatchSearch.vue';
import {query} from '@network-card-manager-ui/api/cardManagement';
import {useI18n} from "vue-i18n";
import {OperatorMap, OperatorColor} from "@network-card-manager-ui/views/data";
import {useMenuStore} from "@/store";

const emits = defineEmits(['change'])

const {t: $t} = useI18n();

const params = ref({})
const searchValue = ref()
const visible = ref(false)
const menuStore = useMenuStore()
const loadings = inject('loadings', ref({}))
const onSearch = () => {
  params.value = searchValue.value ? {
    terms: [
      {
        column: 'iccId',
        value: `%${searchValue.value}%`,
        termType: 'like'
      },
      {
        column: 'id',
        value: `%${searchValue.value}%`,
        termType: 'like',
        type: 'or'
      }
    ]
  } : {}
}

const onClick = (item) => {
  menuStore.jumpPage('iot-card/CardManagement/Detail', {
    params: {id: item.id}
  })
}

const setPosition = (item) => {
  emits('change', item.iccId)
}

const onSave = (arr) => {
  visible.value = false
  emits('change', arr)
}

</script>

<style lang="less" scoped>
.left {
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .left-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    min-height: 0;

    .items {
      background-color: #F5F5F5;
      padding: 12px 16px;
      border-radius: 4px;
      border: 1px solid #D9D9D9;
      width: 100%;

      ._header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 24px;

        ._header-left {
          display: flex;
          align-items: center;
          gap: 10px;

          .title {
            color: #191C27;

            &:hover {
              color: @primary-color;
            }
          }
        }

        .actions1 {
          display: none;
        }
      }

      .items-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        .item {
          display: flex;
          gap: 4px;
          color: #777777;

          span {
            white-space: nowrap;
            color: #A3A3A3;
          }
        }
      }

      &:hover {
        cursor: pointer;

        .actions1 {
          display: block;
        }
      }
    }
  }
}
</style>
