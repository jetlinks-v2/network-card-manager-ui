<template>
  <div v-if="type === 'onelink'" class="doc">
    <div class="url">
      {{ $t('doc.index.838701-0') }}
      <a
        style="word-break: break-all"
        href="https://api.iot.10086.cn/api/index.html#/login"
        target="_blank"
        rel="noreferrer"
      >
        https://api.iot.10086.cn/api/index.html#/login
      </a>
    </div>
    <h1>{{ $t('doc.index.838701-1') }}</h1>
    <p>
      {{ $t('doc.index.838701-2') }}
    </p>
    <h1>{{ $t('doc.index.838701-3') }}</h1>
    <h2>1、APP ID</h2>
    <p>
      {{ $t('doc.index.838701-4') }}
      {{ $t('doc.index.838701-5') }}
      <br />
      {{ $t('doc.index.838701-6') }}
    </p>
    <div class="image">
      <a-image width="100%" :src="iotCard.onelinkAppid" />
    </div>
    <h2>2、Password</h2>
    <p>
      {{ $t('doc.index.838701-7') }}
      <br />
      {{ $t('doc.index.838701-6') }}
    </p>
    <div class="image">
      <a-image width="100%" :src="iotCard.onelinkPass" />
    </div>
    <h2>{{ $t('doc.index.838701-8') }}</h2>
    <p>
      https://api.iot.10086.cn/v5/ec/get/token
      <br />
      {{ $t('doc.index.838701-9') }}
      <br />
      {{ $t('doc.index.838701-10') }}
    </p>
  </div>

  <div v-if="type === 'ctwing'" class="doc">
    <div class="url">
      {{ $t('doc.index.838701-11') }}
      <a
        style="word-break: break-all"
        href="https://cmp.ctwing.cn:4821/login"
        target="_blank"
        rel="noreferrer"
      >
        https://cmp.ctwing.cn:4821/login
      </a>
    </div>
    <div>
      <h1>{{ $t('doc.index.838701-1') }}</h1>
      <p>
        {{ $t('doc.index.838701-2') }}
      </p>
      <h1>{{ $t('doc.index.838701-3') }}</h1>
      <h2>{{ $t('doc.index.838701-12') }}</h2>
      <p>
        {{ $t('doc.index.838701-13') }}
        <br />
        {{ $t('doc.index.838701-14') }}
      </p>
      <div class="image">
        <a-image width="100%" :src="iotCard.ctwingId" />
      </div>

      <h2>{{ $t('doc.index.838701-15') }}</h2>
      <p>
        {{ $t('doc.index.838701-16') }}
        <br />
        {{ $t('doc.index.838701-14') }}
      </p>
      <div class="image">
        <a-image width="100%" :src="iotCard.ctwingPass" />
      </div>

      <h2>3、secretKey</h2>
      <p>
        {{ $t('doc.index.838701-17') }}
        <br />
        {{ $t('doc.index.838701-14') }}
      </p>
      <div class="image">
        <a-image width="100%" :src="iotCard.ctwingSecret" />
      </div>
    </div>
  </div>

  <div v-if="type === 'unicom'" class="doc">
    <div class="url">
      {{ $t('doc.index.838701-18') }}
      <a
        style="word-break: break-all"
        href="  https://cmp.10646.cn/webframe/login"
        target="_blank"
        rel="noreferrer"
      >
        https://cmp.10646.cn/webframe/login
      </a>
    </div>

    <div>
      <h1>{{ $t('doc.index.838701-1') }}</h1>
      <p>
        {{ $t('doc.index.838701-2') }}
      </p>
      <h1>{{ $t('doc.index.838701-3') }}</h1>
      <h2>1、APP ID</h2>
      <p>
        {{ $t('doc.index.838701-19') }}
        <br />
        {{ $t('doc.index.838701-20') }}
      </p>
      <div class="image">
        <a-image width="100%" :src="iotCard.unicomId" />
      </div>

      <h2>2、App Secret</h2>
      <p>
        {{ $t('doc.index.838701-21') }}
        <br />
        {{ $t('doc.index.838701-20') }}
      </p>
      <div class="image">
        <a-image width="100%" :src="iotCard.unicomSecret" />
      </div>

      <h2>{{ $t('doc.index.838701-22') }}</h2>
      <p>
        {{ $t('doc.index.838701-23') }}
        <br />
        {{ $t('doc.index.838701-20') }}
        <br />
      </p>
      <div class="image">
        <a-image width="100%" :src="iotCard.unicomOpenid" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { iotCard } from '../../../assets'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
  type: { type: String, default: 'onelink' }
})
</script>

<style scoped lang="less">
.doc {
  height: 800px;
  padding: 24px;
  overflow-y: auto;
  color: rgba(#000, 0.8);
  font-size: 14px;
  background-color: #fafafa;

  .url {
    padding: 8px 16px;
    color: #2f54eb;
    background-color: rgba(#a7bdf7, 0.2);
  }

  h1 {
    margin: 16px 0;
    color: rgba(#000, 0.85);
    font-weight: bold;
    font-size: 14px;

    // &:first-child {
    //     margin-top: 0;
    // }
  }

  h2 {
    margin: 6px 0;
    color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
  }

  .image {
    margin: 16px 0;
  }
}
</style>
