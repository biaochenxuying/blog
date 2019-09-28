import React, { Component } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';

import { EmployeeInfo, CreateRequest, UpdateRequest } from '../../interface/employee';

const { Option } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    edit: boolean;
    rowData: Partial<EmployeeInfo>;
    hide(): void;
    createData(param: CreateRequest, callback: () => void): void;
    updateData(param: UpdateRequest, callback: () => void): void;
}

interface State {
    confirmLoading: boolean
}

class InfoModal extends Component<Props, State> {
    state: State = {
        confirmLoading: false
    }
    handleOk = () => {
        this.props.form.validateFields((err) => {
            if (!err) {
                this.setState({
                    confirmLoading: true
                });

                let param = this.props.form.getFieldsValue();
                param.hiredate = param.hiredate.format('YYYY-MM-DD');

                if (!this.props.edit) {
                    this.props.createData(param as CreateRequest, this.close);
                } else {
                    param.id = this.props.rowData.id;
                    this.props.updateData(param as UpdateRequest, this.close);
                }
            }
        });
    }
    handleCancel = () => {
        this.close();
    }
    close = () => {
        this.props.hide();
        this.setState({
            confirmLoading: false
        });
    }
    render() {
        let title = this.props.edit ? '编辑' : '添加新员工';
        const { getFieldDecorator } = this.props.form;
        let { name, departmentId, hiredate, levelId } = this.props.rowData;
        
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={this.state.confirmLoading}
                destroyOnClose={true}
            >
                <Form>
                    <Form.Item>
                        { getFieldDecorator("name", {
                            initialValue: name,
                            rules: [{ required: true, whitespace: true, message: '请输入姓名' }]
                        })(<Input
                            placeholder="姓名"
                            style={{ width: 200 }}
                            maxLength={20}
                            allowClear
                        />)}
                    </Form.Item>
                    <Form.Item>
                        { getFieldDecorator("departmentId", {
                            initialValue: departmentId,
                            rules: [{ required: true, message: '请选择部门' }]
                        })(<Select
                            placeholder="部门"
                            style={{ width: 200 }}
                            allowClear
                        >
                            <Option value={1}>技术部</Option>
                            <Option value={2}>产品部</Option>
                            <Option value={3}>市场部</Option>
                            <Option value={4}>运营部</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item>
                        { getFieldDecorator("hiredate", {
                            initialValue: hiredate ? moment(hiredate) : undefined,
                            rules: [{ required: true, message: '请选择入职日期' }]
                        })(<DatePicker
                            placeholder="入职日期"
                            style={{ width: 200 }}
                        />)}
                    </Form.Item>
                    <Form.Item>
                        { getFieldDecorator("levelId", {
                            initialValue: levelId,
                            rules: [{ required: true, message: '请选择职级' }]
                        })(<Select
                            placeholder="职级"
                            style={{ width: 200 }}
                            allowClear
                        >
                            <Option value={1}>1级</Option>
                            <Option value={2}>2级</Option>
                            <Option value={3}>3级</Option>
                            <Option value={4}>4级</Option>
                            <Option value={5}>5级</Option>
                        </Select>)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
const WrapInfoModal = Form.create<Props>({
    name: 'employee_info'
})(InfoModal);

export default WrapInfoModal;
