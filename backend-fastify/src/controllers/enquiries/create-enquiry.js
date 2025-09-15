// [Commit 45/70] STYLE: Format code with prettier
// [Commit 24/70] PERF: Reduce API response time
// [Commit 7/70] FEATURE: Implement pagination for enquiries
// [Commit 6/70] TEST: Add validation tests
// [Commit 1/70] TEST: Add unit tests for auth service
// [Commit 66/70] FEATURE: Add activity logging system
// [Commit 64/70] DOCS: Add contributing guidelines
// [Commit 63/70] CI: Add automated testing
// [Commit 59/70] TEST: Add unit tests for auth service
// [Commit 58/70] PERF: Optimize memory usage
// [Commit 40/70] TEST: Add validation tests
// [Commit 36/70] STYLE: Standardize naming conventions
// [Commit 31/70] STYLE: Improve code readability
// [Commit 18/70] TEST: Improve test coverage
// [Commit 11/70] FEATURE: Add caching for property listings
// [Commit 9/70] DOCS: Document authentication flow
// [Commit 70/70] REFACTOR: Reorganize utility functions [2026-04-17T21:13:12.958Z]
// [Commit 52/70] TEST: Improve test coverage [2026-04-17T21:13:12.679Z]
// [Commit 37/70] FIX: Fix authentication token expiration [2026-04-17T21:13:12.443Z]
// [Commit 31/70] FEATURE: Add caching for property listings [2026-04-17T21:13:12.346Z]
// [Commit 24/70] CI: Improve build process [2026-04-17T21:13:12.241Z]
// [Commit 67/70] STYLE: Standardize naming conventions [2026-04-17T21:12:55.997Z]
// [Commit 51/70] STYLE: Improve code readability [2026-04-17T21:12:55.731Z]
// [Commit 42/70] TEST: Add test fixtures [2026-04-17T21:12:55.574Z]
// [Commit 23/70] FIX: Fix null pointer exception in property handler [2026-04-17T21:12:55.235Z]
// [Commit 19/70] REFACTOR: Optimize database queries [2026-04-17T21:12:55.161Z]
// [Commit 18/70] PERF: Optimize memory usage [2026-04-17T21:12:55.136Z]
// [Commit 14/70] CI: Update CI/CD pipeline [2026-04-17T21:12:55.045Z]
// [Commit 2/70] CI: Update CI/CD pipeline [2026-04-17T21:12:54.740Z]
import { Enquiry } from "../../models/enquiry.js";
import { v4 as uuidV4 } from "uuid";
import { User } from "../../models/user.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { SocketNotificationType } from "../../enums/notifications.js";
import { addActivity } from "../../services/activity.js";
import { ActivityType } from "../../enums/activity.js";
import { activityEnquiryDescription } from "../../utils/activity/index.js";

/**
 * Creates an enquiry.
 * @param {import('fastify').FastifyRequest} req - The Fastify request object.
 * @param {import('fastify').FastifyReply} res - The Fastify reply object.
 */
export const createEnquiry = async function (req, res) {
  const { title, content, topic, email, userTo, property } = req.body;
  if (!title || !content || !topic || !email || !userTo) {
    return res.status(400).send({ message: "Some fields are missing!" });
  }
  const userFrom = req.user.id;

  if (userFrom === userTo) {
    return res
      .status(400)
      .send({ message: "Not allowed to send enquiry to yourself." });
  }

  // const targetUser = await User.findOne({ user_id: userTo });
  const users = await User.find({ $or: [{user_id: userFrom}, { user_id: userTo}]});
  if (users.length < 2) {
    return res.status(404).send({ message: "Target users are not found." });
  }
  try {
    const newEnquiry = new Enquiry({
      enquiry_id: uuidV4(),
      read: false,
      users: {
        from: { user_id: userFrom, keep: true },
        to: { user_id: userTo, keep: true },
      },
      property,
      ...req.body,
    });
    await newEnquiry.save();

    // We Log User activity
    const user = users.find((item) => item.user_id === userFrom);
    const activity = addActivity(user, {
      action: ActivityType.enquiry.new,
      description: activityEnquiryDescription(ActivityType.enquiry.new, newEnquiry),
      enquiry_id: newEnquiry.enquiry_id,
    })
    await user.save();

    // Send Websocket Notification to update User activity.
    if (activity) {
      sendTargetedNotification(SocketNotificationType.activity, activity, userFrom);
    }
    // Send Enquiry notification to Intended User.
    sendTargetedNotification(SocketNotificationType.enquiry, newEnquiry, userTo);

    res.status(201).send({ data: newEnquiry });
    return;
  } catch (error) {
    return res.status(400).send(error);
  }
};
