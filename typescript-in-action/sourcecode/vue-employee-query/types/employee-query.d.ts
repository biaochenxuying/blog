import Vue from 'vue';

declare class EmployeeQuery extends Vue {
    name: string
    selected: number
    department: { department: string, departmentId: number }[]
    query(): void
}

export as namespace EmployeeQuery

export = EmployeeQuery