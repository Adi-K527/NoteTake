"use client"
import { useMutation, useQuery } from "@apollo/client"
import { Note } from "@prisma/client"
import { redirect } from "next/dist/server/api-utils"
import Link from "next/link"
import { GET_NOTES } from "../../graphql/queries/NoteQuery"
import { useRouter } from 'next/navigation'



export default function page() {

  const {data} = useQuery(GET_NOTES)
  const router = useRouter()

  return (
    <div>
      {data?.notes.map((note: Note) => (
        <OneNote note={note}/>
      ))}
      <button onClick={() => {router.push("/Notes/CreateNote")}}/>
    </div>
  )
}

type noteProps = {
  note: Note
}

function OneNote(props: noteProps){
  return (
    <div>
      <Link href={`/Notes/${props.note.id}`}><h1>{props.note.title}</h1></Link>
    </div>
)}
