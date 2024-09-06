export default [
    {
        code: 'iot-card',
        name: '物联卡',
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
                        permissions: [
                            {
                                permission: 'IotCard-management',
                                actions: ['export'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
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
