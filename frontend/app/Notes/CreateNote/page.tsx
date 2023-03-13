"use client"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState } from 'react';
import parse from 'html-react-parser'
import { CREATE_NOTE } from '../../../graphql/mutations/NoteMutation';
import { useMutation } from "@apollo/client"
import { useQuery } from '@apollo/client';
import { GET_NOTE } from '../../../graphql/queries/NoteQuery';
import { useRouter } from 'next/navigation';


export default function page() {
  const [title, setTitle] = useState("")
  const [createnote] = useMutation(CREATE_NOTE);
  const router = useRouter()

  const onSubmit = async (e) => {
    e.preventDefault()
    const data = await createnote({variables: {"title": title, "body": "Edit note...", "course": "756239b4-3eec-4d93-ba73-c96b2bed1f5b", "user": "4e6fa7fd-1554-4695-9df8-6410327626d1", "caption": ""}})
    router.push(`/Notes/${data?.data.createnote.id}`)
  }

  

  return (
    <div>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder='title' value={title} onChange={(e) => {setTitle(e.target.value)}}/>
            <button type="submit"/>
        </form>
    </div>
  )
}

