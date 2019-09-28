import express from 'express';
import bodyParser from 'body-parser';
import excelExport from 'excel-export';
import query from '../models/query';

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

let queryAllSQL = `SELECT employee.*, level.level, department.department
    FROM employee, level, department
    WHERE
        employee.levelId = level.id AND
        employee.departmentId = department.id`;

router.get('/getEmployee', async (req, res) => {
    let { name = '', departmentId } = req.query;
    let conditions = `AND employee.name LIKE '%${name}%'`;
    if (departmentId) {
        conditions = conditions + ` AND employee.departmentId=${departmentId}`;
    }
    let sql = `${queryAllSQL} ${conditions} ORDER BY employee.id DESC`;
    try {
        let result = await query(sql);
        result.forEach((i: any) => {
            i.key = i.id
        })
        res.json({
            flag: 0,
            data: result
        })
    } catch (e) {
        res.json({
            flag: 1,
            msg: e.toString()
        })
    }
});

router.post('/createEmployee', urlencodedParser, async (req, res) => {
    let { name, departmentId, hiredate, levelId } = req.body;
    let sql = `INSERT INTO employee (name, departmentId, hiredate, levelId)
        VALUES ('${name}', ${departmentId}, '${hiredate}', ${levelId})`;
    try {
        let result = await query(sql);
        res.json({
            flag: 0,
            data: {
                key: result.insertId,
                id: result.insertId
            }
        })
    } catch (e) {
        res.json({
            flag: 1,
            msg: e.toString()
        })
    }
});

router.post('/deleteEmployee', async (req, res) => {
    let { id } = req.body;
    let sql = `DELETE FROM employee WHERE id=${id}`;
    try {
        let result = await query(sql);
        res.json({
            flag: 0
        })
    } catch (e) {
        res.json({
            flag: 1,
            msg: e.toString()
        })
    }
});

router.post('/updateEmployee', async (req, res) => {
    let { id, name, departmentId, hiredate, levelId } = req.body;
    let sql = `UPDATE employee
        SET
            name='${name}',
            departmentId=${departmentId},
            hiredate='${hiredate}',
            levelId=${levelId}
        WHERE
            id=${id}`;
    try {
        let result = await query(sql);
        res.json({
            flag: 0
        })
    } catch (e) {
        res.json({
            flag: 1,
            msg: e.toString()
        })
    }
});

let conf: excelExport.Config = {
    cols: [
        { caption:'员工ID', type:'number'},
        { caption:'姓名', type:'string'},
        { caption:'部门', type:'string' },
        { caption:'入职时间', type:'string' },
        { caption:'职级', type:'string'}
    ],
    rows: []
};

router.get('/downloadEmployee', async (req, res) => {
    try {
        let result = await query(queryAllSQL);
        conf.rows = result.map((i: any) => {
            return [i.id, i.name, i.department, i.hiredate, i.level];
        });
        let excel = excelExport.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=Employee.xlsx');
        res.end(excel, 'binary');
    } catch (e) {
        res.send(e.toString());
    }
});

export default router;
