import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0, books: 0, trainings: 0, articles: 0, pendingOrders: 0, revenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    const [orders, books, trainings, articles] = await Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('books').select('id', { count: 'exact' }),
      supabase.from('trainings').select('id', { count: 'exact' }),
      supabase.from('articles').select('id', { count: 'exact' }),
    ])

    const allOrders = orders.data || []
    const pending = allOrders.filter((o: any) => o.status === 'pending').length
    const revenue = allOrders.filter((o: any) => o.status === 'lunas').reduce((sum: number, o: any) => sum + (o.total || 0), 0)

    setStats({
      orders: allOrders.length,
      books: books.count || 0,
      trainings: trainings.count || 0,
      articles: articles.count || 0,
      pendingOrders: pending,
      revenue,
    })
    setRecentOrders(allOrders.slice(0, 5))
    setLoading(false)
  }

  const rupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

  const statusColor = (status: string) => {
    if (status === 'lunas') return 'bg-green-100 text-green-700'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow text-center col-span-2">
            <p className="text-3xl font-bold text-green-500">{rupiah(stats.revenue)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <p className="text-3xl font-bold text-orange-500">{stats.orders}</p>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <p className="text-3xl font-bold text-teal-500">{stats.books}</p>
            <p className="text-sm text-gray-500 mt-1">Buku</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <p className="text-3xl font-bold text-blue-500">{stats.trainings}</p>
            <p className="text-sm text-gray-500 mt-1">Training</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold text-[#1B3A5C]">Order Terbaru</h3>
          </div>
          {loading ? <p className="p-6 text-gray-400">Loading...</p> : recentOrders.length === 0 ? (
            <p className="p-6 text-gray-400 text-center">Belum ada orders.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Invoice</th>
                  <th className="text-left px-6 py-3">Nama</th>
                  <th className="text-left px-6 py-3">Produk</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs">{order.invoice_no}</td>
                    <td className="px-6 py-4">{order.name}</td>
                    <td className="px-6 py-4">{order.product_name}</td>
                    <td className="px-6 py-4">Rp {order.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}