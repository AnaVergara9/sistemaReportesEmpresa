import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SetupProfileProps {
  onComplete: (empresa: string, cargo: string) => void;
}

export default function SetupProfile({ onComplete }: SetupProfileProps) {
  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (empresa.trim() && cargo.trim()) {
      onComplete(empresa.trim(), cargo.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-discord-darkest text-white px-4">
      <div className="bg-discord-dark p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
        <p className="text-discord-muted mb-6">Completa tu perfil para continuar.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
            <Input 
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Ej. Gerente de Proyecto"
              className="bg-discord-light border-none focus:ring-discord-accent text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la Empresa</label>
            <Input 
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Ej. Recursos Humanos S.A."
              className="bg-discord-light border-none focus:ring-discord-accent text-white"
              required
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-discord-accent hover:bg-discord-accent/90"
          >
            Comenzar
          </Button>
        </form>
      </div>
    </div>
  );
}