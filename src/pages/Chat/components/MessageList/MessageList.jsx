import React from 'react';
import './MessageList.css';

function MessageList() {
  return (
    <div className="message-list">
      {/* User Message */}
      <div className="message-row user-row">
        <div className="message user-message">
          <p>월 200만원 벌고 있는 27살 청년이고,<br/>현재 취업을 준비 중입니다.</p>
          <span className="message-time">오후 2:30</span>
        </div>
      </div>

      {/* Bot Message */}
      <div className="message-row bot-row">
        <div className="message-avatar">🤖</div>
        <div className="message bot-message">
          <p>입력해주셔서 감사합니다! 😊<br/>더 정확한 추천을 위해 몇 가지 추가 정보를<br/>알려주시면 좋아요.</p>
          <span className="message-time">오후 2:30</span>
        </div>
      </div>
    </div>
  );
}

export default MessageList;
