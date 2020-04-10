# Parkrun API

> A home made API for the parkrun.org.uk website

I wanted to play with the Parkrun website's data set, but they didn't have an available API. I've created this web scraper to have a simple API interface allowing data to be accessed easily.

## Get data for a specific user

### Request

`GET http://mmurphy.co.uk/parkrun/api`

    curl -i -H 'Accept: application/json' http://mmurphy.co.uk/parkrun/api/123456 --get

The number at the end of the endpoint represents the athlete number of the user. Each Parkrun athlete is issued one of these numbers when they register.

### Response

    HTTP/1.1 200 OK
    Server: nginx/1.14.0 (Ubuntu)
    Date: Fri, 10 Apr 2020 20:22:37 GMT
    Content-Type: application/json; charset=utf-8
    Content-Length: 508
    Connection: keep-alive
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    ETag: W/"1fc-CFrtp+1JrMCpfOW6rccLyDIAt1I"

```json
{
  "id": "123456",
  "name": "Michael Murphy",
  "eventCount": 2,
  "events": [
    {
      "name": "stratforduponavon",
      "url": "https://www.parkrun.org.uk/stratforduponavon/results/athletehistory?athleteNumber=123456",
      "runs": [
        {
          "date": "2019-06-09T00:00:00.000Z",
          "number": 47,
          "position": 457,
          "time": 2675,
          "ageGrade": "48.39%",
          "pb": false
        }
      ]
    },
    {
      "name": "durham",
      "url": "https://www.parkrun.org.uk/durham/results/athletehistory?athleteNumber=123456",
      "runs": [
        {
          "date": "2019-07-09T00:00:00.000Z",
          "number": 87,
          "position": 86,
          "time": 2082,
          "ageGrade": "46.15%",
          "pb": true
        }
      ]
    }
  ]
}
```
