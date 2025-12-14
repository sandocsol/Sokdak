import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../features/auth/useAuth.js';
import NameFieldEditor from '../features/profile/components/NameFieldEditor.jsx';
// import UniversityFieldEditor from '../features/profile/components/UniversityFieldEditor.jsx';
import GenderFieldEditor from '../features/profile/components/GenderFieldEditor.jsx';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  -webkit-overflow-scrolling: touch;
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
  justify-content: space-between;
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

const CompleteButton = styled.button`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #cfcfcf;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
    border: none;
  }
`;

const getFieldConfig = (fieldType) => {
  switch (fieldType) {
    case 'name':
      return {
        title: '이름',
        fieldKey: 'name',
      };
    // case 'university':
    //   return {
    //     title: '학교',
    //     fieldKey: 'university',
    //   };
    case 'gender':
      return {
        title: '성별',
        fieldKey: 'gender',
      };
    default:
      return null;
  }
};

export default function ProfileFieldEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, loading } = useAuth();
  
  // URL에서 필드 타입 추출 (예: /profile/edit/name -> 'name')
  const fieldType = location.pathname.split('/').pop();
  const config = getFieldConfig(fieldType);
  
  // 초기값: user가 있으면 해당 필드의 값, 없으면 빈 문자열
  const initialValue = user && config ? (user[config.fieldKey] || '') : '';
  const [value, setValue] = useState(initialValue);
  const prevFieldTypeRef = useRef(fieldType);

  // fieldType이 변경될 때만 초기값으로 리셋
  useEffect(() => {
    if (user && config && prevFieldTypeRef.current !== fieldType) {
      const currentValue = user[config.fieldKey] || '';
      setValue(currentValue);
      prevFieldTypeRef.current = fieldType;
    }
  }, [user, config, fieldType]);

  // 뒤로가기
  const handleBack = () => {
    navigate('/profile/edit');
  };

  // 완료 버튼 클릭
  const handleComplete = async () => {
    if (fieldType === 'name' && !value.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    // if (fieldType === 'university' && !value.trim()) {
    //   alert('학교를 선택해주세요.');
    //   return;
    // }

    if (fieldType === 'gender' && !value) {
      alert('성별을 선택해주세요.');
      return;
    }

    try {
      // updateUser로 해당 필드만 업데이트
      // gender는 trim하지 않음 (공백이 없음)
      const updateValue = fieldType === 'gender' ? value : value.trim();
      await updateUser({
        [config.fieldKey]: updateValue,
      });

      navigate('/profile/edit');
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || '업데이트에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    }
  };

  // 필드 타입에 따른 에디터 컴포넌트 렌더링
  const renderFieldEditor = () => {
    switch (fieldType) {
      case 'name':
        return <NameFieldEditor value={value} onChange={setValue} />;
      // case 'university':
      //   return <UniversityFieldEditor value={value} onChange={setValue} />;
      case 'gender':
        return <GenderFieldEditor value={value} onChange={setValue} />;
      default:
        return null;
    }
  };

  if (!config) {
    return (
      <Container>
        <p style={{ color: '#ffffff', textAlign: 'center', padding: '20px' }}>
          잘못된 경로입니다.
        </p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <p style={{ color: '#ffffff', textAlign: 'center', padding: '20px' }}>
          로딩 중...
        </p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <p style={{ color: '#ffffff', textAlign: 'center', padding: '20px' }}>
          사용자 정보를 불러올 수 없습니다.
        </p>
      </Container>
    );
  }

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
          <Title>{config.title}</Title>
        </HeaderLeft>
        <CompleteButton onClick={handleComplete}>완료</CompleteButton>
      </Header>

      <Divider />

      {renderFieldEditor()}

      <Divider style={{ marginTop: 'auto' }} />
    </Container>
  );
}
