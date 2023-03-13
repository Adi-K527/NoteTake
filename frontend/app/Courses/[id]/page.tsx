"use client"
import { useQuery } from '@apollo/client'
import { usePathname } from 'next/navigation'
import { GET_COURSE } from '../../../graphql/queries/CourseQuery'



export default function page() {
  const pathname = usePathname()
  let id = pathname.split('/')[2]
  const { data } = useQuery(GET_COURSE, {variables: {id}})
  return (
    <div>
        <h1>{data?.course.name}</h1>
    </div>
  )
}
