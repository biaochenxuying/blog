import React, { Component } from 'react';
import { Table, Button } from 'antd';

import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import './index.css';

import QueryForm from './QueryForm';
import InfoModal from './InfoModal';

import getColunms from './colums';
import { DOWNLOAD_EMPLOYEE_URL } from '../../constants/urls';
import {
    EmployeeInfo,
    EmployeeRequest,
    EmployeeResponse,
    CreateRequest,
    DeleteRequest,
    UpdateRequest
} from '../../interface/employee';
import {
    getEmployee,
    createEmployee,
    deleteEmployee,
    updateEmployee
} from '../../redux/employee';

interface Props {
    onGetEmployee(param: EmployeeRequest, callback: () => void): void;
    onCreateEmployee(param: CreateRequest, callback: () => void): void;
    onDeleteEmployee(param: DeleteRequest): void;
    onUpdateEmployee(param: UpdateRequest, callback: () => void): void;
    employeeList: EmployeeResponse;
}

interface State {
    loading: boolean;
    showModal: boolean;
    edit: boolean;
    rowData: Partial<EmployeeInfo>;
}

class Employee extends Component<Props, State> {
    state: State = {
        loading: false,
        showModal: false,
        edit: false,
        rowData: {}
    }
    setLoading = (loading: boolean) => {
        this.setState({
            loading
        })
    }
    hideModal = () => {
        this.setState({
            showModal: false,
            rowData: {}
        })
    }
    handleCreate = () => {
        this.setState({
            showModal: true,
            edit: false,
            rowData: {}
        });
    }
    handleDelete = (param: DeleteRequest) => {
        this.props.onDeleteEmployee(param)
    }
    handleUpdate = (record: EmployeeInfo) => {
        this.setState({
            showModal: true,
            edit: true,
            rowData: record
        });
    }
    handleDownload = () => {
        window.open(DOWNLOAD_EMPLOYEE_URL);
    }
    render() {
        const {
            employeeList,
            onGetEmployee,
            onCreateEmployee,
            onUpdateEmployee
        } = this.props;
        return (
            <>
                <QueryForm getData={onGetEmployee} setLoading={this.setLoading} />
                <div className="toolbar">
                    <Button type="primary" icon="plus" onClick={this.handleCreate}>添加新员工</Button>
                    <Button type="primary" icon="download" onClick={this.handleDownload} className="right">导出</Button>
                </div>
                <InfoModal
                    visible={this.state.showModal}
                    edit={this.state.edit}
                    rowData={this.state.rowData}
                    hide={this.hideModal}
                    createData={onCreateEmployee}
                    updateData={onUpdateEmployee}
                />
                <Table
                    columns={getColunms(this.handleUpdate, this.handleDelete)}
                    dataSource={employeeList}
                    loading={this.state.loading}
                    className="table"
                    pagination={false}
                />
            </>
        )
    }
}

const mapStateToProps = (state: any) => ({
    employeeList: state.employee.employeeList
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    onGetEmployee: getEmployee,
    onCreateEmployee: createEmployee,
    onDeleteEmployee: deleteEmployee,
    onUpdateEmployee: updateEmployee
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Employee);
