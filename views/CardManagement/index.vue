<template>
  <DefineEmptyCreate>
    <j-permission-button type="primary" hasPermission="iot-card/CardManagement:add" @click="handleAdd">
      <AIcon type="PlusOutlined" />{{ $t('SimList.addCard') }}
    </j-permission-button>
  </DefineEmptyCreate>
  <j-page-container v-bind="$attrs">
    <FullPage>
      <j-pro-table
        ref="cardManageRef" mode="TABLE" class="pro-table__no-padding sim-list" :columns="columns"
        :request="requestList" :params="params" :scroll="{ x: 1490 }"
        :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
        :rowSelection="isCheck ? {
          selectedRowKeys: _selectedRowKeys, onSelect: onSelectChange, onSelectAll: selectAll,
          onSelectNone: () => (_selectedRowKeys = []),
        } : false"
      >
        <template #headerLeftRender>
          <SimListFilters :columns="searchColumns" :placeholder="$t('SimList.cardSearch')"
            :status="{ value: status, options: statusOptions, label: $t('CardManagement.index.427944-47') }"
            :error="listError" @retry="cardManageRef?.reload()" @search="search" @status="changeStatus" />
        </template>
        <template #headerRightRender>
          <a-space>
            <BatchDropdown v-model:isCheck="isCheck" :actions="batchActions" @change="onCheckChange" />
            <EmptyCreateButton />
          </a-space>
        </template>
        <template #emptyText>
          <CloudEmpty v-if="listError" :description="$t('SimList.loadFailed')">
            <a-button @click="cardManageRef?.reload()">{{ $t('SimList.retry') }}</a-button>
          </CloudEmpty>
          <CloudEmpty v-else :search="params.terms" :search-name="$t('Home.index.662663-4')">
            <EmptyCreateButton />
          </CloudEmpty>
        </template>
        <template #id="row">
          <div class="sim-list__identity">
            <j-permission-button type="link" :hasPermission="true" class="sim-list__name" @click="openDetail(row)">
              <j-ellipsis>{{ row.name || row.id }}</j-ellipsis>
            </j-permission-button>
            <small v-if="row.name" class="sim-list__secondary">{{ row.id }}</small>
          </div>
        </template>
        <template #iccId="row"><j-ellipsis>{{ row.iccId || $t('comm.table.empty-2') }}</j-ellipsis></template>
        <template #platformConfigName="row"><j-ellipsis>{{ row.platformConfigName || $t('comm.table.empty-2') }}</j-ellipsis></template>
        <template #comboType="row">{{ row.comboType?.text || $t('comm.table.empty-2') }}</template>
        <template #deviceId="row"><j-ellipsis>{{ row.deviceName || $t('comm.table.empty') }}</j-ellipsis></template>
        <template #syncCardStatus="row">
          <a-tag v-if="row.syncCardStatus" class="sim-list__state" :color="syncStatusColor[row.syncCardStatus.value]">{{ row.syncCardStatus.text }}</a-tag>
          <span v-else>{{ $t('comm.table.empty-2') }}</span>
        </template>
        <template #flowUsage="row"><FlowUsage :card="row" /></template>
        <template #action="row"><SimListActions :actions="getActions(row)" permission="iot-card/CardManagement" icon-only /></template>
      </j-pro-table>
    </FullPage>
    <Import v-if="importVisible" @close="importVisible = false" @save="importSave" />
    <Export v-if="exportVisible" :data="_selectedRowKeys" :params="params" @close="exportVisible = false" />
    <BindDevice v-if="bindDeviceVisible" :cardId="cardId" @change="bindDevice" />
    <Save v-if="visible" :type="saveType" :data="current" @change="saveChange" />
    <SyncModal v-if="syncVisible" :params="params" @close="syncClose" />
  </j-page-container>
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import { useCardManagement } from './hooks/useCardManagement'
import SimListFilters from '../components/list/SimListFilters.vue'
import SimListActions from '../components/list/SimListActions.vue'
import FlowUsage from './FlowUsage.vue'
import BindDevice from './BindDevice.vue'
import Import from './Import.vue'
import Export from './Export.vue'
import Save from './Save.vue'
import SyncModal from './Sync.vue'
const {
  cardManageRef, params, columns, searchColumns, requestList, search, status, statusOptions, changeStatus, listError, syncStatusColor,
  _selectedRowKeys, isCheck, onSelectChange, selectAll, onCheckChange, batchActions, getActions, openDetail, handleAdd,
  importVisible, exportVisible, bindDeviceVisible, visible, syncVisible, cardId, current, saveType,
  importSave, bindDevice, saveChange, syncClose,
} = useCardManagement()
const [DefineEmptyCreate, EmptyCreateButton] = createReusableTemplate()
</script>

<style scoped lang="less" src="../components/list/list.less"></style>
