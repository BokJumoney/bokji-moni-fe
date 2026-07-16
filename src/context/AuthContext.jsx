import { useState, useEffect, useCallback } from "react";
import { getSession, postLogout } from "../services/login/loginApi";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        getSession()
            .then((data) => {
                if (mounted && data?.user) setUser(data.user);
            })
            .catch(() => {
                // 세션이 없거나 엔드포인트 미구현(404)이면 비로그인 처리
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    const login = useCallback((userData) => setUser(userData), []);

    const logout = useCallback(async () => {
        try {
            await postLogout();
        } catch {
            // /logout 미구현 시에도 프론트 상태는 초기화
        }
        setUser(null);
    }, []);

    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}