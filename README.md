# Gift Giver

Gift Giver is a  "wedding registry" like app where people can add gifts to list and then invite people to their list. Then people who are invited to the list can use the list to coordinate purchasing the gifts for the list's owner, but the owner themselves cannot see anything that they are doing, keeping it as a surprise.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- `yarn`
- `node`
- `redis`

### Installing

A step by step series of examples that tell you how to get a development env running

Install dependencies

```
$ yarn install
```

```
$  cp .env.example .env
```

Fill in the `.env` file with the appropriate values from Firebase and SendGrid.

Also, get a Google Service Account credentials for your Firebase project and save them as `./gcpgreds.json`

### Running

Run the development server with
```
$ yarn dev
```

Run the background worker with
```
$ yarn worker
```
