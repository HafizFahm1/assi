import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-3xl font-bold text-orange-500">0</p>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-3xl font-bold text-teal-500">0</p>
            <p className="text-sm text-gray-500 mt-1">Total Buku</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-3xl font-bold text-blue-500">0</p>
            <p className="text-sm text-gray-500 mt-1">Total Training</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-3xl font-bold text-green-500">0</p>
            <p className="text-sm text-gray-500 mt-1">Total Artikel</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}