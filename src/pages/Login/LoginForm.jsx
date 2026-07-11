import React from 'react'
import moniLogo from "../../assets/moni_logo.png"
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";

export default function LoginForm(){
    return(
            <div className="login-form">
              <h1>로그인</h1>
              <p className="subscript">회원 계정을로 로그인하세요.</p>
              <p className="input-title">이메일</p>
              <Input placeholder={"이메일을 입력해주세요"}></Input>

              <p className="input-title">비밀번호</p>
              <Input type={"password"} placeholder={"이메일을 입력해주세요"}></Input>
              <Button
                    value="로그인"
                    onClick={() => console.log("로그인 클릭")}
                />
                <div className="subscript2-wrap">
                     <div className="subscript2-container">
                <p className="subscript">계정이 없으신가요?  &nbsp; <Link to="/signup" className="signup-link" >회원가입</Link></p> 
                <p className="subscript" >비밀번호를 잊으셨나요?</p>
                </div>
                </div>
            </div>
    )
}