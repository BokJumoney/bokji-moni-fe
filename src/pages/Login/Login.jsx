import BrandSection from "../../components/BrandSection/BrandSection";
import LoginForm from "./LoginForm";
import "./Login.css";


const Login= ()=>{
    return (
        <div className="login-container">
            <div className="brand-section">
                <BrandSection 
                    text={
                            <>
                            당신의 삶에 힘이 되는
                            <br />
                            복지 정보를 찾아드려요.
                            </>
                    }/>
            </div>
          
            <div className="login-section">
                <LoginForm/>
            </div>
        </div>
    )
}

export default Login;