# Kiera + ChastiKey

## [View Here](https://kiera.chastikey.com)

Kiera + ChastiKey are their own projects with their own developers. In this pairing, Kiera is acting as a
Cache/Account/Verification provider (Note: The code for Kiera the Bot is not public at this time).

---

## Developing

1. Clone the project from this repo `git clone git@github.com:ChastiKey/web.git`
2. Install dependencies using NPM (the lock is being maintained for only npm) `npm install`
3. Run the project in hot reload dev mode (your changes will reload in realtime locally) `npm serve`
4. You may need to adjust your PC's DNS/Hosts file before # 3, change the endpoints.ts file, or run `npm serve` in production mode as
   there is a local dev URL used thats not public for those able to run a dev copy of kiera.

## Contributing Guidelines

- Use clear & concise commit messages - this helps those reviewing see at a glance what's changed before diving in
- Its recommended if there is a dev branch in progress to push/work off that
- Code in `/src` must be typescript only
- If including a new dependency, please discuss first what benefit it will have to the project for admin involvement in decision
- Accepted pull requests may will not necessarily be deployed quickly (unless a major/critical fix), changes may be included with a later release
- Include your changes/fixes/additions in the [ChastiKey/chastikey.js](https://github.com/ChastiKey/chastikey.js), examples (please include the PR #):
  - **For a fix:** `- Fixed: [ #0 ] by @rileyio - The thing that did the other thing.`
  - **For an addition:** `- Added: [ #0 ] by @rileyio - Something new, brief what it does.`
  - **For an update:** `- Updated: [ #0 ] by @rileyio - Brief what will happen now when you click the button.`

## ChastiKey API interaction(s)

Any queries to/from ChastiKey it's self must utilise the [ChastiKey/chastikey.js](https://github.com/ChastiKey/chastikey.js) wrapper.
If something is missing or you wish to improve the wrapper, please submit a pr to that project.

## Kiera API interactions(s)

Not all Kiera API Endpoints used by its official website are going to be available to this project. The currently available
endpoints are as follows:

> Note: these endpoints require the session token generated for authentication with Kiera. Check examples in
> [`/src/api/`](https://github.com/ChastiKey/chastikey.js/tree/master/src/api) + there is a helper available to pull header(s) for requests.

These endpoints in production should be used unless you have the ability to run Kiera from source.
