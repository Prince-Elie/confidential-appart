// [Commit 50/70] PERF: Add database indexing
// [Commit 17/70] CI: Update CI/CD pipeline
// [Commit 10/70] STYLE: Improve code readability
// [Commit 2/70] FIX: Fix null pointer exception in property handler
// [Commit 69/70] FIX: Fix date formatting inconsistency
// [Commit 55/70] FEATURE: Enhance notification system
// [Commit 47/70] STYLE: Fix linting errors
// [Commit 33/70] FEATURE: Add user preferences endpoint
// [Commit 30/70] DOCS: Add code comments for complex logic
// [Commit 21/70] REFACTOR: Reorganize utility functions
// [Commit 10/70] PERF: Reduce API response time
// [Commit 1/70] FIX: Resolve race condition in notifications
// [Commit 62/70] TEST: Add validation tests [2026-04-17T21:13:12.832Z]
// [Commit 61/70] TEST: Add integration tests for API endpoints [2026-04-17T21:13:12.813Z]
// [Commit 58/70] TEST: Add test fixtures [2026-04-17T21:13:12.767Z]
// [Commit 54/70] FEATURE: Add user preferences endpoint [2026-04-17T21:13:12.710Z]
// [Commit 40/70] DOCS: Update API documentation [2026-04-17T21:13:12.491Z]
// [Commit 32/70] PERF: Implement lazy loading [2026-04-17T21:13:12.361Z]
// [Commit 29/70] PERF: Optimize memory usage [2026-04-17T21:13:12.316Z]
// [Commit 20/70] REFACTOR: Optimize database queries [2026-04-17T21:13:12.180Z]
// [Commit 19/70] REFACTOR: Extract reusable middleware functions [2026-04-17T21:13:12.166Z]
// [Commit 12/70] PERF: Add database indexing [2026-04-17T21:13:12.059Z]
// [Commit 8/70] REFACTOR: Extract reusable middleware functions [2026-04-17T21:13:11.993Z]
// [Commit 70/70] CI: Add GitHub actions workflow [2026-04-17T21:12:56.048Z]
// [Commit 69/70] TEST: Add unit tests for auth service [2026-04-17T21:12:56.031Z]
// [Commit 61/70] PERF: Reduce API response time [2026-04-17T21:12:55.894Z]
// [Commit 60/70] STYLE: Improve code readability [2026-04-17T21:12:55.879Z]
// [Commit 56/70] PERF: Add database indexing [2026-04-17T21:12:55.813Z]
// [Commit 53/70] TEST: Add unit tests for auth service [2026-04-17T21:12:55.760Z]
// [Commit 45/70] FIX: Fix null pointer exception in property handler [2026-04-17T21:12:55.623Z]
// [Commit 28/70] DOCS: Add code comments for complex logic [2026-04-17T21:12:55.330Z]
// [Commit 27/70] FIX: Fix date formatting inconsistency [2026-04-17T21:12:55.309Z]
// [Commit 22/70] REFACTOR: Improve error handling in controllers [2026-04-17T21:12:55.216Z]
// [Commit 16/70] FEATURE: Add activity logging system [2026-04-17T21:12:55.096Z]
// [Commit 10/70] REFACTOR: Reorganize utility functions [2026-04-17T21:12:54.955Z]
// [Commit 3/70] CI: Update CI/CD pipeline [2026-04-17T21:12:54.760Z]
import { Property } from "../../models/property.js";

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getProperties = async function (req, res) {
  const {
    search = "",
    filter = "",
    sort = "latest",
    limit = 4,
    lastCreatedAt,
    lastPrice,
    lastName,
  } = req.query;

  const { sortOrder, sortField } = composeSort(sort);
  const rangeQuery = composeRangeQuery(sort, {
    lastCreatedAt,
    lastPrice,
    lastName,
  });
  const filterQuery = composeFilterQuery(filter, search);
  const query = { ...filterQuery, ...rangeQuery };

  const properties = await Property.find(query)
    // .select("property_id name createdAt price type transactionType")
    .limit(parseInt(limit))
    .sort({ [sortField]: sortOrder, _id: 1 }) // Use _id for tie-breaking in the sort
    .collation({ locale: "en", strength: 2 });

  const { price, name, createdAt } = properties[properties.length - 1] || {};
  const lastFetchedPrice = price;
  const lastFetchedName = name;
  const lastFetchedCreatedAt = createdAt;
  const hasMore = !!(price || name || createdAt);

  return res.status(200).send({
    data: {
      items: properties,
      ...(sort === "price" && { lastPrice: lastFetchedPrice }),
      ...(sort === "name"
        ? { lastName: lastFetchedName }
        : { lastCreatedAt: lastFetchedCreatedAt }),
      hasMore,
    },
  });
};

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getMyProperties = async function (req, res) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(400).send({ message: "Invalid request missing user id" });
  }
  try {
    const properties = await Property.find({ user_id });
    return res.status(200).send({
      data: properties,
    });
  } catch (error) {
    console.error("\n", error);
    return res.status(500).send({ message: "Error: Something went wrong" });
  }
};

/**
 *
 * @param {string} filter
 * @returns {object}
 */
const composeFilterQuery = function (filter, search) {
  const filterQuery = {};
  if (filter) {
    const transactionTypes = [];
    const propertyTypes = [];

    filter
      .split(",")
      .forEach((t) =>
        t === "sale" || t === "rent"
          ? transactionTypes.push(t)
          : propertyTypes.push(t)
      );
    if (propertyTypes.length) {
      filterQuery.type = { $in: propertyTypes };
    }
    if (transactionTypes.length) {
      filterQuery.transactionTypes = { $in: transactionTypes };
    }
  }
  if(search) {
    filterQuery.$or = [
      { name: { $regex: search, $options: "i" } }, // Case-insensitive search on name
      { address: { $regex: search, $options: "i" } }, // Assuming there's a description field
    ];
  }
  return filterQuery;
};

/**
 *
 * @param {string} sort
 * @param {object} param2
 * @returns {object}
 */
const composeRangeQuery = function (
  sort,
  { lastCreatedAt, lastPrice, lastName } = {}
) {
  if (sort === "price" && lastPrice && lastCreatedAt) {
    return {
      price: { $lte: lastPrice },
      createdAt: { $ne: new Date(lastCreatedAt) },
    };
  } else if (sort === "latest" && lastCreatedAt) {
    return { createdAt: { $lt: new Date(lastCreatedAt) } };
  } else if (sort === "name" && lastName) {
    return { name: { $gt: lastName } };
  }
};

/**
 *
 * @param {string} sort
 * @returns {object}
 */
const composeSort = function (sort) {
  switch (sort) {
    case "name":
      return { sortField: "name", sortOrder: 1 };
    case "price":
      return { sortField: "price", sortOrder: -1 };
    default:
      return { sortField: "createdAt", sortOrder: -1 };
  }
};