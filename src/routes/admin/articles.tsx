import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/admin/articles')({
  component: AdminArticles,
})

function AdminArticles() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', author: '', category: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.title) return alert('Judul wajib diisi!')
    setSaving(true)
    let image_url = ''
    if (imageFile) {
      const fileName = `articles/${Date.now()}_${imageFile.name}`
      const { error } = await supabase.storage.from('images').upload(fileName, imageFile)
      if (!error) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName)
        image_url = data.publicUrl
      }
    }
    const { error } = await supabase.from('articles').insert({
      title: form.title,
      excerpt: form.excerpt || null,
      content: form.content || null,
      author: form.author || null,
      category: form.category || null,
      image_url: image_url || null,
      published_at: new Date().toISOString(),
    })
    if (error) { alert('Error: ' + error.message); setSaving(false); return }
    setForm({ title: '', excerpt: '', content: '', author: '', category: '' })
    setImageFile(null); setImagePreview(''); setShowForm(false); setSaving(false)
    fetchItems()
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    await supabase.from('articles').delete().eq('id', id)
    fetchItems()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1B3A5C]">Kelola Artikel</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
            {showForm ? 'Batal' : '+ Tambah Artikel'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Tambah Artikel Baru</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Judul artikel" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Komunikasi / Karier / Leadership" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Penulis</label>
                <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Nama penulis" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gambar</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
                {imagePreview && <img src={imagePreview} className="mt-2 h-32 rounded-lg object-cover" />}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Ringkasan</label>
                <input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ringkasan singkat artikel..." />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Isi Artikel</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={6} placeholder="Tulis isi artikel di sini..." />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="mt-4 bg-[#1B3A5C] hover:bg-[#152d47] text-white px-6 py-2 rounded-lg text-sm">
              {saving ? 'Menyimpan...' : 'Simpan Artikel'}
            </button>
          </div>
        )}

        {loading ? <p>Loading...</p> : items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">Belum ada artikel.</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Gambar</th>
                  <th className="text-left px-6 py-3">Judul</th>
                  <th className="text-left px-6 py-3">Kategori</th>
                  <th className="text-left px-6 py-3">Penulis</th>
                  <th className="text-left px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{item.image_url ? <img src={item.image_url} className="h-12 w-16 object-cover rounded" /> : '-'}</td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">{item.category || '-'}</td>
                    <td className="px-6 py-4">{item.author || '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}