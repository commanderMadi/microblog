# Bloggy

## A flexible microblogging web application By Ahmed Magdy.

#### Getting started with my project

#### Starting the application

-   Download the project zip folder.
-   Extract the files.
-   In your terminal, install all the dependencies by running the command `npm install`.
-   Build the database using the existent schema file by running the command `npm run build-db`.
-   Start the application by running the command `npm run start`.
-   Navigate to your browser and type in `http://localhost:3000` to access the application.

#### Access the Author Dashboard (IMPORTANT)

The author dashboard can be accessed via the URL `http://localhost:3000/dashboard`. The author dashboard is password-protected. To access it, you must login. The default credentials for first-time login as an author are as follows:

-   Email: admin@bloggy.com
-   Password: admintest123

You will be notified to change this password when you login. If you change the password, the new password will be hashed and stored safely in the database.

#### Login System

All users with accounts stored in the database can login to the system via the URL `http://localhost:3000/login`.

#### Register a user

By default, any newly registered user is created with the role "reader". Default users do not have access to the dashboard and will be redirected to the homepage if they try to access the dashboard URL by manually typing it in the browser.

To register a user, navigate to `http://localhost:3000/register`. You must not be authenticated for this page to render.

### Extension of Choice

-   Implemented a full login/registration system with route protection for authoring.
-   Implemented proper redirection using custom middlewares to deny access to protected routes.
-   Used `PassportJS` Library to authenticate users.
-   Used `express-session` library to persist and securely store user credentials when logged in.
-   Used `bcrypt` library to securely hash passwords when registering a new user or updating an existing one.
-   Used `dotenv` library to store and use environment variables.

### Application Features (Some of them were not required but implemented to enrich user experience)

#### All Users Features:

-   Adding a comment or a like to an article won't require page refreshing (Ajax loading using Axios on the client side).
-   Ability to login/register an account with proper password hashing for safe storage.
-   Basic responsive design (Was not the main extension I focused on).
-   Ability to change password when logged in.

#### Author Features:

-   Ability to login securely to a dashboard for authoring.
-   Ability to create, edit, delete and publish articles.
-   Ability to edit blog settings (blog name, blog description and author name)

### Tools Used

-   All the required tools (`ejs`, `sqlite3`, `ExpressJS`, `NodeJs`, `Sqlite`)
-   `PassportJS`: To authenticate users.
-   `Axios`: To render article comments, comments counts and like counts immediately upon adding them without the need for a page refresh.
-   `express-session`: To persist and securely store user credentials when logged in.
-   `express-flash`: To display success and failure message upon certain user events (creating a draft, editing an article, failed password change attempt, etc).
-   `express-validator`: To validate data input when attempting certain actions (login/register, updating/creating articles).
-   `nodemon`: To automatically restart the server when a backend change happens (Used only for development).
-   `bcrypt`: To hash passwords and store them securely in the database.
-   `moment`: To obtain formatted date strings to display as article meta information (creation date, publishing date, modification date).
-   `tailwind`: To style the application (Added a fall back CDN option in all views if tailwind engine failed to compile).
-   `methodOverride`: To allow the usage of database querying methods like put and delete in HTML forms (To follow RESTFUL best practices).
