# 物联卡管理前端模块

运行时前端模块，菜单定义见 `baseMenu.json`，页面入口位于 `views/`。

## 平台接入详情返回入口

- 局部调整（S）：在 `views/Platform/Detail/index.vue` 左上角复用设备详情的 `PageChrome`、左箭头和文字按钮，返回平台接入列表。通过现有菜单 Store 的 `jumpPage('iot-card/Platform')` 解析真实菜单地址，并保留当前查询参数；不依赖浏览历史。
- 范围仅为本模块详情页与中英日语言资源；保留已有表单、保存、权限及路由定义。详情页共 279 行，未新增组件或业务抽象。
- 验证：`node ../ui/scripts/check-ui-style.mjs --files modules/network-card-manager-ui/views/Platform/Detail/index.vue` 与 `git diff --check` 通过；`node node_modules/vue-tsc/bin/vue-tsc.js --noEmit -p modules/network-card-manager-ui/tsconfig.json` 改前、改后均为 234 项既有诊断，忽略行号后完全一致，无新增错误。Node 22.18.0 下模块生产构建通过（在 `runtime-ui/jetlinks-web-core` 执行 `node --max-old-space-size=8192 ../node_modules/vite/bin/vite.js build --outDir /tmp/platform-back-module-build -- --module-name network-card-manager-ui`），仍有既有 CSS 与大包告警；无独立 lint 脚本，未执行全量应用构建。
- 浏览器：在已登录的 `localhost:9200` 验证现有平台详情与新增页面均显示面板外返回按钮，点击均回到 `/resources/sim/integrations` 列表；未提交表单或更改业务数据。作者 Review：PASS，改动符合局部复用范围，未改变公共组件或后端契约。

## 物联卡与平台接入列表新版布局

### 目标与范围

