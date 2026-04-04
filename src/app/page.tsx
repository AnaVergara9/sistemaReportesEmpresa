"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import SetupProfile from "@/components/SetupProfile";

export default function Home() {
  const { user, usuarioData, loading, login, logout, setupProfile } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-discord-darkest text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-discord-accent"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  if (!usuarioData) {
    return <SetupProfile onComplete={setupProfile} />;
  }

  return <Dashboard user={user} usuarioData={usuarioData} onLogout={logout} />;
}