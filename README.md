URL Shortener
A lightweight and efficient URL shortening service built with Node.js, Express, and MongoDB. Transform long URLs into short, shareable links with automatic duplicate detection and persistent storage.
Features
URL Shortening - Convert long URLs into compact, shareable links
Duplicate Prevention - Automatically returns existing short URL if the long URL was previously shortened
Unique ID Generation - Uses nanoid for collision-resistant short codes
Automatic Redirects - Seamless redirection from short URLs to original destinations
MongoDB Persistence - All URLs stored permanently in database
RESTful API - Clean API endpoints for integration with any frontend
Tech Stack
Runtime: Node.js
Framework: Express.js 5.1.0
Database: MongoDB
ODM: Mongoose 8.18.2
ID Generator: nanoid 5.1.6
Environment Config: dotenv 17.2.2
Prerequisites
Before running this project, ensure you have:
Node.js (v14 or higher)
MongoDB (running locally or remote instance)
npm or yarn package manager
Installation
Clone the repository
git clone https://github.com/yourusername/URL-Shortener.git
cd URL-Shortener
Navigate to the server directory
cd server
Install dependencies
npm install
Create a .env file in the server directory
touch .env
Add the following environment variables to .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:5000
Environment Variables
Variable	Description	Example
PORT	Server port number	5000
MONGO_URI	MongoDB connection string	mongodb://localhost:27017/url-shortener
BASE_URL	Base URL for shortened links	http://localhost:5000
Running the Application
Development Mode (with hot reload)
npm run dev
Production Mode
npm start
The server will start on http://localhost:5000 (or your specified PORT)
API Endpoints
Base URL
http://localhost:5000/api
1. Create Short URL
Endpoint: POST /api/ Description: Creates a new shortened URL or returns existing one if the long URL was previously shortened. Request Body:
{
  "longUrl": "https://www.example.com/very/long/url/that/needs/shortening"
}
Success Response (201 Created):
{
  "_id": "507f1f77bcf86cd799439011",
  "longUrl": "https://www.example.com/very/long/url/that/needs/shortening",
  "shortUrl": "http://localhost:5000/V1StGXR8_Z5jdHi6B",
  "urlCode": "V1StGXR8_Z5jdHi6B",
  "date": "2025-11-06T10:30:00.000Z",
  "__v": 0
}
Error Response (500):
{
  "error": "Invalid Request"
}
Example using cURL:
curl -X POST http://localhost:5000/api/ \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://www.example.com/very/long/url"}'
Example using JavaScript Fetch:
const response = await fetch('http://localhost:5000/api/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    longUrl: 'https://www.example.com/very/long/url'
  })
});

const data = await response.json();
console.log(data.shortUrl); // http://localhost:5000/V1StGXR8_Z5jdHi6B
2. Redirect to Original URL
Endpoint: GET /api/:redirect Description: Redirects to the original long URL using the short code. Parameters:
redirect (path parameter) - The unique URL code
Success Response:
Status: 302 Redirect
Redirects to original long URL
Error Response (404):
"Url Not Found"
Example:
Visit: http://localhost:5000/api/V1StGXR8_Z5jdHi6B
Redirects to: https://www.example.com/very/long/url/that/needs/shortening
Project Structure
URL-Shortener/
├── server/
│   ├── src/
│   │   ├── app.js                 # Main application entry point
│   │   ├── routes/
│   │   │   └── urlRoutes.js       # API route definitions
│   │   ├── controllers/
│   │   │   └── urlController.js   # Request handlers
│   │   └── model/
│   │       └── URL.js             # Mongoose schema
│   ├── .env                       # Environment variables
│   ├── package.json               # Dependencies and scripts
│   └── node_modules/              # Installed packages
└── README.md
Database Schema
URL Model
{
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  urlCode: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}
How It Works
User submits a long URL via POST request to /api/
System checks for duplicates - queries database for existing long URL
If exists: Returns the existing short URL
If new:
Generates unique code using nanoid
Creates short URL: BASE_URL/urlCode
Saves to MongoDB
Returns new short URL to user
User visits short URL via GET request to /api/:redirect
System redirects to the original long URL (HTTP 302)
Future Enhancements
 Frontend web interface
 Custom short URL aliases
 Click tracking and analytics
 URL expiration dates
 User authentication and dashboard
 QR code generation
 Rate limiting
 Link validation
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is open source and available under the MIT License.
Built with ❤️ using Node.js and Express
