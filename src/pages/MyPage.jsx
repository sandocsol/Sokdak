import styled from "styled-components";
import { useState } from "react";
import ProfileHeader from "../features/profile/components/ProfileHeader.jsx";
import ProfileTabs from "../features/profile/components/ProfileTabs.jsx";
import PraiseMessage from "../features/profile/components/PraiseMessage.jsx";
import BadgeList from "../features/profile/components/BadgeList.jsx";
import useProfileMessages from "../features/profile/hooks/useProfileMessages.js";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  flex-shrink: 0;
  width: 100%;
`;

const TabsSection = styled.div`
  flex-shrink: 0;
  width: 100%;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  min-height: 0;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 46px;
  padding-bottom: 16px;
  width: 100%;
`;

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("received");
  
  const { data: receivedMessages, loading: receivedLoading } = useProfileMessages("received");
  const { data: sentMessages, loading: sentLoading } = useProfileMessages("sent");

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // 탭에 따라 표시할 메시지 결정
  const getMessages = () => {
    switch (activeTab) {
      case "sent":
        return sentMessages || [];
      case "received":
        return receivedMessages || [];
      case "badges":
        return []; // 뱃지는 나중에 구현
      default:
        return [];
    }
  };

  const messages = getMessages();
  const isLoading = (activeTab === "sent" && sentLoading) || (activeTab === "received" && receivedLoading);

  return (
    <Container>
      <HeaderSection>
        <ProfileHeader />
      </HeaderSection>
      <TabsSection>
        <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </TabsSection>
      <ScrollableContent>
        {activeTab === "badges" ? (
          <BadgeList />
        ) : isLoading ? (
          <MessagesContainer>
            <p style={{ color: "#ffffff", textAlign: "center", padding: "20px" }}>로딩 중...</p>
          </MessagesContainer>
        ) : (
          <MessagesContainer>
            {messages.length > 0 ? (
              messages.map((message) => (
                <PraiseMessage key={message.id} message={message} />
              ))
            ) : (
              <p style={{ color: "#ffffff", textAlign: "center", padding: "20px" }}>메시지가 없습니다.</p>
            )}
          </MessagesContainer>
        )}
      </ScrollableContent>
    </Container>
  );
}

