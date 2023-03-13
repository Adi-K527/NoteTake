import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function Home() {

  return (
    <div>
      <Link href="/Courses"><h1>Courses</h1></Link>
      <Link href="/Notes"><h1>Notes</h1></Link>
    </div>
  )
}
