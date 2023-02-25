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
        createuser: {
            type: UserType,
            description: "Create a user",
            args: {firstName: {type: GraphQLString}, lastName: {type: GraphQLString}, userName: {type: GraphQLString}},
            resolve: async (parent, args) => {
                return await prisma.user.create({data: {firstName: args.firstName, lastName: args.lastName, userName: args.userName}})
            }
        },
        createnote: {
            type: NoteType,
            description: "Create a note",
            args: {title: {type: GraphQLString}, body: {type: GraphQLString}, course: {type: GraphQLID}, user: {type: GraphQLID}, caption: {type: GraphQLString}},
            resolve: async (parent, args) => {
                return await prisma.note.create({data: {title: args.title, body: args.body, caption: args.caption, createdBy: args.user, course: args.course}})
            }
        },
        updatenote: {
            type: NoteType,
            description: "Edit a note",
            args: {newBody: {type: GraphQLString}, note: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: async (parent, args) => {
                return await prisma.note.update({where: {id: args.note}, data:{body: args.newBody}})
            }
        },
        deletenote: {
            type: NoteType,
            description: "Delete a note",
            args: {note: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: async (parent, args) => {
                return await prisma.note.delete({where: {id: args.note}})
            }
        },
        comment: {
            type: CommentType,
            description: "Create a note",
            args: {text: {type: GraphQLString}, note: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: async (parent, args) => {
                return await prisma.comment.create({data: {text: args.text, noteid: args.note}})
            }
        },
        createcourse: {
            type: CourseType,
            description: "Create a course",
            args: {name: {type: GraphQLString}, description: {type: GraphQLString}},
            resolve: async (parent, args) => {
                return await prisma.course.create({data: {name: args.name, description: args.description}}) 
            }
        },
        joincourse: {
            type: CourseType,
            description: "Join a course",
            args: {course: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: async (parent, args) => {
                var joinedCourse: Course | null = await prisma.course.findUnique({where: {id: args.course}})
                const user: User | null = await prisma.user.findUnique({where: {id: args.user}})
                if (user && joinedCourse) {   
                    console.log("hi")
                    if (joinedCourse.members){
                        joinedCourse.members.push(user)
                        return await prisma.course.update({where: {id: args.course}, data:{members: {set: {...joinedCourse.members}}}})
                    }
                    else {
                        let members: User[] = [user]
                        return await prisma.course.update({where: {id: args.course}, data:{members: {set: {...members}}}})
                    }
                }
                return []
            }
        },
        leavecourse: {
            type: CourseType,
            description: "Leave a course",
            args: {course: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: async (parent, args) => {
                const joinedCourse: Course | null = await prisma.course.findUnique({where: {id: args.course}})
                const user: User | null = await prisma.user.findUnique({where: {id: args.user}})
                if (user && joinedCourse) { 
                    let members: User[] = joinedCourse.members
                    members.forEach((member, index) => {
                        if (member.id === user.id){
                            members.splice(index, 1)
                        }
                    })
                    return await prisma.course.update({where: {id: args.course}, data:{members: {set: members}}})
                }
                return null
            }
        },
    }) 
})

export const schema: GraphQLSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})