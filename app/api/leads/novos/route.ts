import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || (session.perfil !== 'ADMIN' && session.perfil !== 'SECRETARIA')) {
      return NextResponse.json({ unreadCount: 0, latestLead: null }, { status: 401 })
    }

    const [unreadCount, latestLead] = await Promise.all([
      prisma.formularioMatricula.count({
        where: { lido: false },
      }),
      prisma.formularioMatricula.findFirst({
        where: { lido: false },
        orderBy: { criadoEm: 'desc' },
      }),
    ])

    return NextResponse.json({
      unreadCount,
      latestLead,
    })
  } catch (error) {
    return NextResponse.json({ unreadCount: 0, latestLead: null }, { status: 500 })
  }
}
