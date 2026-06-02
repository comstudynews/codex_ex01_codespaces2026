# Repository Guidelines

## Project Structure & Module Organization

This is a small Node.js Express REST API example. The active entry point is `server.js`, as defined by `package.json` (`main` and `npm start`). It exposes a root route plus CRUD-style `/cars` routes backed by an in-memory array. `src/server.js` contains a smaller health-check server example, but it is not currently wired into the npm scripts. Dependency metadata lives in `package.json` and `package-lock.json`. The `.devcontainer/` directory contains Codespaces/dev container configuration.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm start`: run the API with `node server.js` on port `3000`.
- `PORT=4000 node src/server.js`: run the alternate health-check example on a custom port.
- `curl http://localhost:3000/cars`: manually verify the car list endpoint after starting the server.

There is no build step for this repository; the code runs directly in Node.js.

## Coding Style & Naming Conventions

Use CommonJS modules (`require`) to match the existing code. Prefer 2-space indentation, semicolons, and single quotes for strings. Keep route handlers small and explicit, with clear HTTP status codes for error cases. Use lower-case route paths such as `/cars/:id`, camelCase for local variables (`carIndex`, `deletedCar`), and `_id` for the car identifier field to match the existing data shape.

## Testing Guidelines

No automated test framework is configured yet. For changes to API behavior, at minimum run `npm start` and verify affected endpoints with `curl` or an API client. If tests are added, place them in a `test/` or `tests/` directory, name files after the behavior under test (for example, `cars.test.js`), and add an `npm test` script in `package.json`.

## Commit & Pull Request Guidelines

The current Git history contains only `Initial commit`, so there is no established commit convention. Use short, imperative commit messages such as `Add car validation` or `Document API routes`. Pull requests should describe the change, list manual verification steps, and call out any API route or response-shape changes. Include screenshots only when changing visible UI or documentation rendering.

## Security & Configuration Tips

Do not commit secrets or environment-specific credentials. Prefer environment variables for configuration, as shown by `process.env.PORT` in `src/server.js`. The current `server.js` uses in-memory data, so data resets whenever the process restarts.
