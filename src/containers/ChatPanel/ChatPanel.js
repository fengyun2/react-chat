import React from 'react';

import FeatureLinkmans from './FeatureLinkmans/FeatureLinkmans';
import Chat from './Chat/Chat';
import './ChatPanel.css';

const ChatPanel = () => (
    <div className="module-main-chatPanel">
        <FeatureLinkmans />
        <Chat />
    </div>
);

export default ChatPanel;
