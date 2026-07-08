import BrandSection from "../../components/BrandSection/BrandSection";
import SignupForm from "./SignupForm";
import "./Signup.css";

const Signup= ()=>{
    return (
        <div className="signup-container">
            <div className="brand-section">
                <BrandSection 
                        text={
                                <>
                                    더 많은 복지 혜택,
                                    <br />
                                    AI가 함께 찾아드릴게요.
                                </>
                            }/>
            </div>
          
            <div className="signup-section">
                <SignupForm/>
            </div>
        </div>
    )
}

export default Signup;