import { gql } from "@apollo/client"


export const GET_NOTE = gql`
    query note($id: ID!) {
        note(id: $id){ 
            id
            title
            body
        }
    }
`

export const GET_NOTES = gql`
    query notes {
        notes { 
            id
            title
            body
        }
    }
`


