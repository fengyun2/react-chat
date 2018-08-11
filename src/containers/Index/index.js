// 主页
import React from 'react';

import Sidebar from '../Sidebar/index';
import ChatPanel from '../ChatPanel/ChatPanel';

import './index.css';

const Index = () => (
    <div className="module-main">
        <Sidebar />
        <ChatPanel />
    </div>
);

export default Index;
