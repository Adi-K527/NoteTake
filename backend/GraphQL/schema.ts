import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLScalarType } from "graphql"
import {Note, User, Course, Comment} from "@prisma/client"
import { PrismaClient } from ".prisma/client"
import NoteType from "./types"
import CourseType from "./types"
import UserType from "./types"
import CommentType from "./types"


const RootQueryType: GraphQLObjectType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({

    }) 
})

const RootMutationType: GraphQLObjectType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        
    }) 
})

export const schema: GraphQLSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})