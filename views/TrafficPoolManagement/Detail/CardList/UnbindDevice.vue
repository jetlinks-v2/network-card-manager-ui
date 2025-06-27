<template>
  <div class="unbind-device-list">
    <div class="header">
      <div class="title">未绑定设备列表</div>
      <a-button type="text" size="small" style="padding: 0">
        <AIcon type="PlusOutlined"/>
      </a-button>
      <a-dropdown>
        <AIcon type="MoreOutlined"/>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a-button danger type="text">清空</a-button>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-input-search />
    </div>
    <div class="content">
      <a-empty v-if="!dataSource.length" style="margin-top: 100px">
        点击「添加设备」按钮批量添加设备到此处，添加后可拖拽设备卡片到左侧线框中快速完成绑定
      </a-empty>
      <template v-else>
        <div v-for="(item, index) in dataSource" :key="item" class="list-item">
          <div class="list-item-title">temperature {{index}}</div>
          <div class="list-item-content">
            <div>ID<span>dfuisbohvfnudisohbfudi</span></div>
            <div>产品<span>温度传感器</span></div>
            <div>说明<span>--</span></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const dataSource = ref(new Array(10).fill(1))
</script>

<style lang="less" scoped>
.unbind-device-list {
  border: 1px solid #7f7f7f;
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
  padding: 8px;
  border: 1px solid #a6a6a6;
  border-radius: 8px;
  background-color: #f0f0f0;
  cursor: pointer;
  &:not(:last-child) {
    margin-bottom: 16px;
  }

  &-title {
    font-size: 16px;
  }
  &-content {
    display: flex;
    justify-content: space-between;
    color: #7f7f7f;

    span {
      margin-left: 8px;
      color: #000;
    }
  }
}
</style>
