"use client"
import { useQuery } from '@apollo/client'
import { Course } from '@prisma/client'
import { GET_COURSES } from '../../graphql/queries/CourseQuery'
import Form from './Form'
import Link from 'next/link';


export default function Home() {
  const {data} = useQuery(GET_COURSES)
  return (
    <div>
      {data?.courses.map((course: Course) => (
        <SingleCourse course={course}/>
      ))}
      <Form />
    </div>
  )
}

type courseProps = {
  course: Course
}

function SingleCourse(props: courseProps){
  return (
    <div>
      <Link href={`/Courses/${props.course.id}`}><h1>{props.course.name}</h1></Link>
    </div>
)}