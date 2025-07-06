// [Commit 4/70] FEATURE: Add activity logging system
// [Commit 53/70] TEST: Add test fixtures
// [Commit 42/70] FEATURE: Enhance notification system
// [Commit 34/70] REFACTOR: Refactor authentication service
// [Commit 29/70] DOCS: Update API documentation
// [Commit 28/70] FIX: Fix null pointer exception in property handler
// [Commit 23/70] DOCS: Document authentication flow
// [Commit 22/70] STYLE: Fix linting errors
// [Commit 13/70] TEST: Add validation tests
// [Commit 6/70] TEST: Add test fixtures
// [Commit 65/70] TEST: Improve test coverage [2026-04-17T21:13:12.883Z]
// [Commit 56/70] REFACTOR: Extract reusable middleware functions [2026-04-17T21:13:12.739Z]
// [Commit 55/70] TEST: Add test fixtures [2026-04-17T21:13:12.724Z]
// [Commit 46/70] CI: Improve build process [2026-04-17T21:13:12.583Z]
// [Commit 43/70] FIX: Resolve CORS headers issue [2026-04-17T21:13:12.539Z]
// [Commit 6/70] STYLE: Format code with prettier [2026-04-17T21:13:11.919Z]
// [Commit 54/70] FEATURE: Enhance notification system [2026-04-17T21:12:55.779Z]
// [Commit 50/70] PERF: Add database indexing [2026-04-17T21:12:55.712Z]
// [Commit 41/70] FIX: Correct user validation logic [2026-04-17T21:12:55.556Z]
// [Commit 29/70] FIX: Fix authentication token expiration [2026-04-17T21:12:55.348Z]
// [Commit 24/70] FEATURE: Implement search filters [2026-04-17T21:12:55.254Z]
// [Commit 9/70] PERF: Reduce API response time [2026-04-17T21:12:54.894Z]
// [Commit 1/70] CI: Add GitHub actions workflow [2026-04-17T21:12:54.687Z]
import { User } from "../models/user.js";

/**
 * @typedef {Object} Activity
 * @property {string} action - The action taken (e.g., "ENQUIRY_NEW", "ENQUIRY_DELETE", etc).
 * @property {string} description - A description of the activity.
 * @property {string} [property_id] - The ID of the Property.
 * @property {string} [enquiry_id] - The ID of the Enquiry.
 */

/**
 * @typedef {Object} User
 * @property {string} user_id
 * @property {string} fullName
 * @property {string} email
 * @property {Array} [properties]
 * @property {Array} [activities]
 * @property {Array} [notifications]
 */

/**
 * @param {Activity} activity
 * @param {User} user
 * @returns {Activity}
 */
export const addActivity = function (user, activity) {
  if (!user) {
    throw new Error("Error: User not found");
  }
  try {
    // We check users activities to prevent from exceeding the limit
    if (user.activities.length >= (Number(process.env.USER_ACTIVITIES_MAX) || 20)) {
      user.activities.pop();
    }
    user.activities.unshift(activity);

    return activity;
  } catch (error) {
    console.error(error);
    return error;
  }
};
