# InnoByte Backend Assigment

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gaurav147-star/innobyte-backend.git
   ```

2. **Install dependencies:**

   ```bash
   cd innobyte-backend
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
    PORT=8000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=naruto@
    EMAIL=add your email
    PASS=add your password
   ```

## Usage

1. **Run the server:**

   ```bash
   npm start
   ```

2. **Access the API:**

   The server will start at http://localhost:8000. You can use tools like Postman or cURL to interact with the following endpoints:

   - `POST /api/signup`: Create New account
   - `POST /api/login`: Login to account
   - `GET /api/verify-email`: Verification of email


## Folder Structure

- `config`: Configuration files (e.g., database connection)
- `controllers`: Functions handling business logic
- `routes`: Route definitions
- `models`: Data models for MongoDB

## Dependencies

- `express`: Web framework for Node.js
- `mongoose`: MongoDB object modeling tool
- `dotenv`: Environment variable management
- `cors`: Cross-Origin Resource Sharing
- `jsonwebtoken`: JSON Web Token creation and verification
- `nodemailer`: Node.js module for sending emails.