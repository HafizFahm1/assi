import { createFileRoute } from '@tanstack/react-router'
import { AdminLoginPage } from '@/components/admin/AdminLoginPage'

export const Route = createFileRoute('/admin/')({
  component: AdminLoginPage,
})