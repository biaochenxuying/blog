import React from 'react';
import { Button, Divider, Popconfirm } from 'antd';

import {
    EmployeeInfo,
    DeleteRequest
} from '../../interface/employee';

const getColunms = (
    handleUpdate: (record: EmployeeInfo) => void,
    handleDelete: (record: DeleteRequest) => void
) => {
    return [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '部门',
            dataIndex: 'department',
            key: 'department'
        }, {
            title: '入职时间',
            dataIndex: 'hiredate',
            key: 'hiredate'
        }, {
            title: '职级',
            dataIndex: 'level',
            key: 'level'
        }, {
            title: '操作',
            key: 'action',
            render: (text: string, record: EmployeeInfo) => (
                <span>
                    <Button size="small" icon="edit" onClick={() => {handleUpdate(record)}}>编辑</Button>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={`确定删除 ${record.name} 吗？`}
                        onConfirm={() => {handleDelete({id: record.id})}}
                    >
                        <Button size="small" type="danger" icon="delete">删除</Button>
                    </Popconfirm>
                </span>
            )
        }
    ]
};

export default getColunms;