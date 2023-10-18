import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://openapi.taifex.com.tw/v1/SingleStockFuturesMargining')
  const data = await res.json()
 
  return NextResponse.json(data)
}