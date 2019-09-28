import Vue from "vue";
import EmployeeQuery from './components/EmployeeQuery.vue';

let app = new Vue({
    el: '.app',
    components: {
        EmployeeQuery
    },
    template: `<employee-query @query="getParam" :department="department" />`,
    data: {
        department: [
            { department: '技术部', departmentId: 1 },
            { department: '产品部', departmentId: 2 },
            { department: '市场部', departmentId: 3 },
            { department: '运营部', departmentId: 4 }
        ]
    },
    methods: {
        getParam: function(param: any) {
            console.log(param)
        }
    }
});
