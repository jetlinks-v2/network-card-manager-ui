<template>
  <!-- {{ $t('CardManagement.Import.427945-0') }} -->
  <a-modal
    :maskClosable="false"
    :visible="true"
    :title="$t('CardManagement.Import.427945-0')"
    :okText="$t('CardManagement.Import.427945-1')"
    :cancelText="$t('CardManagement.Import.427945-2')"
    @cancel="handleCancel"
  >
    <div style="margin-top: 10px">
      <a-form
        :layout="'vertical'"
        :model="modelRef"
        ref="formRef"
        :rules="rules"
      >
        <a-form-item
          :label="$t('CardManagement.Import.427945-3')"
          required
          name="configId"
        >
          <a-select
            showSearch
            v-model:value="modelRef.configId"
            :options="configList"
            :placeholder="$t('CardManagement.Import.427945-4')"
            optionFilterProp="label"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          v-if="modelRef.configId"
          :label="$t('CardManagement.Import.427945-5')"
        >
          <a-radio-group
            button-style="solid"
            v-model:value="modelRef.fileType"
            :placeholder="$t('CardManagement.Import.427945-6')"
          >
            <a-radio-button value="xlsx">xlsx</a-radio-button>
            <a-radio-button value="csv">csv</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :label="$t('CardManagement.Import.427945-7')"
          v-if="modelRef.configId"
        >
          <UploadFile
            :product="modelRef.configId"
            v-model="modelRef.upload"
            :file="modelRef.fileType"
          />
        </a-form-item>
      </a-form>
      <!-- <j-form-item :label="$t('CardManagement.Import.427945-7')" v-if="modelRef.configId">
                    <j-upload
                        v-model:fileList="modelRef.upload"
                        name="file"
                        :action="FILE_UPLOAD"
                        :headers="{
                            'X-Access-Token': LocalStore.get(TOKEN_KEY),
                        }"
                        :accept="`.${modelRef.fileType || 'xlsx'}`"
                        :showUploadList="false"
                        @change="fileChange"
                    >
                        <j-button :loading="loading">
                            <template #icon>
                                <AIcon type="UploadOutlined" />
                            </template>
                            {{ $t('CardManagement.Import.427945-7') }}
                        </j-button>
                    </j-upload>
                </j-form-item>
                <j-form-item v-if="modelRef.configId" label="下载模板">
                    <j-space>
                        <j-button icon="file" @click="downFileFn('xlsx')">
                            .xlsx
                        </j-button>
                        <j-button icon="file" @click="downFileFn('csv')">
                            .csv
                        </j-button>
                    </j-space>
                </j-form-item>
                <div v-if="totalCount">
                    <a-icon class="check-num" type="check" /> 已完成 总数量
                    <span class="check-num">{{ totalCount }}</span>
                </div>
                <div v-if="errCount">
                    <a-icon class="check-num" style="color: red" type="close" />
                    失败 总数量
                    <span class="check-num">{{ errCount }}</span>
                </div> -->
    </div>
    <template #footer>
      <a-button type="primary" @click="handleOk">{{
        $t("CardManagement.Import.427945-8")
      }}</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { queryPlatformNoPage } from "../../api/cardManagement";
import UploadFile from "./UploadFile.vue";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const emit = defineEmits(["close", "save"]);

const configList = ref<Record<string, any>[]>([]);
// const loading = ref<boolean>(false);
// const totalCount = ref<number>(0);
// const errCount = ref<number>(0);
const formRef = ref(null);
// const importStatus = ref(false);
const modelRef = reactive({
  configId: undefined,
  upload: [],
  fileType: "xlsx",
});

const rules = {
  configId: [{ required: true, message: $t("CardManagement.Import.427945-4") }],
};

const getConfig = async () => {
  const resp: any = await queryPlatformNoPage({
    paging: false,
    terms: [
      {
        terms: [
          {
            column: "state",
            termType: "eq",
            value: "enabled",
            type: "and",
          },
        ],
      },
    ],
  });
  configList.value = resp.result.map((item: any) => {
    return { key: item.id, label: item.name, value: item.id };
  });
};

// const fileChange = (info: any) => {
//     loading.value = true;
//     if (info.file.status === 'done') {
//         const r = info.file.response || { result: '' };
// _import(modelRef.configId, { fileUrl: r.result })
//     .then((resp: any) => {
//         totalCount.value = resp.result.total;
//         importStatus.value = true;
//         onlyMessage('导入成功');
//     })
//     .catch((err) => {
//         onlyMessage(err.response.data.message || '导入失败', 'error');
//     })
//     .finally(() => {
//         loading.value = false;
//     });
//     }
// };

// const downFileFn = async (type: string) => {
//     // const url = `${BASE_API_PATH}/network/card/template.${type}`;
//     // downloadFile(url);
//     const res: any = await exportCard(type);
//     if (res) {
//         const blob = new Blob([res], { type: type });
//         const url = URL.createObjectURL(blob);
//         console.log(url);
//         downloadFileByUrl(url, `物联卡导入模板`, type);
//     }
// };

const handleCancel = () => {
  // totalCount.value = 0;
  // errCount.value = 0;
  modelRef.configId = undefined;

  emit("close", true);
  // if (importStatus.value) {
  //     emit('save', true);
  // }
  // importStatus.value = false;
};

const handleOk = () => {
  modelRef.configId = undefined;
  emit("save", true);
};

getConfig();
</script>

<style scoped lang="less">
.check-num {
  margin: 6px;
  color: @primary-color;
}
</style>
