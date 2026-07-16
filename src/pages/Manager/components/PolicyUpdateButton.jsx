import { useState } from "react";
import { policyUpdate } from "../../../api/adminFiles.js";

const PolicyUpdateButton = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleClick = async () => {
        setIsUpdating(true);
        try {
            await policyUpdate();
            alert("정책 업데이트가 완료되었습니다.");
        } catch (error) {
            alert(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <button id="api-call-btn" type="button" disabled={isUpdating} onClick={handleClick}>
            {isUpdating ? "업데이트 중..." : "정책 업데이트"}
        </button>
    );
};

export default PolicyUpdateButton;