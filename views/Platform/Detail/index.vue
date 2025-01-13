<template>
  <j-page-container>
    <FullPage :fixed="false">
      <a-card>
        <a-row :gutter="24">
          <a-col :span="14">
            <TitleComponent :data="$t('Detail.index.838702-0')" />
            <a-form
              :layout="'vertical'"
              ref="formRef"
              :rules="rules"
              :model="form"
            >
              <a-form-item :label="$t('Detail.index.838702-1')" name="operatorName" required>
                <PlatformType
                  :disabled="showDisabled"
                  :model="'singular'"
                  :itemStyle="{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    minWidth: '130px'
                  }"
                  :options="platformTypeList"
                  v-model:value="form.operatorName"
                  @change="typeChange"
                ></PlatformType
              ></a-form-item>
              <a-form-item :label="$t('Detail.index.838702-2')" name="name">
                <a-input v-model:value="form.name" :placeholder="$t('Detail.index.838702-3')" />
              </a-form-item>

              <!-- onelink -->
              <div v-if="form.operatorName === 'onelink'">
                <a-form-item label="App ID" name="appId">
                  <a-input
                    v-model:value="form.appId"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-4')"
                  />
                </a-form-item>
                <a-form-item label="Password" name="passWord">
                  <a-input-password
                    v-model:value="form.passWord"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-5')"
                  />
                </a-form-item>
                <a-form-item :label="$t('Detail.index.838702-6')" name="apiAddr">
                  <a-input
                    v-model:value="form.apiAddr"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-7')"
                  />
                </a-form-item>
              </div>
              <!-- ctwing -->
              <div v-if="form.operatorName === 'ctwing'">
                <a-form-item :label="$t('Detail.index.838702-8')" name="userId">
                  <a-input
                    v-model:value="form.userId"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-9')"
                  />
                </a-form-item>
                <a-form-item :label="$t('Detail.index.838702-10')" name="passWord">
                  <a-input-password
                    v-model:value="form.passWord"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-5')"
                  />
                </a-form-item>
                <a-form-item label="secretKey" name="secretKey">
                  <a-input
                    v-model:value="form.secretKey"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-11')"
                  />
                </a-form-item>
              </div>
              <!-- unicom -->
              <div v-if="form.operatorName === 'unicom'">
                <a-form-item label="App ID" name="appId">
                  <a-input
                    v-model:value="form.appId"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-4')"
                  />
                </a-form-item>
                <a-form-item label="App Secret" name="appSecret">
                  <a-input
                    v-model:value="form.appSecret"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-12')"
                  />
                </a-form-item>
                <a-form-item :label="$t('Detail.index.838702-13')" name="openId">
                  <a-input
                    v-model:value="form.openId"
                    :disabled="showDisabled"
                    :placeholder="$t('Detail.index.838702-14')"
                  />
                </a-form-item>
              </div>

              <a-form-item :label="$t('Detail.index.838702-15')" name="explain">
                <a-textarea
                  v-model:value="form.explain"
                  :placeholder="$t('Detail.index.838702-16')"
                  showCount
                  :rows="3"
                  :maxlength="200"
                />
              </a-form-item>
              <a-form-item>
                <a-divider />
                <a-button
                  :loading="saveBtnLoading"
                  type="primary"
                  @click="handleSave"
                >
                  {{ $t('Detail.index.838702-17') }}
                </a-button>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="10">
            <Doc :type="form.operatorName" />
          </a-col>
        </a-row>
      </a-card>
    </FullPage>
  </j-page-container>
</template>

<script lang="ts" setup>
import PlatformType from '../../components/PlatformType.vue'
import { queryById, save, update } from '../../../api/platform'
import Doc from '../doc/index.vue'
import { platformTypeList } from '../../data'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const router = useRouter()
const route = useRoute()

const formRef = ref()
const saveBtnLoading = ref<boolean>(false)

const form = reactive({
  operatorName: 'onelink',
  name: undefined,
  // onelink
  appId: undefined,
  passWord: undefined,
  apiAddr: undefined,
  // ctwing
  userId: undefined,
  secretKey: undefined,
  // unicom
  appSecret: undefined,
  openId: undefined,
  explain: undefined
})

const rules = {
  name: [
    { required: true, message: $t('Detail.index.838702-3') },
    { max: 64, message: $t('Detail.index.838702-18') }
  ],
  appId: [
    { required: true, message: $t('Detail.index.838702-4') },
    { max: 64, message: $t('Detail.index.838702-18') }
  ],
  passWord: [
    { required: true, message: $t('Detail.index.838702-5') },
    { max: 64, message: $t('Detail.index.838702-18') }
  ],
  apiAddr: [{ required: true, message: $t('Detail.index.838702-7') }],
  userId: [
    { required: true, message: $t('Detail.index.838702-19') },
    { max: 64, message: $t('Detail.index.838702-18') }
  ],
  secretKey: [
    { required: true, message: $t('Detail.index.838702-11') },
    { max: 64, message: $t('Detail.index.838702-18') }
  ],
  appSecret: [
    { required: true, message: $t('Detail.index.838702-12') },
    { max: 64, message: $t('Detail.index.838702-18') }
  ],
  openId: [
    { required: true, message: $t('Detail.index.838702-14') },
    { max: 64, message: $t('Detail.index.838702-18') }
  ],
  explain: [{ required: false, max: 200, message: $t('Detail.index.838702-20') }]
}

const showDisabled = computed(() => {
  return route.params.id !== ':id'
})

const getDetail = async () => {
  if (route.params.id === ':id') return
  const resp: any = await queryById(route.params.id)
  if (resp.status === 200) {
    Object.assign(form, resp.result, { ...resp.result.config })
  }
}

const typeChange = (val: any) => {
  formRef.value.resetFields()
  form.operatorName = val
}

const handleSave = async () => {
  const data: any = await formRef.value.validate()
  const formData = {
    operatorName: data.operatorName,
    name: data.name,
    config: {
      appId: data.appId,
      passWord: data.passWord,
      apiAddr: data.apiAddr,
      userId: data.userId,
      secretKey: data.secretKey,
      appSecret: data.appSecret,
      openId: data.openId
    },
    explain: data.explain
  }
  saveBtnLoading.value = true

  const res: any =
    route.params.id === ':id'
      ? await save(formData)
      : await update({ id: route.params.id, ...formData })
  if (res.status === 200) {
    onlyMessage($t('Detail.index.838702-21'))
    router.back()
  }
  saveBtnLoading.value = false
}

getDetail()
</script>
