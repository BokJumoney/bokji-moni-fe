import { useState } from 'react'
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { postLogin } from "../../services/login/loginApi";
import { useAuth } from "../../context/useAuth";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!email || !password) {
            setErrorMsg("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            const data = await postLogin({ email, password });
            login(data.user);
            navigate("/");
        } catch (err) {
            setErrorMsg(err.message || "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <form className="login-form">
            <h1>로그인</h1>
            <p className="subscript">회원 계정으로 로그인하세요.</p>
            <p className="input-title">이메일</p>
            <Input
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <p className="input-title">비밀번호</p>
            <Input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {errorMsg && <p className="error-message">{errorMsg}</p>}

            <Button
                btnType="submit"
                value={loading ? "로그인 중..." : "로그인"}
                onClick={handleSubmit}
            />
            <div className="subscript2-wrap">
                <div className="subscript2-container">
                    <p className="subscript">계정이 없으신가요? &nbsp; <Link to="/signup" className="signup-link">회원가입</Link></p>
                    <p className="subscript">비밀번호를 잊으셨나요?</p>
                </div>
            </div>
        </form>
    )
}