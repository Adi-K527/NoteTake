"use client"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState } from 'react';
import parse from 'html-react-parser'
import { CREATE_NOTE } from '../../graphql/mutations/NoteMutation';
import { useMutation } from "@apollo/client"
import { useQuery } from '@apollo/client';
import { GET_NOTE } from '../../graphql/queries/NoteQuery';


export default function page() {
  const [text, setText] = useState("")
  const [createnote] = useMutation(CREATE_NOTE);
  const {data} = useQuery(GET_NOTE, {variables: {"id": "2a7f2db9-e5f4-477c-afc1-850881aa9b25"}})
  console.log(data?.note.body)

  const onSubmit = () => {
    createnote({variables: {"title": "someTitle", "body": text, "course": "756239b4-3eec-4d93-ba73-c96b2bed1f5b", "user": "4e6fa7fd-1554-4695-9df8-6410327626d1", "caption": "something"}})
  }

  

  return (
    <div>
        <div className='editor'>
            <CKEditor editor={ClassicEditor} data={text} onChange={(e: Event, editor: ClassicEditor) => {
                const data = editor.getData() 
                setText(data)
            }}>

            </CKEditor>
        </div>
        <div>
            <h2>Content</h2>
            <p>{parse(text)}</p>
        </div>
        <button onClick={onSubmit}/>
    </div>
  )
}

