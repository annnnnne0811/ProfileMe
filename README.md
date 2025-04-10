# Global Classroom Project 

Team members: 
- Alexandra Bud     | D24130508
- Eilish Paseos     | C22408466          
- Mary Anne Flores  | C20461582 
- Stepan Chernobaev | D20124623
- Raiyan Mohd Farid | C21385263

# ProfileMe

ProfileMe is a web-based platform designed to help individuals create personality-driven profiles as an alternative to traditional CVs. It connects students, job seekers, freelancers, and retirees with casual jobs, volunteering opportunities, and flexible work by providing employers with an engaging way to discover candidates.

This manual outlines the prerequisites, setup process, and steps to run the application locally.

# Project Setup

## Requirements

### Software Prerequisites
> Node.js: Version 14.x or higher (includes npm for package management).
> MySQL: Version 8.0 or higher (for the database).

### Dependencies
The project uses the following Node.js packages:
> express: Web framework for Node.js.
> mysql2: MySQL client for Node.js with promise support.
> express-session: Session management for user authentication.
> multer: Middleware for handling file uploads.
> bcrypt: Library for hashing passwords.

## Setup

### Step 1: Clone Repository

```
git clone https://github.com/annnnnne0811/ProfileMe.git
cd ProfileMe
```
### Step 2: Install Node dependencies

1. Open a terminal in the project directory
2. Run the following command to install required packages:

```
npm install express mysql2 express-session multer bcrypt
```
### Step 3: Setup database
1. Install MySQL
2. Create the Database:
    > Open your MySQL client and log in as the root user
    > Enter the password '270202' or your own custom password
    > Create the ProfileMe database
    ```
    CREATE DATABASE ProfileMe;
    ```
3. Import the schema file:
    > Locate the ProfileMeSchema.sql file in the schema folder
    > Import schema into the database
4. Update Database Configuration (if needed):
    > Open app.js and authModel.js.
    > Update the dbConfig object if your MySQL credentials differ:
    ```javascript
        const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'your_password_here',
        database: 'ProfileMe'
    };
    ```

## Starting the Application

1. Open terminal and make sure you are in 'app' folder
2. Run the application
```
node app.js
```
3. Follow the link to see the ProfileMe Homepage: http://localhost:3000

## Using the application
### Key Features
1. Registration:
    > Click "Register" in the navbar or sidebar.
    > Fill out the form (First Name, Last Name, Email, Password, Date of Birth) and submit.
2. Login:
    > Click "Login" and enter your email and password.
    > Upon success, the UI updates to show logout options.
3. Profile Management:
    > Upload a profile image or video via /upload/profile-image or /upload/profile-video endpoints (requires login).
    > Save profile details (bio, location, feed) using the respective endpoints.
4. Job Posting and Search:
    > Employers can post jobs via /post-job.
    > Users can view available jobs at /get-jobs.
5. Logout:
    > Click "Logout" to end the session.

# How it works

## File Uploads
- Uploads are saved to `/uploads/`
- Accessible via `/uploads/<filename>`

## Available Routes (API)
Main Routes:
- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /check-session`
- `POST /upload/profile-image`
- `POST /upload/profile-video`
- `POST /save-profile`
- `POST /add-link`
- `POST /save-feed`
- `POST /save-about-me`
- `POST /save-profile-video`
- `POST /save-useful-links`
- `GET /get-user-profile/:accountId`
- `GET /get-jobs`
- `POST /post-job`
- `GET /get-people`

## Frontend HTML Pages Summary

| **File**                  | **Path/URL**          | **Purpose**                                                                       |
|---------------------------|-----------------------|-----------------------------------------------------------------------------------|
| `index.html`              | `/`, `/index.html`    | Homepage with job search, intro modals for login/register, and app features       |
| `vid.html`                | `/vid`                | User profile page with tabs for feed, video CV, links, and about section          |
| `post-job.html`           | `/post-job`           | Page where employers can post new jobs                                            |
| `search.html`             | `/search`             | Job listings search page with filters and Google Places integration               |
| `people.html`             | `/people`             | Directory of registered users with a video modal and search bar                   |
| `seeker-dashboard.html`   | `/seeker-dashboard`   | Recruiter dashboard showing jobs posted, saved applicants, and hiring stats       |

Each of these HTML pages is linked through the app’s navigation bar and sidebar menu, using consistent UI components (Bootstrap, Font Awesome, etc.). They work together with the backend (app.js) routes and session management for dynamic behavior.

## JavaScript Files Summary

| **File**           | **Used In Page**         | **Purpose**                                                                               |
|--------------------|--------------------------|-------------------------------------------------------------------------------------------|
| `login.js`         | `index.html`             | Handles login, register, and logout; updates navbar buttons based on session              |
| `filterLocation.js`| `index.html`             | Auto-detects user location and filters job listings accordingly                           |
| `search.js`        | `search.html`            | Loads jobs, allows keyword filtering, and integrates Google Places API                    |
| `postJob.js`       | `post-job.html`          | Handles job posting with form submission and session check                                |
| `people.js`        | `people.html`            | Displays user directory, includes search filter and UCV modal viewer                      |
| `vid.js`           | `vid.html`               | Full profile management: image/video uploads, bio/feed/links editing, toggles edit mode   |