import React from 'react'
import moniLogo from "../../assets/moni_logo_login.png"
import "./BrandSection.css";

export default function BrandSection(){
    return(
            <div className="logo-img">
                <img src={moniLogo} alt="moni logo" width={500} height={500} />
                <div className="logo-title">
                    <div className="main-title">
                        복지 모니
                    </div>
                    <div className="sub-title">
                         당신의 삶에 힘이 되는 <br/>복지 정보를 찾아드려요.
                    </div>
                </div>
                
            </div>
    )
}