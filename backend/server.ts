import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors  from "cors";
import {schema} from "./GraphQL/schema"


const app = express()


app.use(cors())
app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true }))



app.listen(5000, () => {console.log("Server is listening on port 5000")})


