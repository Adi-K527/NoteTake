import { gql } from "@apollo/client"


export const GET_COURSES = gql`
    query courses {
        courses { 
            id
            name
            description
        }
    }
`

export const GET_COURSE = gql`
    query course($id: ID!) {
        courses(id: $id) { 
            id
            name
            description
        }
    }
`