- 已按确认方案完成（M）：参考[平台接入原型](https://jetlinks-ai-new.ez7268-453.workers.dev/midhub/res/sim/access)及物联卡管理页 `/midhub/res/sim/card`，移除两页的卡片展示与模式切换，固定为紧凑表格。
- Owning module：`runtime-ui/modules/network-card-manager-ui`；入口为 `views/CardManagement/index.vue`、`views/Platform/index.vue`。不修改运营端 `ui/`、后端、菜单、路由、权限定义及其他业务页面。
- 复用现有表格、`ConditionFilter`、`SwitchGroup`、`TableActions`、`BatchDropdown` 与原新增/编辑/详情流程，不新增模块或修改公共组件契约。
- 平台接入截图校准（S，已完成）：在已确认表格方案内补齐伸展搜索栏、蓝色选中分组、平台彩色标签、状态胶囊、图标编辑和“新增平台接入”文案；补充说明字段筛选。仅调整平台展示及模块内组件配置，不改变权限与业务动作；搜索继续复用统一条件筛选。样式门禁（4 个文件）、3 个 SFC 脚本/模板编译及生产构建通过，类型检查仍为 249 项既有诊断且无新增；模拟页面确认说明筛选、空结果与清空恢复正常。
- 物联卡截图校准（S，已完成）：复用平台接入已对齐的伸展搜索、蓝色状态组、状态胶囊与图标动作；流量条改为剩余量/总量，条在上、说明在下，剩余不超过 20% 使用红色视觉提示，不新增告警规则。保留真实同步枚举、原批量操作与权限；补充名称筛选。9 项回归、5 个文件样式门禁及生产构建通过，类型诊断仍为 249 项且无新增；模拟页面验证名称筛选/计数、清空恢复、正常/低余额进度以及平台共享样式。原型宽度 1659px 下工具栏和 8 列完整显示，默认 1280px 下支持横向滚动。
- 字号统一（S，已完成）：以 `device-manager-ui/views/device/list/unified/index.vue` 的原生表格、名称按钮和 `<small>` 为样式锚点，使用 `jetlinks-web-core/src/hooks/useResponsiveAntdToken.ts` 注入的组件主题（基础字号 14），移除本模块强制 16px 的正文、表头、名称和工具栏覆盖；状态字号继承表格，卡号及流量说明采用与设备辅助文字相同的 `<small>` 层级。保留名称 600 字重及现有布局，不改共享主题、设备页面或业务逻辑。标准文档模式下，Chrome 同主题模拟预览确认两页表头、正文、名称、状态及快捷筛选均为 14px，名称字重 600，与设备列表样式参照一致；卡号与流量说明均采用 `<small>` 相对字号，类型标签沿用原生标签层级。4 个文件样式门禁、4 个 SFC 编译、LESS 编译、9 项回归及 `git diff --check` 通过。本次仅模板语义和样式调整，复用前次通过的生产构建及 249 项既有类型诊断证据，未重跑全量构建或类型检查；未验证真实业务接口。

### 已确认的方案档案

- 业务任务 / 推荐方案：检索、比较和维护多张物联卡或平台配置，采用原型对齐的标准管理表格页；用户已确认运行时边界及实施方案。
- 主筛选：保留原复杂查询字段与异步选项；左侧为搜索及状态切换，右侧为新增和物联卡批量操作。物联卡状态为全部 / 同步成功 / 同步失败，平台为全部 / 启用 / 禁用。
- 信息密度：物联卡 8 列（名称/卡号、ICCID、平台、套餐、绑定设备、同步状态、流量、操作），平台 5 列（名称、类型、状态、说明、操作），底部分页。窄窗口支持横向滚动。
- 编辑梯度：名称进入原详情；行内编辑，其他动作进入更多；新增/编辑、绑定、导入导出及同步复用原载体，启停和删除保留权限、禁用条件与确认交互。
- 核心组件与状态锚点：`j-pro-table` 固定 `mode="TABLE"`；`ConditionFilter` + `SwitchGroup` 驱动查询，`TableActions` 收纳次要动作；选择项仍由原 `BatchDropdown` 编排。
- 不借鉴清单 / 替代方案：不采用卡片墙、主从侧栏或装饰统计卡，不复制原型导航、示例数据及静态计数。

```text
┌───────────────────────────────────────────────────────────┐
│ 条件搜索  全部 / 成功 / 失败（或启用 / 禁用）   批量  +新增 │
├───────────────────────────────────────────────────────────┤
│ 名称 / 卡号 │ 平台 / 类型 │ 状态 │ 业务字段 │ 编辑 · 更多 │
│ …真实记录、状态标记、流量信息…                             │
├───────────────────────────────────────────────────────────┤
│                                 共 N 条  页码  每页条数   │
└───────────────────────────────────────────────────────────┘
```

### 实现入口与数据语义

1. `views/CardManagement/hooks/`、`views/Platform/hooks/` 承载列配置和原业务动作；Vue 页面只编排表格和原弹窗，均小于 300 行。
2. `views/components/list/` 复用带筛选图标的伸展搜索栏、蓝色状态切换组、状态胶囊、计数生命周期、查询组合与权限操作展示。快捷状态以 AND 连接完整搜索表达式，保留原 OR 分组和 `flowError` 空值条件。
3. 物联卡计数使用现有 `api/cardManagement.ts` 的 `queryCount`；平台计数使用 `api/platform.ts` 分页查询的真实 `total`（`pageSize: 1`）。计数继承搜索但独立于当前快捷状态；请求失败显示 `—`，过期响应不覆盖新查询。列表失败提供重试入口。
4. `views/CardManagement/flow.ts` 和 `FlowUsage.vue` 以剩余/总量展示进度，条下汇总剩余、总量与已用；区分单卡与流量池字段，保护零值、缺失值和零分母。名称缺失时回退卡号；同步枚举继续使用后端值，不将运营商卡状态混入同步状态。
5. 中英文新增文案位于 `locales/lang/zh.json`、`locales/lang/en.json`；权限继续使用 `iot-card/CardManagement:*` 和 `iot-card/Platform:*`。平台启用时仍禁止删除。

### 验证结果与剩余风险

- `node --test tests/listLayout.test.mjs`：9/9 通过，覆盖 OR 查询组合、空值规范化、零值/缺失/流量池、剩余占比及 20% 颜色边界、真实计数、过期响应与失败重试。
- 从 `runtime-ui/` 执行 `node ../ui/scripts/check-ui-style.mjs --files <本次 6 个 Vue/LESS 文件>`：6 个文件通过。模块无可用 lint 脚本或 ESLint 配置，未执行 lint。
- 从 `runtime-ui/` 执行 `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit -p modules/network-card-manager-ui/tsconfig.json`：改前 254 项、改后 249 项诊断；忽略行号位移后无新增诊断。完整类型检查仍未通过，既有错误需后续修复。
- 从 `runtime-ui/jetlinks-web-core/` 执行 `node --max-old-space-size=8192 --max-semi-space-size=64 ../node_modules/vite/bin/vite.js build --outDir /tmp/sim-layout-module-build -- --module-name network-card-manager-ui`：最终生产模块构建通过，转换 8,355 个模块；已有 Rollup 配置、CSS 与大包告警。未执行全量运行时应用构建。
- 上述前端命令使用本机 Node 22.18.0（`/Users/hukaiyu/.nvm/versions/node/v22.18.0/bin/node`）；当前 shell 默认 Node 18 无法运行现有 Vite，不为此更改项目配置。
- 浏览器使用真实页面与共享组件、模拟接口和导航验证：表格展示、搜索/清空与快捷状态组合、计数、分页、详情跳转、更多操作、平台启用时删除禁用、失败重试、批量勾选/取消、中英文及名称/卡号分行正常。
- 本机 `localhost:9201` 不可连接，真实登录环境下的接口权限范围、远程选项、保存/导入导出、绑定和启停等持久化操作尚未联调；预览中的权限切换模拟未形成有效证据。需启动并登录运行时环境，按不同权限账号补验上述行为。模拟预览不替代真实接口验收。
- 作者 Review：意图、模块范围、真实枚举、查询语义、权限绑定与共享组件边界已核对；未新增后端契约。`git diff --check` 通过。

## 搜索与页面布局约定

已完成模块内搜索与布局统一，任务级别：M。

模块内 13 处旧搜索均使用现有 `ConditionFilter`；搜索放入 `j-pro-table` 的 `headerLeftRender` 插槽；物联卡与平台接入列表的操作按钮按上节放入右侧，其余页面沿用原头部布局；14 处 `j-pro-table` 均带有 `pro-table__no-padding`；4 处左右主内容布局采用 `EqualHeightColumns`。

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
- 保持当前搜索字段、请求条件、分页排序和批量选择行为；除物联卡、平台接入固定为表格外，其他页面保留原卡片/表格模式。
- 重点验证原搜索参数结构、异步选项标签回显、日期条件、列表头部换行，以及左右区域滚动与地图尺寸。

### 验证结果

- 静态结构检查通过：13 处 `ConditionFilter` 均位于对应表格的 `headerLeftRender`；14 处表格均带目标 class；无旧搜索遗留；4 处左右布局使用现有组件。
- 17 个改动 Vue 文件的 SFC 模板编译、脚本转译及 7 个样式块编译通过；16 个文件的业务脚本与改动前一致，另一处仅修正上述产品查询函数。`git diff --check` 通过。
- `pnpm -C runtime-ui exec vue-tsc --noEmit -p modules/network-card-manager-ui/tsconfig.json`：修改前后均为 207 项既有诊断，忽略行号位移后完全一致，未新增类型错误；完整类型检查仍未通过，修复既有诊断后需重跑该命令。
- 在 `runtime-ui/jetlinks-web-core` 执行 `node --test tests/conditionFilterScheduling.test.mjs`：11 项现有回归全部通过。
- `pnpm -C runtime-ui --filter jetlinks-web-core build -- --module-name network-card-manager-ui`：生产构建通过，转换 8,929 个模块；共享构建配置仍有输出参数与大包告警。未运行全量应用构建，发布前可执行 `pnpm -C runtime-ui build`。
- 当前工作区与本模块没有可用的 lint 脚本或 ESLint 配置，未执行 lint。
- 实页验证受本地环境限制：`http://192.168.35.97:9201/#/resources/sim/cards` 返回 404，`localhost:9201` 跳转登录页。查询/清空、远程选项、按钮与批量选择、卡片/表格切换、左右等高、内部滚动和地图尺寸尚未完成真实数据验证；需在已登录且已加载本模块菜单的运行时环境补验。
