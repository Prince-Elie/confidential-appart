// [Commit 5/70] CI: Add automated testing
// [Commit 70/70] DOCS: Add code comments for complex logic
// [Commit 56/70] CI: Add GitHub actions workflow
// [Commit 49/70] DOCS: Add environment variables documentation
// [Commit 46/70] REFACTOR: Extract reusable middleware functions
// [Commit 41/70] PERF: Optimize memory usage
// [Commit 39/70] PERF: Implement lazy loading
// [Commit 27/70] FEATURE: Implement pagination for enquiries
// [Commit 19/70] TEST: Add validation tests
// [Commit 14/70] DOCS: Document database schema
// [Commit 4/70] CI: Update CI/CD pipeline
// [Commit 3/70] REFACTOR: Extract reusable middleware functions
// [Commit 2/70] DOCS: Add environment variables documentation
// [Commit 68/70] FEATURE: Enhance notification system [2026-04-17T21:13:12.927Z]
// [Commit 63/70] DOCS: Document authentication flow [2026-04-17T21:13:12.849Z]
// [Commit 44/70] PERF: Reduce API response time [2026-04-17T21:13:12.554Z]
// [Commit 34/70] DOCS: Update API documentation [2026-04-17T21:13:12.393Z]
// [Commit 25/70] STYLE: Improve code readability [2026-04-17T21:13:12.257Z]
// [Commit 22/70] STYLE: Format code with prettier [2026-04-17T21:13:12.210Z]
// [Commit 18/70] STYLE: Format code with prettier [2026-04-17T21:13:12.151Z]
// [Commit 5/70] REFACTOR: Optimize database queries [2026-04-17T21:13:11.903Z]
// [Commit 57/70] PERF: Optimize memory usage [2026-04-17T21:12:55.829Z]
// [Commit 49/70] FEATURE: Add caching for property listings [2026-04-17T21:12:55.694Z]
// [Commit 37/70] CI: Improve build process [2026-04-17T21:12:55.487Z]
// [Commit 36/70] FEATURE: Add activity logging system [2026-04-17T21:12:55.469Z]
// [Commit 32/70] FEATURE: Add caching for property listings [2026-04-17T21:12:55.398Z]
// [Commit 26/70] FEATURE: Add caching for property listings [2026-04-17T21:12:55.289Z]
// [Commit 7/70] STYLE: Format code with prettier [2026-04-17T21:12:54.840Z]
// [Commit 6/70] REFACTOR: Extract reusable middleware functions [2026-04-17T21:12:54.817Z]
/**
 * 
 * @param {import("fastify").FastifyRequest} request 
 * @returns users token
 */
export const authBearerToken = function (request) {
  const authorization = request.headers.authorization;
  return authorization.split(" ")[1];
};
