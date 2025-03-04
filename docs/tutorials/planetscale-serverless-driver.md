---
title: PlanetScale serverless driver for JavaScript
subtitle: Learn how to use the PlanetScale serverless driver for JavaScript in your projects.
date: '2023-01-30'
---

## Why use the PlanetScale serverless driver

Before learning how to use the PlanetScale serverless driver for JavaScript, it’s worth understanding why you should use this over other MySQL packages available in the directory. Some serverless and edge function hosts do not permit arbitrary outbound TCP connections, which is how many MySQL clients operate.

Using the PlanetScale serverless driver for JavaScript provides a means of accessing your database and executing queries over an HTTP connection, which is generally not blocked by cloud providers. If you encounter issues using MySQL packages with PlanetScale, use the serverless driver instead.

{% callout %}
Be sure to check out our [F1 Championship Stats demo application](https://f1.planetscale.com) and [sample repository](https://github.com/planetscale/f1-championship-stats) to find examples for use with Cloudflare Workers, Vercel Edge Functions, and Netlify Edge Functions.
{% /callout %}

## Add and use the PlanetScale serverless driver for JavaScript to your project

To install the package in your project, run the following install command:

```bash
npm install @planetscale/database
```

### Connect to the database

The first step to using the PlanetScale serverless driver for JavaScript is to connect to your database.

You can get your connection string in the PlanetScale dashboard by clicking on your database, clicking "**Connect**", and selecting `@planetscale/database` from the dropdown.

![Serverless driver connection string](/docs/tutorials/planetscale-serverless-driver/connect-serverless-credentials.png)

{% callout %}
When using the serverless JS driver, your host name will always be `aws.connect.psdb.cloud`. You will notice this is slightly different from the regular PlanetScale connection strings, which are formatted as `<REGION>.connect.psdb.cloud`.
{% /callout %}

Use the `connect` function to create the connection and return it to an object.

```js
const config = {
  host: 'aws.connect.psdb.cloud',
  username: '<PS_USERNAME>',
  password: '<PS_PASSWORD>'
}
const conn = await connect(config)
```

### Executing queries

To execute a query, use the `execute` function of the connection object, with the query passed as the first parameter.

```js
const results = await conn.execute('SELECT * FROM hotels')
```

Here is the content of the `results` object from the `SELECT` statement:

```js
{
  headers: [ 'id', 'name', 'address', 'stars' ],
  types: {
    id: 'UINT32',
    name: 'VARCHAR',
    address: 'VARCHAR',
    stars: 'FLOAT32'
  },
  rows: [
    {
      id: 1,
      name: 'Four Seasons Resort Jackson hole',
      address: '7680 Granite Loop Rd, Teton Village, WY 83025',
      stars: 4.7
    },
    {
      id: 2,
      name: 'The Galt House',
      address: '140 N Fourth St, Louisville, KY 40202',
      stars: 4
    },
    // ...results removed for brevity
  ],
  rowsAffected: null,
  insertId: null,
  error: null,
  size: 5,
  statement: 'SELECT * FROM hotels',
  time: 136
}
```

For parameterized queries, there are two ways in which to pass data to the query. The first is by the order in which they appear in the query. The first step is to add a `?` in the specific locations you want the parameters passed into.

```js
const query = 'INSERT INTO hotels (`name`, `address`, `stars`) VALUES (?, ?, ?)'
```

Then you can pass your parameters as an array of values. The driver package will replace the `?` entries in the query with the values passed in the array, in the order in which they were placed.

```js
const params = ['The Galt House', '140 N Fourth St, Louisville, KY 40202', 4.2]
const results = await conn.execute(query, params)
```

Here is the content of the `results` object for the `INSERT` statement:

```js
{
  headers: [],
  types: {},
  rows: [],
  rowsAffected: 1,
  insertId: '6',
  error: null,
  size: 0,
  statement: "INSERT INTO hotels (`name`, `address`, `stars`) VALUES ('Montage Kapalua Bay 2', '1 Bay Dr, Lahaina, HI 96761', 4)",
  time: 102
}
```

Alternately, you can name your parameters using the `:param_name` format.

```js
const query = 'INSERT INTO hotels (`name`, `address`, `stars`) VALUES (:name, :address :stars)'
const params = {
  name: 'The Galt House',
  address: '140 N Fourth St, Louisville, KY 40202',
  stars: 4.2
}
const results = await conn.execute(query, params)
```
