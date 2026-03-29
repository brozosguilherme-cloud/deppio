// Layout para páginas de autenticação (login)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 h-16 flex items-center border-b border-white/5">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-zinc-900 font-black text-sm">D</span>
          </div>
          <span className="font-black text-white text-base">Deppio</span>
        </a>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
