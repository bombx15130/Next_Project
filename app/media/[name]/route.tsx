import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path';
const ejs = require('ejs')

export async function GET(request: Request, { params }: { params: { name: string } }) {
  const name = params.name
  const filePath = path.resolve(`./app/media/${name.replace('m3u8', 'ejs')}`)
  if (name.endsWith('.m3u8')) {

    const file = fs.readFileSync(filePath, 'utf8')
    const template = ejs.compile(file)
    const m3u8 = template({ server: 'localhost', port: 3001 })
    return new Response(m3u8)
  } else {
    const file = fs.readFileSync(filePath)
    return new Response(file)
  }
}
