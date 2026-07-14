import React from 'react'
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";

export default function SignupForm(){
        
    return (
         <div className="signup-form">
              <h1>회원가입</h1>
              <p className="subscript">간단한 정보로 회원가입을 시작하세요.</p>
              
              <p className="input-title">이름</p>
              <Input placeholder={"이름을 입력해주세요"}></Input>

              <p className="input-title">이메일</p>
              <Input placeholder={"이메일을 입력해주세요"}></Input>

              <p className="input-title">비밀번호</p>
              <Input type={"password"} placeholder={"비밀번호를 입력해주세요"}></Input>

              <p className="input-title">비밀번호 확인</p>
              <Input type={"password"} placeholder={"비밀번호를 다시 입력해주세요"}></Input>
            

              <Button
                    value="회원가입"
                    onClick={() => console.log("회워가입 클릭")}
                />
                <div className="subscript2-wrap">
                     <div className="subscript2-container">
                <p className="subscript">이미 계정이 있으신가요?  &nbsp; <Link to="/login" className="signup-link" >로그인</Link></p> 
                <p className="subscript" >비밀번호를 잊으셨나요?</p>
                </div>
                </div>
            </div>
    )
}