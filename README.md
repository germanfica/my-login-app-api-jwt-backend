# MyLoginApp

MyLoginApp is a Node.js-based application for user authentication using Passport.js with Local and JWT strategies. It uses Sequelize for database interaction with MySQL. This project provides a complete authentication system with sign-up, login, and protected routes.

## Prerequisites

- Node.js (v18.18.2 or later)
- MySQL
- Docker (optional, for running the app in a containerized environment)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/germanfica/my-login-app-api-backend.git MyLoginApp
    cd MyLoginApp
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory of your project and add the following variables:
    ```plaintext
    JWT_SECRET=your_jwt_secret
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=user
    DB_PASSWORD=password
    DB_NAME=myloginapp
    ```

4. Set up the MySQL database and create the necessary tables by running the app:
    ```bash
    npm start
    ```

## Running the Application

To run the application, use the following command:
```bash
npm start
```

The server will start on port 3000. You can access it at `http://localhost:3000`.

## API Endpoints

- `POST /signup`: Create a new user account.
- `POST /login`: Authenticate a user and return a JWT token.
- `GET /profile`: Get the authenticated user's profile (requires JWT token).
- `POST /logout`: Logout the authenticated user.

## Environment Variables

This project requires an `.env` file to configure environment-specific settings. Below is an example of the required variables:

```plaintext
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=myloginapp
```

## Docker

You can also run this application using Docker. To do so, run the following:

```bash
docker compose up -d
```

## Credits
- [German Fica](https://germanfica.com/)

## External tools
- Docker.

## License
[MIT](https://opensource.org/licenses/MIT)
