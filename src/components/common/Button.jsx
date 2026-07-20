import "./Button.css";


export default function Button({value, onClick, btnType = "button"}){
   
    return (
        <div className="btn-container">
                <button
                    type={btnType}
                    className="btn"
                    onClick={onClick}>
                        {value}
                </button>
        </div>
    );
}
