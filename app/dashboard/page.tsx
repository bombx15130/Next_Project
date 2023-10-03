'use client'
import React, { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import Loading from './loading'

export default function Dashboard() {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className="dashboard-page">
      <div>hello world!</div>
      <Suspense fallback={<Loading/>}>
        <div>dashboard</div>
      </Suspense>
    </div>
  )
}
