# Charging Station Management System

A full-stack application for managing electric vehicle charging stations with real-time status updates and location-based services.

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Frontend
- Vue.js 3
- Tailwind CSS
- Leaflet Maps
- Axios

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
```bash
cd charging-station-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=4000
```

4. Start the development server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd charging-station-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Public Endpoints

#### Get All Charging Stations (Public)
```http
GET /api/public/stations
```
Returns a list of sample charging stations for testing purposes.

Response:
```json
[
  {
    "id": "1",
    "name": "Downtown Charging Hub",
    "status": "Active",
    "powerOutput": 50,
    "connectorType": "CCS",
    "location": {
      "latitude": 51.505,
      "longitude": -0.09
    }
  }
]
```

### Protected Endpoints (Requires Authentication)

#### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

#### Charging Stations
```http
GET /api/stations
POST /api/stations
PUT /api/stations/:id
DELETE /api/stations/:id
```

## Deployment

### Backend Deployment
The backend is deployed on Render.com:
- URL: [Backend API URL]
- Environment variables are configured in the Render dashboard
- MongoDB Atlas is used for the database

### Frontend Deployment
The frontend is deployed on Vercel:
- URL: [Frontend URL]
- Environment variables are configured in the Vercel dashboard

## Testing the Application

1. Access the frontend application at [Frontend URL]
2. Test the public API endpoint:
```bash
curl https://your-backend-url/api/public/stations
```

## Postman Collection
A Postman collection is available for testing the API endpoints:
[Postman Collection Link]

## Features
- User authentication (Register/Login)
- CRUD operations for charging stations
- Interactive map view with station locations
- Real-time status updates
- Responsive design
- Dark theme UI

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
