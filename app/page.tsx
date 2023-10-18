import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import { useEffect } from 'react'

// export async function getData() {
//   const res = await fetch('https://openapi.taifex.com.tw/v1/SingleStockFuturesMargining')
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.
 
//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error('Failed to fetch data')
//   }
 
//   return res.json()
// }

export default async function Home() {
  // const data = await getData()
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        {
          [0, 1, 2].map((num, i) =>
            <div key={i}>
              <Link href={`/blog/${num}`}>blog{num}</Link>
            </div>
          )
        }

      </div>
    </main>
  )
}
