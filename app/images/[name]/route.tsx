import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path';

export async function GET(request: Request, { params }: { params: { name: string } }) {
  const name = params.name
  const filePath = path.resolve(`./app/images/${name.replace('m3u8', 'ejs')}`)
  const file = fs.readFileSync(filePath)
  return new Response(file)
}
