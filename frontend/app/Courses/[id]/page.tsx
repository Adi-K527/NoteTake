"use client"
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { GET_COURSE } from '../../../graphql/queries/CourseQuery'


export default function page() {
  const router = useRouter()
  const {id} = router.query

  const { loading, error, data } = useQuery(GET_COURSE, { variables: {id} })
  return (
    <div>
        <h1>{data.course.name}</h1>
    </div>
  )
}
