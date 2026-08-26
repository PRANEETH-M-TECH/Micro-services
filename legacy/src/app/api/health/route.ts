import { NextResponse } from 'next/server'

/**
 * GET /api/health — container health check for Docker / Jenkins
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'communa',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}
