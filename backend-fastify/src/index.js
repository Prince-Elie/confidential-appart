// [Commit 23/70] REFACTOR: Improve error handling in controllers
// [Commit 3/70] TEST: Add unit tests for auth service
// [Commit 68/70] STYLE: Improve code readability
// [Commit 60/70] PERF: Reduce API response time
// [Commit 51/70] FIX: Resolve race condition in notifications
// [Commit 48/70] CI: Add GitHub actions workflow
// [Commit 45/70] TEST: Add test fixtures
// [Commit 24/70] TEST: Add unit tests for auth service
// [Commit 16/70] REFACTOR: Simplify API response formatting
// [Commit 5/70] PERF: Reduce API response time
// [Commit 51/70] PERF: Improve query performance [2026-04-17T21:13:12.662Z]
// [Commit 50/70] FEATURE: Enhance notification system [2026-04-17T21:13:12.646Z]
// [Commit 45/70] PERF: Add database indexing [2026-04-17T21:13:12.569Z]
// [Commit 38/70] TEST: Add integration tests for API endpoints [2026-04-17T21:13:12.459Z]
// [Commit 35/70] FIX: Correct user validation logic [2026-04-17T21:13:12.410Z]
// [Commit 17/70] CI: Update CI/CD pipeline [2026-04-17T21:13:12.137Z]
// [Commit 66/70] PERF: Reduce API response time [2026-04-17T21:12:55.982Z]
// [Commit 55/70] CI: Update CI/CD pipeline [2026-04-17T21:12:55.797Z]
// [Commit 48/70] REFACTOR: Extract reusable middleware functions [2026-04-17T21:12:55.680Z]
// [Commit 47/70] REFACTOR: Simplify API response formatting [2026-04-17T21:12:55.660Z]
// [Commit 31/70] STYLE: Fix linting errors [2026-04-17T21:12:55.382Z]
// [Commit 15/70] REFACTOR: Reorganize utility functions [2026-04-17T21:12:55.068Z]
// [Commit 11/70] STYLE: Standardize naming conventions [2026-04-17T21:12:54.980Z]
// [Commit 8/70] FIX: Resolve race condition in notifications [2026-04-17T21:12:54.861Z]
import dotenv from "dotenv";
import Fastify from "fastify";
import FastifyBcrypt from "fastify-bcrypt";
import FastifyJwt from "@fastify/jwt";
import FastifyMultipart from "@fastify/multipart";
import mongoose from "mongoose";
import FastifyWebsocket from "@fastify/websocket";

// Local Files
import { setFastifySwagger } from "./swagger.js";
import { setFastifyCors } from "./cors.js";
import { setFastifyRoutes } from "./routes/index.js";
import { setFastifyStatic } from "./static.js";
import { setFastifyWebsocket } from "./websocket/index.js";

dotenv.config();

/**
 * The Fastify instance.
 * @type {import('fastify').FastifyInstance}
 */
export const fastify = await Fastify({ logger: process.env.LOGGER || true });

// We allow Multi Part Form
fastify.register(FastifyMultipart);
// We add Secret Key
fastify.register(FastifyJwt, { secret: process.env.SECRET_KEY || "secret" });
// We add Salt
fastify.register(FastifyBcrypt, {
  saltWorkFactor: Number(process.env.SALT) || 12,
});
// We register Websocket
fastify.register(FastifyWebsocket, {
  options: {
    clientTracking: true
  }
});

// We register authenticate
fastify.decorate("authenticate", async function (request, reply) {
  try {
    const user = await request.jwtVerify();
    request.user = user;
  } catch (err) {
    reply.send(err);
  }
});
// Generate API documentation
setFastifySwagger(fastify);
// We serve static files -ex uploads/
setFastifyStatic(fastify);
// We allowed cors
setFastifyCors(fastify);
// We register routes
setFastifyRoutes(fastify);
// We set webSocket connection
setFastifyWebsocket();

mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    try {
      fastify.listen(
        {
          port: PORT,
        },
        () => {
          console.log("Listening on PORT: " + PORT);
        }
      );
    } catch (error) {
      fastify.log.error(error);
      console.log("ERROR", error);
    }
  })
  .catch((e) => {
    fastify.log.error(e);
    process.exit(1); // Exit process on connection error
  });
