import moniLogo from "../../assets/moni_logo_login.png"
import "./BrandSection.css";
import maintitle from "../../assets/title.png"

export default function BrandSection({text}){
    return(
            <div className="logo-img">
                <img src={moniLogo} alt="moni logo" width={500} height={500} />
                <div className="logo-title">
                    <div className="main-title">
                       <img src={maintitle} alt="moni logo"/>
                    </div>
                    <div className="sub-title">
                        {text}
                    </div>
                </div>
                
            </div>
    )
}
