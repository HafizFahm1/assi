import { Link, useRouter } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.navigate({ to: '/admin/' })
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-[#1B3A5C] text-white flex flex-col">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-white/60 mt-1">Akademi Soft Skills</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm">
            📊 Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm">
            🛒 Orders
          </Link>
          <Link to="/admin/books" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm">
            📚 Buku
          </Link>
          <Link to="/admin/training" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm">
            🎓 Training
          </Link>
          <Link to="/admin/audio-video" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm">
            🎵 Audio & Video
          </Link>
          <Link to="/admin/articles" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm">
            📝 Artikel
          </Link>
        </nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm bg-red-500 hover:bg-red-600 rounded-lg transition">
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  )
}