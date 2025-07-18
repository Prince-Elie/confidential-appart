// [Commit 11/70] FEATURE: Add activity logging system
// [Commit 65/70] PERF: Improve query performance
// [Commit 62/70] DOCS: Add environment variables documentation
// [Commit 37/70] FEATURE: Implement pagination for enquiries
// [Commit 17/70] STYLE: Improve code readability
// [Commit 49/70] CI: Add automated testing [2026-04-17T21:13:12.628Z]
// [Commit 47/70] DOCS: Add contributing guidelines [2026-04-17T21:13:12.599Z]
// [Commit 30/70] REFACTOR: Improve error handling in controllers [2026-04-17T21:13:12.331Z]
// [Commit 27/70] TEST: Add unit tests for auth service [2026-04-17T21:13:12.287Z]
// [Commit 21/70] FIX: Resolve CORS headers issue [2026-04-17T21:13:12.195Z]
// [Commit 16/70] PERF: Improve query performance [2026-04-17T21:13:12.121Z]
// [Commit 13/70] FIX: Correct user validation logic [2026-04-17T21:13:12.080Z]
// [Commit 10/70] FEATURE: Implement pagination for enquiries [2026-04-17T21:13:12.028Z]
// [Commit 1/70] FEATURE: Add user preferences endpoint [2026-04-17T21:13:11.839Z]
// [Commit 44/70] CI: Improve build process [2026-04-17T21:12:55.609Z]
// [Commit 39/70] FIX: Resolve race condition in notifications [2026-04-17T21:12:55.521Z]
// [Commit 33/70] FIX: Correct user validation logic [2026-04-17T21:12:55.418Z]
// [Commit 25/70] REFACTOR: Improve error handling in controllers [2026-04-17T21:12:55.272Z]
// [Commit 13/70] PERF: Add database indexing [2026-04-17T21:12:55.019Z]
# **Backend-Fastify (Part)**
## **1.1 navigate to `backend-fastify/` directory.**
```
cd backend-fastify/
```
## **1.2 create `.env` file & add variables:**
- copy `.env.example` & re-name it to `.env`
- set your desired variable value
```
PORT=8000
LOGGER=true
SALT=12
SECRET_KEY='secret'
DB_CONNECT=mongodb://localhost:27017/rem-db
```
## **2. then install dependencies & run dev**

In terminal - command
```
#  navigate to backend-fastify 
$ cd backend-fastify

# install dependencies
$ npm install

# start server
$ npm start `or` $ npm run dev

```

## **2.1 Database seeder(optional)**
- Make sure `.env` is configured & dependencies are installed
- Will populate database with dummy data.

⚠️ This will delete existing records in the database document. 

⚠️ Make a backup if needed
```
$ npm run db:seeder
```

dummy user:
```
  fullName: "test tester",
  email: "test@email.com",
  password: "password"

  You can use this to signin.
```
## Routes
```
/docs/
/users/
/auth/
/properties/
/enquiries/
```