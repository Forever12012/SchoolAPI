# SchoolAPI
Created API's for adding a school and searching for a nearby school.

Endpoints
-------------

1. POST /addSchool
   --------------------------
Description: This endpoint allows you to add a new school to the database. The school’s name, address, latitude, and longitude are required.

Request Body:

name (string): The name of the school.
address (string): The address of the school.
longitude (number): The geographical longitude of the school. Must be between -180 and 180.
latitude (number): The geographical latitude of the school. Must be between -90 and 90.
Validation:

The name and address must be non-empty strings.
The longitude and latitude must be numbers within their respective valid ranges.

2. GET /listSchools
   ----------------------------
Description: This endpoint retrieves a list of schools from the database, sorted by their proximity to a specified location. It calculates the distance from the user’s location to each school using the Haversine formula.

Query Parameters:

latitude (number): Latitude of the user's current location. Must be between -90 and 90.
longitude (number): Longitude of the user's current location. Must be between -180 and 180.
Validation:

Both latitude and longitude must be valid numbers within their respective ranges.
