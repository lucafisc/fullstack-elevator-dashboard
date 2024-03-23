# API Documentation

## Introduction

> Version 1
> 

Welcome to the Elevator Data API! This API provides comprehensive access to data about elevators for a specific user. Elevators are characterized by their specifications, which remain constant, and their operational state, which may change over time.

### Purpose and Scope

The Elevator Data API serves as a vital tool for managing and monitoring elevators associated with your account. It allows you to retrieve detailed information about each elevator's specifications, such as fabrication number, manufacturer, production year, and type. Additionally, you can track the real-time operational state of each elevator, including its current floor number, operational status, warning messages, and reasons for any deviations from normal operation.

### Key Features

- **Get All User's Elevators:** Retrieve a list of all elevators associated with the user's account.
- **Overview of Elevator States:** Obtain an overview of how many elevators are in each operational state, such as "operational," "under maintenance," or "out of service."
- **Filter Elevators by State:** Filter elevators based on their operational state, allowing you to focus on specific subsets of elevators.
- **Detailed Elevator Information:** Access detailed information about a specific elevator, including both its specifications and current operational state. If available, additional data stored in the chart will be populated here, providing a comprehensive view of the elevator's history and performance.
- **Recent Activity:** Retrieve a list of the ten latest viewed elevators, enabling you to track recent user activity and prioritize attention to specific elevators.

## Getting Started

### Prerequisites

Before getting started, ensure you have the following prerequisites installed:

- Node.js and npm (Node Package Manager)
- MongoDB

### Setting Up Environment

### **Navigate to Server Directory:**

```bash
cd server
```

### Create .env File

Create a new file named `.env` in the server directory and fill in the following values:

```bash
# Port number on which the server will run
PORT=3000

# Base URL of the server
BASE_URL="http://localhost"

# MongoDB connection URL including credentials and database name
DB_URL="mongodb+srv://elevatorAdmin:zI7fzGxtJihdeKHm@cluster0.03yav5m.mongodb.net/elevator-dashboard?retryWrites=true&w=majority&appName=Cluster0"

# Secret key used for JWT token generation and verification
SECRET="a95f6d06ce7cb693c9c4cc18a7dd412e08ef1b94edbe8b8c6de85dfb68778fa4"

# Auth0 client ID for authentication
CLIENT_ID="BO0YUnm0ZPx1t08sJaqtjBWCGQq6YD1J"

# Auth0 issuer base URL for authentication
ISSUER_BASE_URL="https://dev-a0oir8yzhmnp7jh3.us.auth0.com"

# Test user token used for accessing endpoints without authentication
TEST_USER_TOKEN="auth0|65fd62f37e87f7a8c0a5454f"
```

### Install Dependencies

```bash
npm install
```

### Accessing Endpoints

- Authenticated Routes: The main route **`/elevators`** is protected, and only authenticated users can access it. You need to include a valid **JWT token** in the **request header** to authenticate.
- Test Route: Use the **`/tes`**t route to access all endpoints of the API using a dummy user to get sample data without needing to authenticate

### Test Users for Protected Routes

| Email | Password |
| --- | --- |
| mailto:skyward-peaks@test.com | ElapseJam88 |
| mailto:elevate-industries@test.com | BlueStudio88 |

For using these sample users in the frontend application, please refer to the [Frontend Section](notion://www.notion.so/42wolfsburgberlin/API-Documentation-74dfb3313cc741a9918871678b538a5b#frontend-section) for instructions on getting started.

## Endpoints

### Authentication

Requests to the `/elevators` route must include a valid authentication token in the `Authorization` header. This token should be obtained by logging in as a registered user in the frontend dashboard.

Example of including the authentication token in the request header:

```tsx
headers: {
    Authorization: `Bearer ${token}`,
},
```

Note that the `/test` route also provides access to the same endpoints without authentication.

### Response Format:

`JSON`

## GET /elevators

### Description:

This endpoint retrieves an array of all elevators associated with the authenticated user.

### HTTP Request:

```
GET http://localhost:3000/elevators
```

### Example Response (200 - OK):

```tsx
[
    {
        "specifications": {
            "fabricationNumber": "FAB123",
            "address": "Berlin, Germany",
            "deviceIdentificationNumber": "DIN456",
            "manufacturerName": "Otis",
            "productionYear": 2010,
            "elevatorType": "Passenger"
        },
        "operationalState": {
            "floorNumber": 5,
            "state": "operational"
        },
        "_id": "65fd6ecf03c5dde57a9f58d7"
    },
    {
        "specifications": {
            "fabricationNumber": "FAB124",
            "address": "Munich, Germany",
            "deviceIdentificationNumber": "DIN457",
            "manufacturerName": "Schindler",
            "productionYear": 2012,
            "elevatorType": "Freight"
        },
        "operationalState": {
            "floorNumber": 3,
            "state": "warning",
            "warningMessage": "Maintenance due soon"
        },
        "_id": "65fd6ecf03c5dde57a9f58d9"
    },
    {
        "specifications": {
            "fabricationNumber": "FAB125",
            "address": "Hamburg, Germany",
            "deviceIdentificationNumber": "DIN458",
            "manufacturerName": "KONE",
            "productionYear": 2015,
            "elevatorType": "Passenger"
        },
        "operationalState": {
            "floorNumber": 10,
            "state": "out-of-order",
            "reason": "Mechanical failure"
        },
        "_id": "65fd6ecf03c5dde57a9f58db"
    },
]
```