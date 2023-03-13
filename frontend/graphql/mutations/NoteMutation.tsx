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
