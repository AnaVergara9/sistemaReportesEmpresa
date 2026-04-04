"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, signOut } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Usuario } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          setUsuarioData(userDoc.data() as Usuario);
        } else {
          setUsuarioData(null); // Signal that first-time setup is needed
        }
      } else {
        setUsuarioData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const setupProfile = async (empresa: string) => {
    if (!user) return;
    const colors = ["#5865f2", "#3ba55c", "#ed4245", "#faa61a", "#9b59b6"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newUsuario: Usuario = {
      uid: user.uid,
      nombre: user.displayName || "Usuario",
      email: user.email || "",
      empresa: empresa,
      avatarColor: randomColor,
      creadoEn: new Date(),
    };

    await setDoc(doc(db, "usuarios", user.uid), newUsuario);
    setUsuarioData(newUsuario);
  };

  return { user, usuarioData, loading, login, logout, setupProfile };
}