import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../features/auth/useAuth.js';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

// 둥둥 떠다니는 애니메이션
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-25px);
  }
`;

// 로고 영역
const LogoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
  flex-shrink: 0;
`;

const LogoImage1 = styled.img`
  width: 182px;
  height: 211px;
  animation: ${float} 3s ease-in-out infinite;
  animation-fill-mode: both;
`;

const LogoImage2 = styled.img`
  position: absolute;
  width: 140px;
  height: 157px;
  left: calc(50% - 70px);
  top: 0;
`;

// 폼 컨테이너
const FormContainer = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

// 입력 필드 컨테이너
const InputContainer = styled.div`
  padding: 0 30px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 333px;
  height: 48px;
  background: #585858;
  border: none;
  border-radius: 25px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  padding: 12px 20px;
  outline: none;
  margin: 0 auto;
  display: block;
  
  &:focus {
    background: #666666;
  }
  
  &::placeholder {
    color: #bababa;
  }
`;

// 로그인 버튼 컨테이너
const LoginButtonContainer = styled.div`
  padding: 0 30px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-shrink: 0;
`;

// 로그인 버튼
const LoginButton = styled.button`
  width: 305px;
  max-width: calc(100% - 60px);
  height: 50px;
  background: ${props => props.$disabled ? '#f3f4f6' : '#2ab7ca'};
  border: none;
  border-radius: 10px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: ${props => props.$disabled ? '#222222' : '#ffffff'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  outline: none;
  flex-shrink: 0;
  padding: 11px 77px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    opacity: ${props => props.$disabled ? 1 : 0.8};
  }
`;

// 회원가입 링크 영역
const SignupLinkContainer = styled.div`
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: auto;
  margin-bottom: 50px;
  flex-shrink: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  line-height: 16px;
  z-index: 1;
`;

const SignupLinkText = styled.p`
  margin: 0;
  color: #838383;
  font-weight: 400;
`;

const SignupLink = styled(Link)`
  margin: 0;
  color: #2ab7ca;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
`;

// 에러 메시지
const ErrorMessage = styled.p`
  color: #fe4b4a;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  line-height: 16px;
  margin: 10px auto 0;
  text-align: center;
  max-width: 333px;
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      // 로그인 성공 시 홈으로 이동
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !email.trim() || !password.trim() || loading;

  const logoImage1 = "/assets/Group 6.svg";

  return (
    <Container>
      <LogoContainer>
        <LogoImage1 src={logoImage1} alt="Logo" />
      </LogoContainer>

      <FormContainer onSubmit={handleLogin}>
        <InputContainer>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일을 입력하세요"
            autoFocus
            disabled={loading}
          />
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력하세요"
            disabled={loading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputContainer>

        <LoginButtonContainer>
          <LoginButton
            type="submit"
            $disabled={isDisabled}
            disabled={isDisabled}
          >
            {loading ? '로그인 중...' : '로그인'}
          </LoginButton>
        </LoginButtonContainer>
      </FormContainer>

      <SignupLinkContainer>
        <SignupLinkText>계정이 없나요?</SignupLinkText>
        <SignupLink to="/onboarding">회원가입</SignupLink>
      </SignupLinkContainer>
    </Container>
  );
}

