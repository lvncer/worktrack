"use client";

import { User, getUserByEmail, users } from "./data/users";
import { createContext, useContext, useEffect, useState } from "react";

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: User | null;
}

export interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  setNewPassword: (
    token: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  // 初回レンダリング時にローカルストレージから認証状態を復元
  useEffect(() => {
    const user = localStorage.getItem("authUser");

    if (user) {
      try {
        setAuthState({
          status: "authenticated",
          user: JSON.parse(user),
        });
      } catch (e) {
        setAuthState({
          status: "unauthenticated",
          user: null,
        });
      }
    } else {
      setAuthState({
        status: "unauthenticated",
        user: null,
      });
    }
  }, []);

  // ログイン処理
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const user = getUserByEmail(email);

    if (!user) {
      return { success: false, message: "メールアドレスが見つかりません" };
    }

    if (user.password !== password) {
      return { success: false, message: "パスワードが正しくありません" };
    }

    setAuthState({
      status: "authenticated",
      user,
    });
    localStorage.setItem("authUser", JSON.stringify(user));
    return { success: true, message: "ログインに成功しました" };
  };

  // ログアウト処理
  const logout = () => {
    setAuthState({
      status: "unauthenticated",
      user: null,
    });
    localStorage.removeItem("authUser");
  };

  // パスワードリセット申請
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    const user = getUserByEmail(email);

    if (!user) {
      return { success: false, message: "メールアドレスが見つかりません" };
    }

    // 実際のアプリでは、ここでパスワードリセット用のメールを送信する処理が入ります
    return {
      success: true,
      message:
        "パスワードリセットのメールを送信しました。メールのリンクからパスワードを再設定してください。",
    };
  };

  // 新しいパスワードの設定
  const setNewPassword = async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    // 実際のアプリでは、ここでトークンの検証とパスワード更新の処理が入ります
    // デモのため、トークンが "valid_token" の場合に成功するようにしています
    if (token === "valid_token") {
      return { success: true, message: "パスワードが正常に更新されました" };
    }

    return { success: false, message: "無効なトークンです" };
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        resetPassword,
        setNewPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
