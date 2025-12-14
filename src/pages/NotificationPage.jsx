import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import usePendingMembers from "../features/notification/hooks/usePendingMembers.js";
import { approveMember, rejectMember } from "../features/club/api/clubApi.js";
import { formatTimeAgo } from "../features/profile/utils/formatTimeAgo.js";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Divider = styled.div`
  width: 100%;
  height: 10px;
  background: #353535;
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 90px 30px 20px 30px;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackButton = styled.button`
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  overflow: hidden;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
    border: none;
  }
`;

const ChevronIcon = styled.svg`
  width: 100%;
  height: 100%;
  stroke: #cfcfcf;
`;

const Title = styled.h1`
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 24px;
  color: #cfcfcf;
  margin: 0;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  min-height: 0;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px 35px;
  width: 100%;
`;

const NotificationItem = styled.div`
  border-bottom: 2px solid #585858;
  display: flex;
  gap: 27px;
  align-items: flex-end;
  padding: 12px;
  width: 100%;
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  padding: 10px 0;
  flex: 1;
`;

const NotificationText = styled.div`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #cfcfcf;
  margin: 0;
  
  p {
    margin: 0;
    margin-bottom: 2px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const NotificationTime = styled.p`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #9f9f9f;
  margin: 0;
  min-width: fit-content;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  height: 78px;
  flex-shrink: 0;
`;

const RejectButton = styled.button`
  border: 1.5px solid #2ab7ca;
  background: transparent;
  color: #2ab7ca;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

const AcceptButton = styled.button`
  background: #2ab7ca;
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  padding: 8px 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9f9f9f;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #cfcfcf;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
`;

export default function NotificationPage() {
  const navigate = useNavigate();
  const { notifications, loading, error, refetch } = usePendingMembers();
  const [processingIds, setProcessingIds] = useState(new Set());

  const handleBack = () => {
    navigate(-1);
  };

  const handleReject = async (notification) => {
    const processingKey = `${notification.clubId}-${notification.userId}`;
    
    if (processingIds.has(processingKey)) {
      return; // 이미 처리 중이면 무시
    }

    setProcessingIds((prev) => new Set(prev).add(processingKey));

    try {
      // API 명세: POST /api/clubs/{club_id}/members/{user_id}/reject
      // 응답: { "clubId": Long, "userId": Long, "requestStatus": "REJECTED" }
      const response = await rejectMember(notification.clubId, notification.userId);
      
      // 응답 데이터 확인 (선택적)
      if (response && response.requestStatus === "REJECTED") {
        console.log("멤버 거절 성공:", response);
      }
      
      // 성공 시 알림 목록 새로고침
      await refetch();
    } catch (err) {
      console.error("멤버 거절 실패:", err);
      const errorMessage = err.response?.data?.message || err.message || "알 수 없는 오류";
      alert(`멤버 거절에 실패했습니다: ${errorMessage}`);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(processingKey);
        return next;
      });
    }
  };

  const handleAccept = async (notification) => {
    const processingKey = `${notification.clubId}-${notification.userId}`;
    
    if (processingIds.has(processingKey)) {
      return; // 이미 처리 중이면 무시
    }

    setProcessingIds((prev) => new Set(prev).add(processingKey));

    try {
      // API 명세: POST /api/clubs/{club_id}/members/{user_id}/approve
      // 응답: { "clubId": Long, "userId": Long, "requestStatus": "APPROVED" }
      const response = await approveMember(notification.clubId, notification.userId);
      
      // 응답 데이터 확인 (선택적)
      if (response && response.requestStatus === "APPROVED") {
        console.log("멤버 승인 성공:", response);
      }
      
      // 성공 시 알림 목록 새로고침
      await refetch();
    } catch (err) {
      console.error("멤버 승인 실패:", err);
      const errorMessage = err.response?.data?.message || err.message || "알 수 없는 오류";
      alert(`멤버 승인에 실패했습니다: ${errorMessage}`);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(processingKey);
        return next;
      });
    }
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack} aria-label="뒤로가기">
            <ChevronIcon viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </ChevronIcon>
          </BackButton>
          <Title>알림</Title>
        </HeaderLeft>
      </Header>

      <Divider />

      <ScrollableContent>
        {loading ? (
          <LoadingState>로딩 중...</LoadingState>
        ) : error ? (
          <EmptyState>
            <p>알림을 불러오는 중 오류가 발생했습니다.</p>
            <p style={{ marginTop: "10px", fontSize: "12px" }}>
              {error.message || "알 수 없는 오류"}
            </p>
          </EmptyState>
        ) : notifications.length === 0 ? (
          <EmptyState>승인 대기 중인 멤버가 없습니다.</EmptyState>
        ) : (
          <NotificationsList>
            {notifications.map((notification) => {
              const processingKey = `${notification.clubId}-${notification.userId}`;
              const isProcessing = processingIds.has(processingKey);
              
              return (
                <NotificationItem key={notification.id}>
                  <NotificationContent>
                    <NotificationText>
                      <p>{notification.userName} 님이 {notification.clubName}</p>
                      <p>멤버 승인 요청을 보냈어요.</p>
                    </NotificationText>
                    <NotificationTime>
                      {formatTimeAgo(notification.timestamp)}
                    </NotificationTime>
                  </NotificationContent>
                  <ActionButtons>
                    <RejectButton
                      onClick={() => handleReject(notification)}
                      aria-label="거절"
                      disabled={isProcessing}
                      style={{
                        opacity: isProcessing ? 0.5 : 1,
                        cursor: isProcessing ? "not-allowed" : "pointer",
                      }}
                    >
                      거절
                    </RejectButton>
                    <AcceptButton
                      onClick={() => handleAccept(notification)}
                      aria-label="수락"
                      disabled={isProcessing}
                      style={{
                        opacity: isProcessing ? 0.5 : 1,
                        cursor: isProcessing ? "not-allowed" : "pointer",
                      }}
                    >
                      수락
                    </AcceptButton>
                  </ActionButtons>
                </NotificationItem>
              );
            })}
          </NotificationsList>
        )}
      </ScrollableContent>
    </Container>
  );
}

