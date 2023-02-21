import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLScalarType, graphql } from "graphql"
import {Note, User, Course, Comment} from "@prisma/client"
import { PrismaClient } from ".prisma/client"
import {NoteType} from "./types"
import {CourseType} from "./types"
import {UserType} from "./types"
import {CommentType} from "./types"

const prisma = new PrismaClient()

const RootQueryType: GraphQLObjectType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        courses: {
            type: new GraphQLList(CourseType),
            description:"All courses",
            resolve: async () => { return await prisma.course.findMany({}) }
        },
        course: {
            type: CourseType,
            description: "Represents a course",
            args: {id: {type: GraphQLID}},
            resolve: async (parent, args) => { return await prisma.course.findUnique({where: {id: args.id}}) }
        },
        notes: {
            type: new GraphQLList(NoteType),
            description: "All notes",
            resolve: async () => { return await prisma.note.findMany({}) }
        },
        note: {
            type: NoteType,
            description: "single note",
            args: {id: {type: GraphQLID}},
            resolve: async (parent, args) => { return await prisma.note.findUnique({where: {id: args.id}}) }
        },
        users: {
            type: new GraphQLList(UserType),
            description: "All users",
            resolve: async () => { return await prisma.user.findMany({}) }
        },
        user: {
            type: UserType,
            description: "single user",
            args: {id: {type: GraphQLID}},
            resolve: async (parent, args) => { return await prisma.user.findUnique({where: {id: args.id}}) }
        }
    }) 
})

const RootMutationType: GraphQLObjectType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        createnote: {
            type: NoteType,
            description: "Create a note",
            args: {title: {type: GraphQLString}, body: {type: GraphQLString}, course: {type: GraphQLID}, user: {type: GraphQLID}, caption: {type: GraphQLString}},
            resolve: async (parent, args) => {
                return await prisma.note.create({data: {title: args.title, body: args.body, caption: args.caption, course: course, createdBy: args.user}})
            }
        },
        updatenote: {
            type: NoteType,
            description: "Edit a note",
            args: {text: {type: GraphQLString}, note: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: () => ({
                
            })
        },
        deletenote: {
            type: NoteType,
            description: "Delete a note",
            args: {note: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: () => ({
                
            })
        },
        comment: {
            type: CommentType,
            description: "Create a note",
            args: {text: {type: GraphQLString}, note: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: () => ({

            })
        },
        createcourse: {
            type: CourseType,
            description: "Create a course",
            args: {name: {type: GraphQLString}, description: {type: GraphQLString}, user: {type: GraphQLID}},
            resolve: () => ({

            })
        },
        joincourse: {
            type: CourseType,
            description: "Join a course",
            args: {course: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: () => ({

            })
        },
        leavecourse: {
            type: CourseType,
            description: "Leave a course",
            args: {course: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: () => ({

            })
        },
    }) 
})

export const schema: GraphQLSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})