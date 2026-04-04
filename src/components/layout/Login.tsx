import { Button } from "@/components/ui/button";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-discord-darkest text-white px-4">
      <div className="bg-discord-dark p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Gestión Documental</h1>
        <p className="text-discord-muted mb-8 italic">Organización, Colaboración y Eficiencia</p>
        <Button 
          onClick={onLogin}
          className="w-full bg-discord-accent hover:bg-discord-accent/90 py-6 text-lg"
        >
          Iniciar sesión con Google
        </Button>
      </div>
    </div>
  );
}