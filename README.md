# Judge-core

Judge-core is the backend system for a virtual judge platform, designed to simulate the International Collegiate Programming Contest (ICPC) environment. Built with Node.js, Judge-core handles problem submissions, execution, and evaluation, providing an interface for contest participants to test and refine their solutions.

## Features

- **Problem Management**: Add, update, and remove programming problems.
- **Submission Handling**: Process code submissions and execute them securely.
- **Automatic Evaluation**: Compare submissions against predefined test cases.
- **Leaderboard**: Rank participants based on their performance.
- **Contest Creation**: Organize contests and manage participants.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version 12.x or higher recommended)
- MongoDB (version 4.x or higher recommended)
- Docker (for sandboxed execution environments)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/Judge-core.git
   ```
2. Navigate to the project directory:

```
  cd Judge-core
```

3. Install NPM packages:

```
  npm install
```

4. Copy the .env.example file to .env and adjust the environment variables to fit your setup:

```
  cp .env.example .env
```

5. Start the server:
   ```
   npm start
   ```

### Running the Tests

To run the automated tests for this system:

```
npm test
```

### Built With

Node.js - The runtime environment
Express - The web framework
MongoDB - The database

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
