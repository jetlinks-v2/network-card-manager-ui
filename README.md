# 物联卡管理前端模块

运行时前端模块，菜单定义见 `baseMenu.json`，页面入口位于 `views/`。

## 搜索与页面布局约定

已完成模块内搜索与布局统一，任务级别：M。

模块内 13 处旧搜索均使用现有 `ConditionFilter`；搜索和对应列表的操作按钮放入 `j-pro-table` 的 `headerLeftRender` 插槽；14 处 `j-pro-table` 均带有 `pro-table__no-padding`；4 处左右主内容布局采用 `EqualHeightColumns`。

### 影响范围

- Owning module：`runtime-ui/modules/network-card-manager-ui`。
- 菜单主页面：`views/CardManagement/index.vue`、`views/TrafficPoolManagement/index.vue`、`views/RealtimePositioning/index.vue`、`views/Recharge/index.vue`、`views/Platform/index.vue`、`views/Record/index.vue`。
- 同步覆盖模块内已有搜索和表格的详情页、同步记录、设备选择弹窗及定位历史列表，避免遗留旧搜索入口和表格内边距。
- 左右布局入口：`views/RealtimePositioning/index.vue`、`views/TrafficPoolManagement/Detail/CardList/index.vue`、`views/Platform/Detail/index.vue`、`views/TrafficPoolManagement/components/AlarmRule/index.vue`。统计卡、字段行和普通栅格保留原布局。

### 实现约定

1. 复用 `runtime-ui/jetlinks-web-core/src/components/ConditionFilter` 的 `columns` 与兼容 `search` 事件，保留原有 `columns.search`、字段重命名、枚举、异步选项、时间条件和搜索回调参数语义。移除旧搜索专用的 `target`、`type` 和间距样式。
2. 搜索及列表操作按钮组合到对应表格的 `headerLeftRender`；卡片列表使用同一列表组件的头部插槽。搜索与按钮并排时使用可换行的 `a-flex`，筛选区域可伸缩。
3. 表格统一使用 `pro-table__no-padding`，替代重复的行内表格 padding；新增、批量操作、权限控制及原有请求条件保持原行为。实时定位列表保留原有 ICCID/卡号组合搜索，并将其和批量定位按钮移入表格头部。
4. 左右内容复用 `EqualHeightColumns` 的 `left` / `right` 插槽，保留原列宽和高度，侧栏内容独立滚动，关闭额外的折叠操作。流量池卡列表仅在批量绑定时展开右侧 400px 面板；平台接入表单保持自然高度。
5. `views/TrafficPoolManagement/Detail/CardList/AddDevice/All.vue` 的产品筛选修正为调用现有 `queryProductNoPagingPost`，避免原先未定义的查询函数导致异步选项加载失败。

### 边界与风险

- 不修改运营端 `ui/`、后端接口、菜单、路由或权限定义；不重构无关业务逻辑和统计展示。
- 保持当前搜索字段、请求条件、分页排序、卡片/表格模式和批量选择行为。
- 重点验证原搜索参数结构、异步选项标签回显、日期条件、列表头部换行，以及左右区域滚动与地图尺寸。

### 验证结果

- 静态结构检查通过：13 处 `ConditionFilter` 均位于对应表格的 `headerLeftRender`；14 处表格均带目标 class；无旧搜索遗留；4 处左右布局使用现有组件。
- 17 个改动 Vue 文件的 SFC 模板编译、脚本转译及 7 个样式块编译通过；16 个文件的业务脚本与改动前一致，另一处仅修正上述产品查询函数。`git diff --check` 通过。
- `pnpm -C runtime-ui exec vue-tsc --noEmit -p modules/network-card-manager-ui/tsconfig.json`：修改前后均为 207 项既有诊断，忽略行号位移后完全一致，未新增类型错误；完整类型检查仍未通过，修复既有诊断后需重跑该命令。
- 在 `runtime-ui/jetlinks-web-core` 执行 `node --test tests/conditionFilterScheduling.test.mjs`：11 项现有回归全部通过。
- `pnpm -C runtime-ui --filter jetlinks-web-core build -- --module-name network-card-manager-ui`：生产构建通过，转换 8,929 个模块；共享构建配置仍有输出参数与大包告警。未运行全量应用构建，发布前可执行 `pnpm -C runtime-ui build`。
- 当前工作区与本模块没有可用的 lint 脚本或 ESLint 配置，未执行 lint。
- 实页验证受本地环境限制：`http://192.168.35.97:9201/#/resources/sim/cards` 返回 404，`localhost:9201` 跳转登录页。查询/清空、远程选项、按钮与批量选择、卡片/表格切换、左右等高、内部滚动和地图尺寸尚未完成真实数据验证；需在已登录且已加载本模块菜单的运行时环境补验。
