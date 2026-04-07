import { Usuario } from "@/types";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  usuarioData: Usuario;
  onLogout: () => void;
}

export default function Header({ usuarioData, onLogout }: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-14 border-b border-discord-darkest bg-discord-dark flex items-center justify-between px-4 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: usuarioData.avatarColor }}
        >
          {getInitials(usuarioData.nombre)}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm leading-tight">{usuarioData.nombre}</span>
          <span className="text-discord-muted text-[11px] leading-tight">{usuarioData.cargo}</span>
          <span className="text-discord-muted text-[11px] leading-tight">{usuarioData.empresa}</span>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        onClick={onLogout}
        className="text-discord-muted hover:text-white hover:bg-discord-light gap-2 absolute top-2 right-4"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Cerrar sesión</span>
      </Button>
    </header>
  );
}