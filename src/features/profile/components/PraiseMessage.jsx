import styled from "styled-components";
import { formatTimeAgo } from "../utils/formatTimeAgo.js";

const MessageCard = styled.div`
  background: #353535;
  border: 1px solid ${(props) => props.$borderColor};
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 20px;
  margin-bottom: 16px;
  box-sizing: border-box;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BubbleIcon = styled.img`
  width: 19px;
  height: 21px;
  object-fit: contain;
  flex-shrink: 0;
`;

const SenderName = styled.span`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 700;
  font-size: 15px;
  line-height: normal;
  color: #ffffff;
  white-space: nowrap;
`;

const TimeStamp = styled.span`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: normal;
  color: #8c8c8c;
  white-space: nowrap;
`;

const MessageContent = styled.p`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  color: #ffffff;
  margin: 0;
  word-wrap: break-word;
`;

export default function PraiseMessage({ message, isSent = false }) {
  if (!message) return null;

  // gender에 따라 테두리 색상과 버블 아이콘 결정
  const borderColor = message.gender === "male" ? "#2AB7CA" : "#FE4B4A";
  const bubbleIcon =
    message.gender === "male"
      ? "/assets/blue-bubble.png"
      : "/assets/orenge-bubble.png";

  // 표시할 이름
  // 보낸 메시지는 anonymity와 관계없이 항상 실명 표시
  // 받은 메시지는 anonymity가 true면 "익명", false면 실명 표시
  const displayName = isSent
    ? (message.receiverName || message.name)
    : (message.isAnonymous || message.anonymity
      ? "익명"
      : (message.senderName || message.name));

  return (
    <MessageCard $borderColor={borderColor}>
      <MessageHeader>
        <SenderInfo>
          <BubbleIcon src={bubbleIcon} alt="프로필 버블" />
          <SenderName>{displayName}</SenderName>
        </SenderInfo>
        <TimeStamp>{formatTimeAgo(message.timestamp)}</TimeStamp>
      </MessageHeader>
      <MessageContent>{message.content}</MessageContent>
    </MessageCard>
  );
}

