export default [
    {
        code: 'iot-card',
        name: '物联卡',
        i18nMessages: {
            name: {
                zh_CN: '物联卡',
                en_US: 'IoT Card',
            }
        },
        path: '5Hpl',
        id: '76d77b275aa60553e9ea1cb40677e9c2',
        sortIndex: 3,
        level: 1,
        owner: 'iot',
        url: '/iot-card',
        icon: 'icon-wulianka',
        permissions: [],
        children: [
            {
                path: '5Hpl-mghg',
                sortIndex: 1,
                level: 1,
                id: '899d4880929c3a8fc02068351f55316b',
                owner: 'iot',
                name: '首页',
                i18nMessages: {
                    name: {
                        zh_CN: '首页',
                        en_US: 'Home',
                    }
                },
                code: 'iot-card/Home',
                url: '/iot-card/Home',
                icon: 'icon-zhihuishequ',
                status: 1,
                showPage: ['network-flow', 'network-card'],
                permissions: [
                    {
                        permission: 'network-flow',
                        actions: ['query'],
                    },
                    {
                        permission: 'network-card',
                        actions: ['query'],
                    },
                ],
                accessSupport: { text: "间接支持", value: "indirect" },
                supportDataAccess: false,
                indirectMenus: ['1deaa9efc0fc37a8e8e81fa9d6540bc3']
            },
            {
                path: '5Hpl-4VFS',
                sortIndex: 2,
                level: 1,
                id: 'f2ea1793896fa5ecc816e975e07d4edb',
                owner: 'iot',
                name: '仪表盘',
                i18nMessages: {
                    name: {
                        zh_CN: '仪表盘',
                        en_US: 'Dashboard',
                    }
                },
                code: 'iot-card/Dashboard',
                url: '/iot-card/Dashboard',
                icon: 'icon-keshihua',
                showPage: ['network-flow'],
                permissions: [{ permission: 'network-flow', actions: ['query'] }],
                accessSupport: { text: "间接支持", value: "indirect" },
                supportDataAccess: false,
                indirectMenus: ['1deaa9efc0fc37a8e8e81fa9d6540bc3']
            },
            {
                path: '5Hpl-O2m8',
                sortIndex: 3,
                level: 2,
                id: '1deaa9efc0fc37a8e8e81fa9d6540bc3',
                owner: 'iot',
                name: '物联卡管理',
                i18nMessages: {
                    name: {
                        zh_CN: '物联卡管理',
                        en_US: 'IoT Card Management',
                    }
                },
                code: 'iot-card/CardManagement',
                url: '/iot-card/CardManagement',
                icon: 'icon-wuliankaguanli',
                status: 1,
                showPage: ['network-card'],
                permissions: [
                    {
                        permission: 'platform',
                        actions: ['query'],
                    },
                    {
                        permission: 'network-card',
                        actions: ['query'],
                    },
                    {
                        permission: 'network-flow',
                        actions: ['query'],
                    },
                ],
                buttons: [
                    {
                        id: 'sync',
                        name: '同步',
                        i18nMessages: {
                            zh_CN: '同步',
                            en_US: 'Sync',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['sync'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'import',
                        name: '导入',
                        i18nMessages: {
                            zh_CN: '导入',
                            en_US: 'Import',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['import'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'export',
                        name: '导出',
                        i18nMessages: {
                            zh_CN: '导出',
                            en_US: 'Export',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['export'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['export'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: '删除',
                            en_US: 'Delete',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['delete'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['delete'],
                            },
                        ],
                    },
                    {
                        id: 'active',
                        name: '激活',
                        i18nMessages: {
                            zh_CN: '激活',
                            en_US: 'Active',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['active'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'bind',
                        name: '绑定',
                        i18nMessages: {
                            zh_CN: '绑定',
                            en_US: 'Bind',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['action'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['save'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: '新增',
                            en_US: 'Add',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['save'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'action',
                        name: '启/禁用',
                        i18nMessages: {
                            zh_CN: '启/禁用',
                            en_US: 'Enable/Disable',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['save'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: '编辑',
                            en_US: 'Edit',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['save'],
                            },
                            {
                                permission: 'network-card',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: '查看',
                            en_US: 'View',
                        },
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: { text: "支持", value: "support" },
                supportDataAccess: true,
                assetType: 'networkCard'
            },
            {
                path: '5Hpl-ZjAG',
                sortIndex: 4,
                level: 2,
                id: 'e332ab7c3837fe08b86a6e4f16dd1dcc',
                owner: 'iot',
                name: '充值管理',
                i18nMessages: {
                    name: {
                        zh_CN: '充值管理',
                        en_US: 'Recharge management',
                    }
                },
                showPage: ['network-card'],
                code: 'iot-card/Recharge',
                url: '/iot-card/Recharge',
                icon: 'icon-chongzhiguanli',
                status: 1,
                permissions: [
                    {
                        permission: 'network-card',
                        actions: ['query', 'save'],
                    },
                ],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: '查看',
                            en_US: 'View',
                        },
                        permissions: [
                            {
                                permission: 'network-card',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'pay',
                        name: '充值',
                        i18nMessages: {
                            zh_CN: '充值',
                            en_US: 'Recharge',
                        },
                        permissions: [
                            {
                                permission: 'network-card',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'platform',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: { text: "间接支持", value: "indirect" },
                supportDataAccess: false,
                indirectMenus: ['febd4c4b452ece6bb1d760c25b37b75f']
            },
            {
                path: '5Hpl-eS9h',
                sortIndex: 5,
                level: 2,
                id: 'febd4c4b452ece6bb1d760c25b37b75f',
                owner: 'iot',
                name: '平台接入',
                i18nMessages: {
                    name: {
                        zh_CN: '平台接入',
                        en_US: 'Platform access',
                    }
                },
                code: 'iot-card/Platform',
                url: '/iot-card/Platform',
                icon: 'icon-pingtaiduijie',
                status: 1,
                showPage: ['platform'],
                permissions: [
                    {
                        permission: 'platform',
                        actions: ['query'],
                    },
                ],
                buttons: [
                    {
                        id: 'action',
                        name: '启/禁用',
                        i18nMessages: {
                            zh_CN: '启/禁用',
                            en_US: 'Enable/Disable',
                        },
                        permissions: [
                            {
                                permission: 'platform',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: '删除',
                            en_US: 'Delete',
                        },
                        permissions: [
                            {
                                permission: 'platform',
                                actions: ['delete'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: '编辑',
                            en_US: 'Edit',
                        },
                        permissions: [
                            {
                                permission: 'platform',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: '新增',
                            en_US: 'Add',
                        },
                        permissions: [
                            {
                                permission: 'platform',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: '查看',
                            en_US: 'View',
                        },
                        permissions: [
                            {
                                permission: 'platform',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: { text: "支持", value: "support" },
                supportDataAccess: true,
                assetType: 'networkCardPlatform'
            },
            {
                path: '5Hpl-cL34',
                sortIndex: 6,
                level: 1,
                id: 'c4dfe00c4d7ecfd327eaeb278546502e',
                owner: 'iot',
                name: '操作记录',
                i18nMessages: {
                    name: {
                        zh_CN: '操作记录',
                        en_US: 'Operation record',
                    }
                },
                code: 'iot-card/Record',
                url: '/iot-card/Record',
                icon: 'icon-tongzhijilu',
                status: 1,
                showPage: ['network-card'],
                permissions: [
                    {
                        permission: 'network-card',
                        actions: ['query'],
                    },
                ],
                accessSupport: { text: "不支持", value: "unsupported" },
                supportDataAccess: false
            },
        ],
    },
]
