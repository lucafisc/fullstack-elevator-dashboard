# Welcome to the Elevator Dashboard 👋 🛗

![screenshot.png](./images/screenshot.png)


> A full-stack web app implemented using Express with TypeScript for the backend, using Auth0 for safeguarding protected routes. MongoDB handles database storage. API endpoints tested with Jest.

> React with TypeScript are used for the frontend, with user authentication using Auth0 and mobile-first design. Tested with Jest and React testing library.


## Index

- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Clone this repository](#clone-this-repository)
    - [Setting up](#setting-up)
    - [Running tests](#running-tests)
- [API](#api)
    - [Introduction](#introduction)
    - [Authentication](#authentication)
    - [GET /elevators](#get-elevators)
    - [GET /elevators/:id](#get-elevatorsid)
    - [GET /elevators/state/:state](#get-elevatorsstatestate)
    - [GET /elevators/state/count](#get-elevatorsstatecount)
    - [GET /elevators/recentlyVisited](#get-elevatorsrecentlyvisited)
    - [Testing](#testing)
- [Database](#database)
    - [User Schema](#user-schema)
    - [Elevator Schema](#elevator-schema)
    - [Chart Schema](#chart-schema)
- [Frontend](#frontend)
    - [App](#app)
    - [Home](#home)
    - [Welcome](#welcome)
    - [Components categories](#components-categories)
    - [Card Components](#card-components)
    - [Page Components](#page-components)

# Getting Started

### Prerequisites

Before getting started, ensure you have the following prerequisites installed:

- Docker and docker-compose
- Node.js and npm (Node Package Manager)
- Git

### Clone this repository

```
git clone https://github.com/lucafisc/fullstack-elevator-dashboard
```

## Setting up

### Create .env File

Create a new file named `.env` in the server directory and fill in the following values:

```
touch .env
```

```bash
DB_URL=mongodb+srv://elevatorAdmin:zI7fzGxtJihdeKHm@cluster0.03yav5m.mongodb.net/elevator-dashboard?retryWrites=true&w=majority&appName=Cluster0
ISSUER_BASE_URL=https://dev-a0oir8yzhmnp7jh3.us.auth0.com/
TEST_USER_TOKEN=auth0|65fd62f37e87f7a8c0a5454f
```

### Run docker compose

```bash
docker-compose up
```

### Access dashboard
You will be able to visit the dashboard at [`http://localhost:4242/`](http://localhost:4242/) . Use one of the test users provided below to login.

### Test Users for Protected Routes

| Email | Password |
| --- | --- |
| skyward-peaks@test.com | ElapseJam88 |
| elevate-industries@test.com | BlueStudio88 |

### Accessing Endpoints
- Authenticated Routes: The main route **`/elevators`** is protected, and only authenticated users can access it. You need to include a valid **JWT token** in the **request header** to authenticate.
- Test Route: Use the **`/test`** route to access all endpoints of the API using a dummy user to get sample data without needing to authenticate


## Running tests

Tests can be run on the server via Jest.
Make sure you setup the .env file in the previous step.
First install the necessary dependencies:

```
npm install
```

```
npm run test
```

And in the client directory, do the same:
```
npm install
```
```
npm run test
```

# API

## Introduction

> Version 1
> 

This API provides comprehensive access to data about elevators for a specific user. 

### Purpose and Scope

The Elevator Data API serves as a vital tool for managing and monitoring elevators associated with your account. It allows you to retrieve detailed information about each elevator's specifications, such as fabrication number, manufacturer, production year, and type. Additionally, you can track the real-time operational state of each elevator, including its current floor number, operational status, warning messages, and reasons for any deviations from normal operation.

### Key Features

- **Get All User's Elevators:** Retrieve a list of all elevators associated with the user's account.
- **Overview of Elevator States:** Obtain an overview of how many elevators are in each operational state, such as "operational," "under maintenance," or "out of order."
- **Filter Elevators by State:** Filter elevators based on their operational state, allowing you to focus on specific subsets of elevators.
- **Detailed Elevator Information:** Access detailed information about a specific elevator, including both its specifications and current operational state. If available, additional data stored in the chart will be populated here, providing a comprehensive view of the elevator's history and performance.
- **Recent Activity:** Retrieve a list of the ten latest viewed elevators, enabling you to track recent user activity and prioritize attention to specific elevators.

## Authentication

Requests to the `/elevators` route must include a valid authentication token in the `Authorization` header. This token should be obtained by logging in as a registered user in the frontend dashboard.

Example of including the authentication token in the request header:

```tsx
headers: {
    Authorization: `Bearer ${token}`,
}
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
| operational | — | No additional properties. |
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

# Database

![dbschemas.png](./images/dbschemas.png)

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

The Elevator schema encapsulates details about each elevator. Elevators are characterized by their specifications, which are mostly constant values, and their operational state, which may change more often over time.

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

NOTE: Original Chart Data attributes were randomized to test Chart component.

# Frontend

This documentation provides detailed information about each React component, including their purpose, usage, props, external dependencies, styling, interaction, and associated tests.

The frontend architecture is structured as follows:

```
└── App
    ├── Home
    │   ├── Header
    │   └── Footer
    │   └── Routes
    │       ├── ElevatorOverview
    │       │   ├── StateCard
    │       │   └── ElevatorCard
    │       ├── ElevatorByState
    │       │   └── ElevatorCard
    │       └── ElevatorById
    │           ├── ElevatorCard
    │           └── ChartCard
    └── Welcome
```

## App

The `App` component is the entry point of the application. It manages the authentication state using Auth0's `useAuth0` hook. Based on the authentication status, it either renders the `Home` component if the user is authenticated or the `Welcome` component if the user is not authenticated.

### External Dependencies

- `useAuth0` from `@auth0/auth0-react`: Used for authentication state management.
- `Home` from `./components/pages/Home`: Renders the main page of the application for authenticated users.
- `Welcome` from `./components/pages/Welcome`: Renders the welcome page for unauthenticated users.

## Home

The `Home` component serves as the main page of the application. It displays a header containing the user's username and logout button. Additionally, it utilizes React Router's `Routes` and `Route` components to render different views based on the URL path.

### Props

| Name | Type | Description |
| --- | --- | --- |
| user | User | The authenticated user object containing user information. |
| logout | () => Promise<void> | A function to logout the user. |

### Child Components

- `Header`: Displays the user's username and logout button.
- `ElevatorOverview`: Renders an overview of elevator data.

### Child Components

- `Header`: Displays the user's username and logout button.
- Route Structure
    - `/` Renders the `ElevatorOverview` component.
    - `/state/:state` Renders the `ElevatorByState` component with the specified state parameter.
    - `/elevator/:id` Renders the `ElevatorById` component with the specified elevator ID parameter.

### External Dependencies

- `Routes` and `Route` from `react-router-dom`: Used for routing between different views.

## Welcome

The `Welcome` component is displayed when the user is not authenticated. It prompts the user to log in and provides a button to initiate the login process.

### Props

| Name | Type | Description |
| --- | --- | --- |
| login | () => Promise<void> | A function to initiate the login process. |

### Interaction

- Clicking the "Login" button initiates the login process.

### External Dependencies

- `Button` from `../ui/Button`: Used to render the login button.

## Components categories

| Category | Description | Has State | Fetches Data | React Router |
| --- | --- | --- | --- | --- |
| UI Components | Small components that make up smaller UI elements | ❌ | ❌ | ❌ |
| Card Components | Components that display information about an object | ❌ (Note: Except for ChartCard component) | ❌ | ❌ |
| Pages | Components that take over the entire page and often fetch data from APIs or perform authentication-related tasks. Typically routed by React Router or displayed using conditional logic.
 | ✔️ | ✔️ | ✔️  |

## Card Components

### StateCard

The `StateCard` component displays information about the total count of elevators in a specific state. It provides a clickable link to navigate to a page displaying more detailed information about elevators in that state.

### Props

| Name | Type | Description |
| --- | --- | --- |
| state | string | The state of the elevators (e.g., "operational", "warning", "out-of-order"). |
| count | number | The total count of elevators in the specified state. |

### External Dependencies

- `Link` from `react-router-dom`: Used for navigation to the detailed state page.
- `calculateBackgroundColor`: Used to calculate the border color based on the elevator state.

### Interaction

- Clicking on the `StateCard` navigates to a detailed page displaying information about elevators in that state.

### Test Cases

- Renders with correct state and count.
- Renders with correct background color based on state.

### ElevatorCard

The `ElevatorCard` component displays information about a specific elevator. It provides a clickable link to navigate to a page displaying more detailed information about that elevator.

### Props

| Name | Type | Description |
| --- | --- | --- |
| elevator | Elevator | An object containing details about the elevator instance. |

### External Dependencies

- `Link` from `react-router-dom`: Used for navigation to the detailed elevator page.
- `ElevatorStatusCircle` and `ElevatorSpecs`: UI components used to display elevator status and specifications.

### Interaction

- Clicking on the `ElevatorCard` navigates to a detailed page displaying information about the selected elevator.

### Test Cases

- Renders a link to the correct location.
- **UI Cards Children Tests:**
    - **ElevatorSpecs Component:**
        - Renders with correct specifications and operational state.
        - Renders with correct warning state.
        - Renders with correct out-of-order state.
    - **ElevatorStatusCircle Component:**
        - Renders with correct border color for each state.

### ChartCard

The `ChartCard` component displays a line chart representing various metrics related to elevator operation. It provides a visual representation of data such as door closed count, door closings count, door cycles count, door opened count, and door openings count.

### Props

| Name | Type | Description |
| --- | --- | --- |
| elevator | Elevator | An object containing details about the elevator instance. |

### State

| Name | Type | Description |
| --- | --- | --- |
| parentDimensions | object | Contains the width and height of the parent element. |

### External Dependencies

- `LineChart` from `@mui/x-charts/LineChart`: Used to render the line chart.

### Interaction

- Displays a line chart with elevator operation metrics.

### Test Cases

- Renders "No charts available for this elevator" if chart data is not present.
- Renders the chart name if chart data is present.

## Page Components

### ElevatorByState

The `ElevatorByState` component displays a list of elevators with a specific operational state. It fetches data from the API based on the state parameter in the URL and renders corresponding elevator cards.

### State

| Name | Type | Description |
| --- | --- | --- |
| elevators | Elevator[] | An array containing elevator objects fetched from the API. |
| error | string | null | An error message if an error occurs during data fetching. |

### URL Parameters

| Name | Type | Description |
| --- | --- | --- |
| state | string | The state parameter obtained from the URL. |

### Interaction

- Clicking the "← Back to Dashboard" link navigates back to the dashboard.
- Clicking on an  `ElevatorCard`  child component navigates to a detailed page displaying information about the selected elevator.

### External Dependencies

- `Link` from `react-router-dom`: Used for navigation back to the dashboard.
- `getFromAPI` from `../../utils/getFromAPI`: Used to fetch elevator data from the API.
- `useAuth0` from `@auth0/auth0-react`: Used for authentication and to get the access token.
- `ElevatorCard` from `../cards/ElevatorCard`: Used to render individual elevator cards.
- `GridContainer` from `../ui/GridContainer`: Used for layout purposes.

### Test Cases

- Fetches data from API and renders operational elevator cards.
- Fetches data from API and renders warning elevator cards.
- Fetches data from API and renders out-of-order elevator cards.

### ElevatorById

The `ElevatorById` component is responsible for displaying detailed information about a specific elevator identified by its ID. It fetches data from the API based on the provided ID parameter in the URL and renders the elevator details along with a chart displaying relevant information.

### State

| Name | Type | Description |
| --- | --- | --- |
| elevator | Elevator | null | The elevator object fetched from the API. |
| error | string | null | An error message if an error occurs during data fetching. |

### URL Parameters

| Name | Type | Description |
| --- | --- | --- |
| id | string | The ID parameter obtained from the URL. |

### Interaction

- Clicking the "← Back to Dashboard" link navigates back to the dashboard.

### External Dependencies

- `Link` from `react-router-dom`: Used for navigation back to the dashboard.
- `getFromAPI` from `../../utils/getFromAPI`: Utilized to fetch elevator data from the API.
- `useAuth0` from `@auth0/auth0-react`: Utilized for authentication and to obtain the access token.
- `ElevatorCard` from `../cards/ElevatorCard`: Renders detailed information about the elevator.
- `ChartCard` from `../cards/ChartCard`: Displays a chart illustrating relevant data related to the elevator.

### Test Cases

- Fetches data from API and renders elevator card and chart card.

### ElevatorOverview

The `ElevatorOverview` component provides an overview of elevator states and recently visited elevators. It fetches data from the API to display the count of elevators in different operational states and a list of recently visited elevators.

### State

| Name | Type | Description |
| --- | --- | --- |
| elevatorStateCount | ElevatorStateCount | null | An object that stores how many elevators are in each state. |
| elevators | RecentlyVisited[] | An array containing recently visited elevator objects fetched from the API. |
| error | string | null | An error message if an error occurs during data fetching. |

### Interaction

- Clicking on an `ElevatorCard` child component navigates to a detailed page displaying information about the selected elevator.
- Clicking on a `StateCard` child component navigates to a page that lists elevators in that particular state.

### External Dependencies

- `useAuth0` from `@auth0/auth0-react`: Used for authentication and obtaining the access token.
- `getFromAPI` from `../../utils/getFromAPI`: Utilized to fetch elevator data from the API.
- `StateCard` from `../cards/StateCard`: Renders a card displaying elevator state information.
- `GridContainer` from `../ui/GridContainer`: Used for layout purposes.
- `ElevatorCard` from `../cards/ElevatorCard`: Renders individual elevator cards.

### Test Cases

- Fetches data from API and renders elevator state cards.
- Fetches data from API and renders recently visited elevator cards.