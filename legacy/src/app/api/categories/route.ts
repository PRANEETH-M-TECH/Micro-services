import { NextResponse } from 'next/server'
import { SEED_CATEGORIES } from '@/lib/db-schema'

/**
 * GET /api/categories — list fixed marketplace categories
 */
export async function GET() {
  return NextResponse.json(
    {
      categories: SEED_CATEGORIES,
      count: SEED_CATEGORIES.length,
    },
    { status: 200 }
  )
}
