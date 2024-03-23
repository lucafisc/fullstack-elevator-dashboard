# Untitled

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

### Start server

```tsx
npm start
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

```json
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
    // ...
    // Additional elevators
]
```

## GET /elevators/:id

### Description:

This endpoint retrieves information about a specific elevator identified by its unique ID. If available, the associated chart data will be filled in. **NOTE:** Currently, in version 1 of the API, only the "door_cycle_count_over_time" type of data is available.

Accessing this endpoint will also register a "visit" to the elevator, which can be viewed using the `/elevators/recentlyVisited` endpoint.

### HTTP Request:

```tsx
GET http://localhost:3000/elevators/:id
```

### Path Parameters:

| Parameter | Description |
| --- | --- |
| :id | The unique identifier of the elevator. |

### Example Response (200 - OK):

```json
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
    "_id": "65fd6ecf03c5dde57a9f58d7",
    "chart": {
        "_id": "65fd6ecf03c5dde57a9f58c7",
        "name": "door_cycle_count_over_time",
        "data": [
            {
                "time": "2023-10-05T00:00:00.000Z",
                "door_cycles_count": 845,
                "door_openings_count": 845,
                "door_closings_count": 872,
                "door_closed_count": 845,
                "door_opened_count": 845,
                "_id": "65fd6ecf03c5dde57a9f58c8"
            },
            {
                "time": "2023-10-06T00:00:00.000Z",
                "door_cycles_count": 908,
                "door_openings_count": 908,
                "door_closings_count": 935,
                "door_closed_count": 908,
                "door_opened_count": 908,
                "_id": "65fd6ecf03c5dde57a9f58c9"
            },
			      // ...
				    // Additional data objects
        ]
    }
}
```

## GET /elevators/state/:state

### Description:

This endpoint returns all elevators with a specific operational state. Valid states include "operational", "out-of-order", and "warning".

### Path Parameters:

| Parameter | Description |
| --- | --- |
| :state | The operational state of the elevators. Possible values are "operational", "out-of-order", or "warning". |

### HTTP Request:

```
GET http://localhost:3000/elevators/state/:state
```

### Example Response (200 - OK):

```json
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
            "fabricationNumber": "FAB141",
            "address": "Wiesbaden, Germany",
            "deviceIdentificationNumber": "DIN474",
            "manufacturerName": "Otis",
            "productionYear": 2031,
            "elevatorType": "Passenger"
        },
        "operationalState": {
            "floorNumber": 4,
            "state": "operational"
        },
        "_id": "65fd6ecf03c5dde57a9f58ed"
    },
    // ...
    // Additional elevator objects
]
```

### Different Elevator States Generate Different Properties inside operationalState

| State | Property Name | Description |
| --- | --- | --- |
| operational | None | No additional properties. |
| out-of-order | reason | Description of the cause of the malfunction. |
| warning | warningMessage | Message indicating the reason for the warning. |

## GET /elevators/state/count

### Description:

This endpoint retrieves the count of elevators in each state.

### HTTP Request:

```
GET http://localhost:3000/elevators/state/count
```

### Example Response (200 - OK):

```json
{
    "operational": 5,
    "out-of-order": 1,
    "warning": 3
}
```

This response provides the count of elevators in each state: `operational`, `out-of-orde`r, and `warning`.

## GET /elevators/recentlyVisited

### Description:

This endpoint retrieves the 10 most recently visited elevators, based on previous requests made to the `/elevators/:id` endpoint.

### HTTP Request:

```
GET http://localhost:3000/elevators/recentlyVisited
```

### Example Response (200 - OK):

```json
[
    {
        "elevator": {
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
        "visitedAt": "2024-03-23T11:19:48.484Z"
    },
    {
        "elevator": {
            "specifications": {
                "fabricationNumber": "FAB141",
                "address": "Wiesbaden, Germany",
                "deviceIdentificationNumber": "DIN474",
                "manufacturerName": "Otis",
                "productionYear": 2031,
                "elevatorType": "Passenger"
            },
            "operationalState": {
                "floorNumber": 4,
                "state": "operational"
            },
            "_id": "65fd6ecf03c5dde57a9f58ed"
        },
        "visitedAt": "2024-03-23T11:19:48.587Z"
    },
    // ...
    // Additional recently visited elevators
]

```

This response provides information about the 10 most recently visited elevators, including their specifications, operational state, and the timestamp of the visit.

## Testing

The API is tested using Jest, a JavaScript testing framework. Below are the test cases for each endpoint along with their descriptions.

### Running Tests

To run the tests, execute the following command in the terminal:

```bash
npm run test
```

## Testing

The API is tested using Jest. Below are the test cases for each endpoint.

### GET /test

- Returns an array of elevators.
- Validates elevator properties.
- Checks warning and out-of-order statuses.

### GET /test/state/count

- Returns counts of elevators by state.
- Verifies counts are numbers.

### GET /test/state/:state

- Returns elevators in specified state.
- Handles invalid state.

### GET /test/:id

- Returns elevator by ID.
- Validates elevator chart data.
- Handles invalid ID.

### GET /test/recentlyVisited

- Returns 10 most recently visited elevators.

# Database Documentation

![Screenshot 2024-03-23 at 15.24.26.png](images/dbschemas.png)

The database schema has been designed to efficiently manage user interactions, elevator specifications, and operational data within the application. Users can have access to multiple elevators, as reflected in the schema where the elevators field within the User schema establishes a one-to-many relationship with the Elevator model. Additionally, the recentlyViewed field within the User schema further extends this relationship, allowing users to have multiple elevators in their recently viewed list. Both of these relationships are established using references to the Elevator model.

On the other hand, each elevator is associated with only one chart, representing historical operational data. This one-to-one relationship is established through a reference to the Chart model within the Elevator schema. By linking elevators to charts in this manner, the database schema efficiently manages the storage and retrieval of operational data for each elevator over time.

## User Schema

The User schema captures user-related information and their interactions within the application.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| userInfo | Object |  | Stores essential user details |
| - auth0Id | String | ✔️ | Auth0 ID of the user |
| - nickname | String |  | Nickname of the user |
| - name | String |  | Name of the user |
| - picture | String |  | URL to the user's picture |
| - email | String | ✔️ | Email of the user |
| - emailVerified | Boolean |  | Verification status of the user's email |
| elevators | Array of ObjectId |  | Represents elevators accessible to the user |
| recentlyViewed | Array of Objects |  | Tracks elevators recently viewed by the user |
| - elevator | ObjectId (Reference) |  | Reference to the elevator recently viewed |
| - visitedAt | Date |  | Timestamp of when the elevator was viewed |

## Elevator Schema

The Elevator schema encapsulates details about each elevator.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| specifications | Object |  | Contains detailed specifications of the elevator |
| - fabricationNumber | String | ✔️ | Unique fabrication number of the elevator |
| - address | String | ✔️ | Address of the elevator |
| - deviceIdentificationNumber | String | ✔️ | Unique device identification number of the elevator |
| - manufacturerName | String | ✔️ | Manufacturer name of the elevator |
| - productionYear | Number | ✔️ | Production year of the elevator |
| - elevatorType | String (Enum) | ✔️ | Type of elevator (e.g., Passenger, Freight) |
| operationalState | Object |  | Records the current operational state of the elevator |
| - floorNumber | Number | ✔️ | Current floor number of the elevator |
| - state | String (Enum) | ✔️ | Current state of the elevator (Operational, Out-of-order, Warning) |
| - warningMessage | String |  | Warning message associated with the elevator (if applicable) |
| - reason | String |  | Reason for out-of-order status of the elevator (if applicable) |
| charts | Array of ObjectId |  | Represents historical data sets associated with the elevator |

## Chart Schema

The Chart schema stores historical data related to elevator operation.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| name | String | ✔️ | Indicates the type of data represented by the chart |
| data | Array of Objects | ✔️ | Contains time-series data related to elevator operation |

The chosen database schema provides a foundation for managing user interactions, elevator specifications, and operational data within the application, enabling effective data organization and analysis.