import styled from "styled-components";
import useBadges from "../hooks/useBadges.js";

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 48px;
  column-gap: 10px;
  padding: 46px 20px 16px 20px;
  justify-items: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const BadgeItem = styled.div`
  position: relative;
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BadgeImage = styled.img`
  width: 75px;
  height: 75px;
  object-fit: contain;
`;

const LockContainer = styled.div`
  width: 75px;
  height: 75px;
  position: relative;
  background: #353535;
  border-radius: 15px;
`;

const LockIcon = styled.img`
  width: 22px;
  height: 28px;
  position: absolute;
  left: 27px;
  top: 24px;
  object-fit: contain;
`;

export default function BadgeList({ badges: badgesProp }) {
  const { data: badgesData, loading, error } = useBadges();
  const badges = badgesProp || badgesData || [];

  if (loading) {
    return (
      <BadgeGrid>
        <p style={{ color: "#ffffff", gridColumn: "1 / -1", textAlign: "center" }}>로딩 중...</p>
      </BadgeGrid>
    );
  }

  if (error || !badges || badges.length === 0) {
    return (
      <BadgeGrid>
        <p style={{ color: "#ffffff", gridColumn: "1 / -1", textAlign: "center" }}>뱃지 데이터를 불러올 수 없습니다.</p>
      </BadgeGrid>
    );
  }

  return (
    <BadgeGrid>
      {badges.map((badge) => (
        <BadgeItem key={badge.id}>
          {badge.isEarned ? (
            <BadgeImage 
              src={badge.iconUrl || badge.imageUrl} 
              alt={badge.name}
            />
          ) : (
            <LockContainer>
              <LockIcon src="/assets/badge-lock.svg" alt="잠금" />
            </LockContainer>
          )}
        </BadgeItem>
      ))}
    </BadgeGrid>
  );
}

