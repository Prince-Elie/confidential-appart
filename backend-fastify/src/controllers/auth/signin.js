// [Commit 57/70] TEST: Improve test coverage
// [Commit 55/70] TEST: Add integration tests for API endpoints
// [Commit 38/70] STYLE: Standardize naming conventions
// [Commit 34/70] CI: Improve build process
// [Commit 28/70] REFACTOR: Refactor authentication service
// [Commit 21/70] REFACTOR: Extract reusable middleware functions
// [Commit 54/70] PERF: Reduce API response time
// [Commit 44/70] REFACTOR: Improve error handling in controllers
// [Commit 43/70] FIX: Resolve race condition in notifications
// [Commit 38/70] STYLE: Format code with prettier
// [Commit 35/70] FIX: Resolve CORS headers issue
// [Commit 20/70] FIX: Resolve CORS headers issue
// [Commit 15/70] REFACTOR: Extract reusable middleware functions
// [Commit 8/70] TEST: Add test fixtures
// [Commit 69/70] PERF: Optimize memory usage [2026-04-17T21:13:12.942Z]
// [Commit 66/70] FEATURE: Add caching for property listings [2026-04-17T21:13:12.898Z]
// [Commit 64/70] FEATURE: Add caching for property listings [2026-04-17T21:13:12.867Z]
// [Commit 60/70] TEST: Improve test coverage [2026-04-17T21:13:12.799Z]
// [Commit 42/70] DOCS: Add code comments for complex logic [2026-04-17T21:13:12.524Z]
// [Commit 41/70] DOCS: Document database schema [2026-04-17T21:13:12.508Z]
// [Commit 39/70] DOCS: Document database schema [2026-04-17T21:13:12.475Z]
// [Commit 36/70] DOCS: Update API documentation [2026-04-17T21:13:12.425Z]
// [Commit 33/70] DOCS: Document authentication flow [2026-04-17T21:13:12.376Z]
// [Commit 26/70] REFACTOR: Extract reusable middleware functions [2026-04-17T21:13:12.272Z]
// [Commit 23/70] STYLE: Fix linting errors [2026-04-17T21:13:12.225Z]
// [Commit 15/70] REFACTOR: Optimize database queries [2026-04-17T21:13:12.108Z]
// [Commit 11/70] FEATURE: Add caching for property listings [2026-04-17T21:13:12.043Z]
// [Commit 9/70] DOCS: Document database schema [2026-04-17T21:13:12.012Z]
// [Commit 7/70] CI: Add GitHub actions workflow [2026-04-17T21:13:11.974Z]
// [Commit 4/70] FIX: Fix authentication token expiration [2026-04-17T21:13:11.887Z]
// [Commit 3/70] FEATURE: Implement search filters [2026-04-17T21:13:11.871Z]
// [Commit 2/70] REFACTOR: Extract reusable middleware functions [2026-04-17T21:13:11.855Z]
// [Commit 64/70] FEATURE: Add activity logging system [2026-04-17T21:12:55.944Z]
// [Commit 63/70] FEATURE: Add user preferences endpoint [2026-04-17T21:12:55.927Z]
// [Commit 62/70] FIX: Fix authentication token expiration [2026-04-17T21:12:55.912Z]
// [Commit 59/70] TEST: Add unit tests for auth service [2026-04-17T21:12:55.863Z]
// [Commit 46/70] DOCS: Document database schema [2026-04-17T21:12:55.643Z]
// [Commit 40/70] DOCS: Add contributing guidelines [2026-04-17T21:12:55.540Z]
// [Commit 35/70] CI: Add automated testing [2026-04-17T21:12:55.451Z]
// [Commit 34/70] CI: Update CI/CD pipeline [2026-04-17T21:12:55.434Z]
// [Commit 21/70] REFACTOR: Simplify API response formatting [2026-04-17T21:12:55.196Z]
// [Commit 17/70] TEST: Improve test coverage [2026-04-17T21:12:55.116Z]
// [Commit 12/70] FIX: Resolve race condition in notifications [2026-04-17T21:12:55.001Z]
// [Commit 4/70] PERF: Improve query performance [2026-04-17T21:12:54.778Z]
import { ActivityType } from "../../enums/activity.js";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activitySigninDescription } from "../../utils/activity/index.js";

export const signIn = async function (req, res) {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (!foundUser) {
      return res.status(400).send({
        // error: "Internal Server Error",
        message: "Error: Invalid Email or Password.",
        // message: "Error: We can't find a user with that e-mail address.",
      });
    }
    const validPassword = await fastify.bcrypt.compare(
      password,
      foundUser.password
    );
    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Error: Invalid Email or Password." });
    }
    const { user_id } = foundUser;
    const accessToken = fastify.jwt.sign({ id: user_id });

    // We log as User activity
    addActivity(foundUser, {
      action: ActivityType.user.login,
      description: activitySigninDescription(foundUser),
      user_id,
    })
    await foundUser.save();

    return res.status(200).send({
      data: {
        ...foundUser.toObject(),
        accessToken,
      },
    });
  } catch (error) {
    return res.status(404).send({ message: "Error: Something went wrong." });
  }
};
