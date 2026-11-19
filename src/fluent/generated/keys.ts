import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '5e2bf618af4c471c8408193ac3d9e9bc'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '021ca9a0907045898111323eb871389c'
                    }
                }
                composite: [
                    {
                        table: 'sys_security_acl_role'
                        id: '2c2868cb83e013107755c810feaad38b'
                        key: {
                            sys_security_acl: '9618e4cb83e013107755c810feaad3b5'
                            sys_user_role: {
                                id: '2831a114c611228501d4ea6c309d626d'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '2d3f1c4b83a013107755c810feaad32e'
                        key: {
                            name: 'x_1910001_triage_0.user'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '5171248f83a013107755c810feaad3e0'
                        key: {
                            name: 'x_1910001_triage_0_computers'
                            element: 'model'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '5e74fc03836413107755c810feaad348'
                        key: {
                            id: 'service_portal_triage'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'a53f1c4b83a013107755c810feaad321'
                        key: {
                            name: 'x_1910001_triage_0.admin'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'bbb0e80f83a013107755c810feaad380'
                        key: {
                            name: 'x_1910001_triage_0.hardware'
                        }
                    },
                ]
            }
        }
    }
}
