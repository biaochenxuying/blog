import React from 'react';
import { Checkbox , Button } from 'antd';

import './index.css';

const Setting = () => {
    return (
        <>  
            <Checkbox >新员工入职邮件提醒</Checkbox>
            <div className="buttonWrap">
                <Button type="primary">保存</Button>
            </div>
        </>
    )
}

export default Setting;
