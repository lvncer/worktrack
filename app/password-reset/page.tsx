"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Mail,
  KeyRound,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, setNewPassword } = useAuth();
  const { toast } = useToast();

  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccess(result.message);
        toast({
          title: "メール送信",
          description: "パスワードリセットのメールを送信しました",
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setIsLoading(false);
      return;
    }

    try {
      if (!token) {
        setError("無効なリクエストです");
        return;
      }

      const result = await setNewPassword(token, password);

      if (result.success) {
        setSuccess("パスワードが正常に更新されました");
        toast({
          title: "パスワード更新",
          description:
            "パスワードが更新されました。新しいパスワードでログインできます。",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50 animate-in fade-in duration-500">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-full bg-primary text-primary-foreground">
              <LayoutDashboard className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            パスワード再設定
          </CardTitle>
          <CardDescription className="text-center">
            {token
              ? "パスワードを新しく設定してください"
              : "メールアドレスを入力してリセットリンクを取得"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-primary/10">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {token ? (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">新しいパスワード</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード確認</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "処理中..." : "パスワードを更新"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "送信中..." : "リセットリンクを送信"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-full justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ログイン画面に戻る
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
