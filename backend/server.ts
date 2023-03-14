import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import {schema} from "./GraphQL/schema"

const app = express()

import passport from "passport";
import session from "express-session";
import connectRedis from "connect-redis"
import * as redis from "redis"

const RedisStore = connectRedis(session);

const redisClient = redis.createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: "ueryqoieuwryoq",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,  // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10, // session max age in milliseconds
      },
    })
   );
   app.use(passport.initialize());
   app.use(passport.session());


app.use(cors())
app.use('/graphql', graphqlHTTP((req) => ({schema, context: { req }, graphiql: true})));


app.listen(5000, () => {console.log("Server is listening on port 5000")})


