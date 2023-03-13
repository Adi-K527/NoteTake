"use client"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState, useEffect } from 'react'
import parse from 'html-react-parser'
import { useMutation, useQuery } from '@apollo/client'
import { GET_NOTE } from '../../../graphql/queries/NoteQuery'
import { usePathname } from 'next/navigation';
import { UPDATE_NOTE } from '../../../graphql/mutations/NoteMutation';
import { useRouter } from 'next/navigation';


export default function page() {
  const pathname = usePathname()
  let id = pathname.split('/')[2]

  const [text, setText] = useState("asd")
  const {data} = useQuery(GET_NOTE, {variables: {"id": id}})
  const [updatenote] = useMutation(UPDATE_NOTE)
  const router = useRouter()

  useEffect(() => {
    if (data){
      setText(data.note.body)
    }
  }, [data])
  
  const onClick = () => {
    updatenote({variables: {"newBody": text, "note": id}})
  }

  return (
    <div>
      <button onClick={() => {router.push("/")}}/>
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
        <button onClick={onClick}/>
    </div>
  )
}

