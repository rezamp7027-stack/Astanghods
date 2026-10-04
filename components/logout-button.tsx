"use client";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return (
    <button className="btn btn-secondary" type="button" onClick={logout}>
      خروج از حساب
    </button>
  );
}
