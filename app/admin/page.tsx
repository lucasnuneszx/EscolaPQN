import { redirect } from 'next/navigation'

// /admin redireciona automaticamente para /admin/dashboard
export default function AdminRoot() {
  redirect('/admin/dashboard')
}
