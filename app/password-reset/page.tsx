import { Suspense } from "react";
import PasswordResetForm from "./PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <PasswordResetForm />
    </Suspense>
  );
}
