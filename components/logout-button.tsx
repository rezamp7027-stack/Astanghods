"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button className="btn btn-secondary" type="button" onClick={logout}>
      خروج از حساب
    </button>
  );
}
