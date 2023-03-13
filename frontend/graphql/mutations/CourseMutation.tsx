import { gql } from "@apollo/client" 


export const CREATE_COURSE = gql`
    mutation createcourse($name: String!, $description: String!){
        createcourse(name: $name, description: $description){
            id
            name
            description
        }
    }
`


