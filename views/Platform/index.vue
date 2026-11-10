<template>
  <DefineEmptyCreate>
    <j-permission-button type="primary" hasPermission="iot-card/Platform:add" @click="handleAdd">
      <AIcon type="PlusOutlined" />{{ $t('SimList.addPlatform') }}
    </j-permission-button>
  </DefineEmptyCreate>
  <j-page-container v-bind="$attrs">
    <FullPage>
      <j-pro-table ref="platformRef" mode="TABLE" class="pro-table__no-padding sim-list platform-list" :columns="columns"
        :request="requestList" :params="params" :scroll="{ x: 900 }"
        :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }">
        <template #headerLeftRender>
          <SimListFilters :columns="columns" :placeholder="$t('SimList.platformSearch')"
            :status="{ value: status, options: statusOptions, label: $t('Platform.index.838700-7') }"
            :error="listError" @retry="platformRef?.reload()" @search="handleSearch" @status="changeStatus" />
        </template>
        <template #headerRightRender><EmptyCreateButton /></template>
        <template #emptyText>
          <CloudEmpty v-if="listError" :description="$t('SimList.loadFailed')">
            <a-button @click="platformRef?.reload()">{{ $t('SimList.retry') }}</a-button>
          </CloudEmpty>
          <CloudEmpty v-else :search="params.terms" :search-name="$t('EmptyCreate.names.platforms')">
            <EmptyCreateButton />
          </CloudEmpty>
        </template>
        <template #name="row">
          <j-permission-button type="link" hasPermission="iot-card/Platform:update" class="sim-list__name" @click="openDetail(row)">
            <j-ellipsis>{{ row.name }}</j-ellipsis>
          </j-permission-button>
        </template>
        <template #operatorName="row"><a-tag :color="platformColor(row.operatorName)">{{ platformLabel(row.operatorName) || row.operatorName || $t('comm.table.empty-2') }}</a-tag></template>
        <template #state="row">
          <a-tag v-if="row.state" :color="row.state.value === 'enabled' ? 'success' : undefined" class="sim-list__state">{{ row.state.text }}</a-tag>
          <span v-else>{{ $t('comm.table.empty-2') }}</span>
        </template>
        <template #action="row"><SimListActions :actions="getActions(row)" permission="iot-card/Platform" icon-only /></template>
      </j-pro-table>
    </FullPage>
  </j-page-container>
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import { usePlatformList } from './hooks/usePlatformList'
import SimListFilters from '../components/list/SimListFilters.vue'
import SimListActions from '../components/list/SimListActions.vue'
const { platformRef, params, columns, requestList, handleSearch, status, statusOptions, changeStatus,
  listError, getActions, handleAdd, platformLabel, platformColor, openDetail } = usePlatformList()
const [DefineEmptyCreate, EmptyCreateButton] = createReusableTemplate()
</script>

<style scoped lang="less" src="../components/list/list.less"></style>
