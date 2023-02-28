import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLScalarType } from "graphql"
import {Note, User, Course, Comment} from "@prisma/client"
import { PrismaClient } from ".prisma/client"
import { userInfo } from "os"

const prisma = new PrismaClient()

//types
export const NoteType: GraphQLObjectType = new GraphQLObjectType({
    name: "Note",
    description: "Represents a note",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLID)},
        title: {type: GraphQLNonNull(GraphQLString)},
        caption: {type: GraphQLNonNull(GraphQLString)},
        body: {type: GraphQLNonNull(GraphQLString)},
        comments: {
            type: GraphQLList(CommentType),
            resolve: async (Note) => {
                const note: Note | null = await prisma.note.findUnique({
                    where: {id: Note.id},
                    include: {comments: true}
                })
                return note?.comments
            }
        },
        course: {
            type: CourseType,
            resolve: async (Note) => {
                const note: Note | null = await prisma.note.findUnique({
                    where: {id: Note.id},
                })
                return await prisma.course.findUnique({where: {id: note?.courseid}})
            }
        },
        createdBy: {
            type: UserType,
            resolve: async (Note) => {
                const note: Note | null = await prisma.note.findUnique({
                    where: {id: Note.id},
                })
                return await prisma.user.findUnique({where: {id: note?.userid}})
            }
        }
    })
})

export const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: "User",
    description: "Represents a user",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLID)},
        firstName: {type: GraphQLNonNull(GraphQLString)},
        lastName: {type: GraphQLNonNull(GraphQLString)},
        userName: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
        notes: {
            type: GraphQLList(NoteType),
            resolve: async (User) => {
                const user: User | null = await prisma.user.findUnique({
                    where: {id: User.id},
                    include: {createdNotes: true}
                })
                return user?.createdNotes
            }
        },
        courses: {
            type: GraphQLList(CourseType),
            resolve: async (User) => {
                const user: User | null = await prisma.user.findUnique({
                    where: {id: User.id},
                    include: {joinedCourses: true}
                })
                return user?.joinedCourses
            }
        },
    })
})

export const CourseType: GraphQLObjectType = new GraphQLObjectType({
    name: "Course",
    description: "Represents a course",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
        notes: {
            type: GraphQLList(NoteType),
            resolve: async (Course) => {
                const course: Course | null = await prisma.course.findUnique({
                    where: {id: Course.id},
                    include: {notes: true}
                })
                return course?.notes
            }
        },
        members: {
            type: GraphQLList(UserType),
            resolve: async (Course) => {
                const course: Course | null = await prisma.course.findUnique({
                    where: {id: Course.id},
                    include: {members: true}
                })

                return course?.members
            }
        },
    })
})


export const CommentType: GraphQLObjectType = new GraphQLObjectType({
    name: "Comment",
    description: "Represents a comment",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLNonNull(GraphQLString)},
        Note: {
            type: NoteType,
            resolve: async (comment) => {
                return await prisma.note.findUnique({ where: {id: comment.noteid} })
            }
        },
        User: {
            type: UserType,
            resolve: async (comment) => {
                return await prisma.user.findUnique({ where: {id: comment.userid} })
            }
        }
    })
})

