import BrandSection from "./BrandSection";
import LoginForm from "./LoginForm";
import "./Login.css";

const Login= ()=>{
    return (
        <div className="login-container">
            <div className="brand-section">
                <BrandSection/>
            </div>
          
            <div className="login-section">
                <LoginForm/>
            </div>
        </div>
    )
}

export default Login;