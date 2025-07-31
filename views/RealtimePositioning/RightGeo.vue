<template>
  <div style="width: 100%; height: 100%;position: relative">
    <RealTimeMap :marks="positions" :is-show="isShow" ref="mapRef"/>
    <div class="actions">
      <a-space>
        <template v-if="positions.length && !_error.length" >
          <a-button type="primary" danger @click="onRefresh">
            <AIcon type="ReloadOutlined"/>
            {{ $t('RealtimePositioning.index.390590-7') }}
          </a-button>
          <a-button type="primary" @click="onLoad">
            <AIcon type="ExportOutlined"/>
            {{ $t('RealtimePositioning.index.390590-8') }}
          </a-button>
        </template>
        <a-button type="primary" @click="onError" v-if="_error.length > 0">
          <AIcon type="FileSearchOutlined"/>
          {{ $t('RealtimePositioning.index.390590-11') }}
        </a-button>
      </a-space>
    </div>
  </div>
  <ErrorModal v-if="error.visible" :data="error.data" @close="error.visible = false"/>
</template>

<script setup>
import RealTimeMap from './components/RealTimeMap.vue';
import {useI18n} from "vue-i18n";
import {Modal} from "ant-design-vue";
import {queryBatchPosition, _export} from "@networkCardManager/api/realtimePositioning";
import ErrorModal from "./components/ErrorModal.vue";
import {onlyMessage, downloadFileByUrl} from '@jetlinks-web/utils';
import dayjs from 'dayjs'

const props = defineProps({
  cardIds: {
    type: Array,
    default: () => []
  }
})

const isShow = ref(false)
const {t: $t} = useI18n();
const loadings = inject('loadings', ref({}))
const error = reactive({
  visible: false,
  data: []
})
const mapRef = ref()
const dataMap = ref([])

const positions = computed(() => {
  return dataMap.value.filter(i => i && !i.error)
})

const _error = computed(() => {
  return dataMap.value.filter(i => i && i.error)
})

const onRefresh = () => {
  Modal.confirm({
    title: $t('RealtimePositioning.index.390590-10'),
    onOk() {
      dataMap.value = []
      mapRef.value?.onRefresh()
    },
  });
}

const onLoad = async () => {
  if (positions.value.length) {
    const resp = await _export('xlsx', {
      "paging": false,
      "terms": [
        {
          "column": "id",
          "termType": "in",
          "value": positions.value.map(i => i.id).join(',')
        }
      ]
    })
    if (resp) {
      const blob = new Blob([resp], {type: 'xlsx'})
      const url = URL.createObjectURL(blob)
      downloadFileByUrl(
          url,
          `物联卡实时定位查询${dayjs(new Date()).format('YYYY-MM-DD')}`,
          'xlsx'
      )
    }
  }
}

const onError = () => {
  error.visible = true
  error.data = _error.value
}

const getPositions = async (arr) => {
  dataMap.value = []
  const resp = await queryBatchPosition(arr).finally(() => {
    arr.map(i => {
      loadings.value[i] = false
    })
  })
  if (resp.success) {
    dataMap.value.push(...resp.result)
    if (arr.length === 1 && resp.result?.[0].error) {
      // resp.result?.[0]?.errorMessage
      onlyMessage($t('RealtimePositioning.index.390590-12'), 'error')
      isShow.value = false
    } else {
      if (arr.length > 1 && resp.result?.length) {
        const dt = resp.result.some(i => (arr.includes(i.iccId) || arr.includes(i.id)) && !i.error)
        onlyMessage($t('RealtimePositioning.index.390590-13'), 'error')
        isShow.value = dt
      } else {
        isShow.value = true
      }
    }
  }
}

watch(() => props.cardIds, (val) => {
  if (val && val.length) {
    const arr = Array.isArray(val) ? val : [val];
    // 初始化，或者把原来的数据删除
    arr.map(i => {
      loadings.value[i] = true
      // 判断是iccId还是id
      const _index = dataMap.value.findIndex(j => j.iccId === i || j.id === i)
      if(_index !== -1){
        dataMap.value.splice(_index, 1)
      }
    })
    getPositions(arr)
  }
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="less">
.actions {
  position: absolute;
  bottom: 20px;
  right: 50%;
  left: calc(50% - 150px)
}
</style>

