import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLScalarType, graphql, GraphQLBoolean } from "graphql"
import {Note, User, Course, Comment} from "@prisma/client"
import { PrismaClient } from ".prisma/client"
import {NoteType} from "./types"
import {CourseType} from "./types"
import {UserType} from "./types"
import {CommentType} from "./types"
import bcrypt from "bcryptjs" 



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
        register: {//     (firstName, lastName, userName)
            type: UserType,
            description: "Register a user",
            args: {firstName: {type: GraphQLString}, lastName: {type: GraphQLString}, userName: {type: GraphQLString}, password: {type: GraphQLString}},
            resolve: async (parent, args, context) => {
                const salt = await bcrypt.genSalt(12)
                const hashed_password = await bcrypt.hash(args.password, salt);
                const user: User = await prisma.user.create({data: {firstName: args.firstName, lastName: args.lastName, userName: args.userName, password: hashed_password}})

                context.req.session.userid = user.id
                return user
            }
        },
        login: {//     (firstName, lastName, userName)
            type: UserType,
            description: "Register a user",
            args: {userName: {type: GraphQLString}, password: {type: GraphQLString}},
            resolve: async (parent, args, context) => {
                const user = await prisma.user.findUnique({where: {userName: args.userName}})
                if (user) {
                    const passwordMatch = await bcrypt.compare(args.password, user.password);
                    if (passwordMatch){
                        context.req.session.userid = user.id
                        return user
                    }
                }
                throw new Error("Invalid Credentials")
            }
        },
        logout: {//     ()
            type: GraphQLBoolean,
            description: "Register a user",
            resolve: async (parent, args, context) => {
                context.req.session.destroy((err: Error) => {
                    if (err) {
                      throw new Error('Could not logout');
                    }
                  });
                  return true;
            }
        },
        createnote: {//     (title, body, course, user, caption)
            type: NoteType,
            description: "Create a note",
            args: {title: {type: GraphQLString}, body: {type: GraphQLString}, course: {type: GraphQLID}, user: {type: GraphQLID}, caption: {type: GraphQLString}},
            resolve: async (parent, args) => {
                return await prisma.note.create({data: {title: args.title, body: args.body, caption: args.caption, createdBy: {connect: {id: args.user}}, course: {connect: {id: args.course}}}})
            }
        },
        updatenote: {//       (newBody, note)
            type: NoteType,
            description: "Edit a note",
            args: {newBody: {type: GraphQLString}, note: {type: GraphQLID}},
            resolve: async (parent, args) => {                
                return await prisma.note.update({where: {id: args.note}, data: {body: args.newBody}})
            }
        },
        deletenote: {//       (note)
            type: NoteType,
            description: "Delete a note",
            args: {note: {type: GraphQLID}},
            resolve: async (parent, args) => {
                try {
                    await prisma.$transaction(async (prisma) => {
                        const note: Note | null = await prisma.note.findUnique({where: {id: args.note}, include: {comments: true}})
                        await prisma.comment.deleteMany({where: {noteid: args.noteid}})
                        return await prisma.note.delete({where: {id: args.note}, include: {comments: true}})
                    })
                } 
                catch (error){
                    console.error(error);
                    throw new Error('Failed to delete note and comments');
                }
            }
        },
        comment: {//        (text, Note, User)
            type: CommentType,
            description: "Create a note",
            args: {text: {type: GraphQLString}, Note: {type: GraphQLID}, User: {type: GraphQLID}},
            resolve: async (parent, args) => {
                return await prisma.comment.create({data: {text: args.text, Note: {connect: {id: args.Note}}, User: {connect: {id: args.User}}}})
            }
        },
        createcourse: {//       (name, description)
            type: CourseType,
            description: "Create a course",
            args: {name: {type: GraphQLString}, description: {type: GraphQLString}},
            resolve: async (parent, args) => {
                return await prisma.course.create({data: {name: args.name, description: args.description}}) 
            }
        },
        joincourse: {//         (course, user)
            type: CourseType,
            description: "Join a course",
            args: {course: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: async (parent, args) => {
                const joinedCourse: Course | null = await prisma.course.findUnique({where: {id: args.course}})
                const user: User | null = await prisma.user.findUnique({where: {id: args.user}})
                if (user && joinedCourse) {   
                    return await prisma.course.update({where: {id: args.course}, data: {members: {connect: [{id: args.user}]}}})
                }
                return null
            }
        },
        leavecourse: {//        (course, user)
            type: CourseType,
            description: "Leave a course",
            args: {course: {type: GraphQLID}, user: {type: GraphQLID}},
            resolve: async (parent, args) => {
                const joinedCourse: Course | null = await prisma.course.findUnique({where: {id: args.course}})
                const user: User | null = await prisma.user.findUnique({where: {id: args.user}})
                if (user && joinedCourse) { 
                    return await prisma.course.update({where: {id: args.course}, data:{members: {disconnect: [{id: args.user}]}}})
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