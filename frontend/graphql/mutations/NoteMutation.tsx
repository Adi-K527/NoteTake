import { gql } from "@apollo/client" 


export const CREATE_NOTE = gql`
    mutation createnote($title: String!, $body: String!, $course: ID!, $user: ID!, $caption: String!){
        createnote(title: $title, body: $body, course: $course, user: $user, caption: $caption){
            id
            title
            body
        }
    }
`

export const UPDATE_NOTE = gql`
    mutation updatenote($newBody: String!, $note: ID!){
        updatenote(newBody: $newBody, note: $note){
            id
            title
            body
        }
    }
`
