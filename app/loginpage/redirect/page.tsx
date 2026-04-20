import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/loginpage')
  }

  if (session.user.role === 'admin') {
    redirect('/adminpage')
  }

  if (!session.user.isProfileComplete) {
    redirect('/loginpage/additionalinfo')
  }

  redirect('/')
}