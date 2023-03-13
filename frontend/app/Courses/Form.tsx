'use client';
import { useMutation } from "@apollo/client"
import { CREATE_COURSE } from "../../graphql/mutations/CourseMutation";
import {useState} from "react"
import { GET_COURSES } from "../../graphql/queries/CourseQuery";


export default function Form() {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [createcourse] = useMutation(CREATE_COURSE, {refetchQueries: [{query: GET_COURSES}]});

  const onSubmit = (e: any) => {
    e.preventDefault()
    createcourse({variables: {name, description}})
    setName("")
    setDescription("")
  }

  return (
    <div>
        <form onSubmit={onSubmit}>
            <input type='text' placeholder="Course name" value={name} onChange={(e: any) => {setName(e.target.value)}}/>
            <input type='text' placeholder="Description" value={description} onChange={(e: any) => {setDescription(e.target.value)}}/>
            <button type='submit'/>
        </form>
    </div>
  )
}
