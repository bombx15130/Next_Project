import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
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
