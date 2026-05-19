import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/admin/books')({
  component: AdminBooks,
})

function AdminBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', price: '', rating: '', badge: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false })
    setBooks(data || [])
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
    const fileName = `books/${Date.now()}_${imageFile.name}`
    const { error } = await supabase.storage.from('images').upload(fileName, imageFile)
    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      image_url = data.publicUrl
    }
  }

  const { error } = await supabase.from('books').insert({
    title: form.title,
    description: form.description || null,
    price: form.price ? parseInt(form.price) : 0,
    rating: form.rating ? parseFloat(form.rating) : null,
    badge: form.badge || null,
    image_url: image_url || null,
  })

  console.log('insert error:', error)

  if (error) {
    alert('Error: ' + error.message)
    setSaving(false)
    return
  }

  setForm({ title: '', description: '', price: '', rating: '', badge: '' })
  setImageFile(null)
  setImagePreview('')
  setShowForm(false)
  setSaving(false)
  fetchBooks()
}

  const deleteBook = async (id: string) => {
    if (!confirm('Hapus buku ini?')) return
    await supabase.from('books').delete().eq('id', id)
    fetchBooks()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1B3A5C]">Kelola Buku</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
            {showForm ? 'Batal' : '+ Tambah Buku'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Tambah Buku Baru</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Judul buku" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="89000" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="4.9" type="number" step="0.1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Badge</label>
                <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Best Seller / Populer / Terbaru" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Gambar</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
                {imagePreview && <img src={imagePreview} className="mt-2 h-32 rounded-lg object-cover" />}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Deskripsi buku..." />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="mt-4 bg-[#1B3A5C] hover:bg-[#152d47] text-white px-6 py-2 rounded-lg text-sm">
              {saving ? 'Menyimpan...' : 'Simpan Buku'}
            </button>
          </div>
        )}

        {loading ? <p>Loading...</p> : books.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            Belum ada buku. Klik "Tambah Buku" untuk menambahkan.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Gambar</th>
                  <th className="text-left px-6 py-3">Judul</th>
                  <th className="text-left px-6 py-3">Harga</th>
                  <th className="text-left px-6 py-3">Rating</th>
                  <th className="text-left px-6 py-3">Badge</th>
                  <th className="text-left px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book: any) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {book.image_url ? <img src={book.image_url} className="h-12 w-16 object-cover rounded" /> : '-'}
                    </td>
                    <td className="px-6 py-4">{book.title}</td>
                    <td className="px-6 py-4">Rp {book.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">⭐ {book.rating}</td>
                    <td className="px-6 py-4">{book.badge || '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteBook(book.id)} className="text-red-500 hover:underline">Hapus</button>
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