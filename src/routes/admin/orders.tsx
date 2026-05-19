import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrders,
})

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const statusColor = (status: string) => {
    if (status === 'lunas') return 'bg-green-100 text-green-700'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (status === 'ditolak') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1B3A5C]">Kelola Orders</h2>
          <span className="text-sm text-gray-500">{orders.length} total orders</span>
        </div>

        {loading ? <p>Loading...</p> : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">Belum ada orders masuk.</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Invoice</th>
                  <th className="text-left px-6 py-3">Nama</th>
                  <th className="text-left px-6 py-3">Produk</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Tanggal</th>
                  <th className="text-left px-6 py-3">Bukti</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs">{order.invoice_no}</td>
                    <td className="px-6 py-4">
                      <div>{order.name}</div>
                      <div className="text-xs text-gray-400">{order.email}</div>
                    </td>
                    <td className="px-6 py-4">{order.product_name}</td>
                    <td className="px-6 py-4 font-semibold">Rp {order.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4">
                      {order.payment_proof_url ? (
                        <a href={order.payment_proof_url} target="_blank" className="text-blue-500 hover:underline text-xs">Lihat</a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="lunas">Lunas</option>
                        <option value="ditolak">Ditolak</option>
                      </select>
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