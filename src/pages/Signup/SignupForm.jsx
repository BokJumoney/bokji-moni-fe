import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { postSignup } from "../../services/signup/signupApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPwd, setCheckPwd] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();

  function validate() {
    const next = {};

    if (!name.trim()) next.name = "이름을 입력해주세요.";

    if (!email.trim()) {
      next.email = "이메일을 입력해주세요.";
    } else if (!EMAIL_REGEX.test(email)) {
      next.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!password) {
      next.password = "비밀번호를 입력해주세요.";
    } else if (password.length < 8) {
      next.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!checkPwd) {
      next.checkPwd = "비밀번호 확인을 입력해주세요.";
    } else if (password !== checkPwd) {
      next.checkPwd = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setSubmitError("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      await postSignup({ name, email, password });
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login");
    } catch (error) {
      setSubmitError(error.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="signup-form">
      <h1>회원가입</h1>
      <p className="subscript">간단한 정보로 회원가입을 시작하세요.</p>

      <p className="input-title">이름</p>
      <Input
        placeholder={"이름을 입력해주세요"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <p className="error-message">{errors.name}</p>}

      <p className="input-title">이메일</p>
      <Input
        placeholder={"이메일을 입력해주세요"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <p className="error-message">{errors.email}</p>}

      <p className="input-title">비밀번호</p>
      <Input
        type={"password"}
        placeholder={"비밀번호를 입력해주세요"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <p className="error-message">{errors.password}</p>}

      <p className="input-title">비밀번호 확인</p>
      <Input
        type={"password"}
        placeholder={"비밀번호를 다시 입력해주세요"}
        value={checkPwd}
        onChange={(e) => setCheckPwd(e.target.value)}
      />
      {errors.checkPwd && <p className="error-message">{errors.checkPwd}</p>}

      {submitError && <p className="error-message submit-error">{submitError}</p>}

      <Button
        value={isLoading ? "가입 중..." : "회원가입"}
        onClick={handleSubmit}
      />
      <div className="subscript2-wrap">
        <div className="subscript2-container">
          <p className="subscript">
            이미 계정이 있으신가요? &nbsp;{" "}
            <Link to="/login" className="signup-link">
              로그인
            </Link>
          </p>
          <p className="subscript">비밀번호를 잊으셨나요?</p>
        </div>
      </div>
    </div>
  );
}