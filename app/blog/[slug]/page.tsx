'use client'
import React from 'react'

export default function Blog({params}: { params: { slug: string } }) {
  const { slug } = params
  return (
    <div className="blog-page">blog {slug}</div>
  )
}
