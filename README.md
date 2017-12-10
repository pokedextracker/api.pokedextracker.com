# api.pokedextracker.com

[![Build Status](https://travis-ci.org/pokedextracker/api.pokedextracker.com.svg)](https://travis-ci.org/pokedextracker/api.pokedextracker.com)
[![Coverage Status](https://coveralls.io/repos/pokedextracker/api.pokedextracker.com/badge.svg?branch=master&service=github)](https://coveralls.io/github/pokedextracker/api.pokedextracker.com?branch=master)
[![Dependency Status](https://david-dm.org/pokedextracker/api.pokedextracker.com.svg)](https://david-dm.org/pokedextracker/api.pokedextracker.com)

The API for [pokedextracker.com](http://pokedextracker.com). It's written in Node.js v5 using the following libraries/packages:

* [Hapi](http://hapijs.com/) - API Framework
* [Joi](https://github.com/hapijs/joi) - Data Validator
* [Bookshelf](http://bookshelfjs.org/) - ORM
* [Knex](http://knexjs.org/) - SQL Query Builder
* [Bcrypt](https://github.com/ncb000gt/node.bcrypt.js/) - Password Hasher
* [JWT](https://jwt.io/) - JSON Web Token

## Install

This project is meant to be run with Node.js v5.12.0, so make sure you have it installed and active when running this application. This project also relies on the `yarn.lock` file to lock down dependency versions, so we recommend that you use [`yarn`](https://yarnpkg.com/en/) instead of `npm` to avoid "it works on my computer" bugs that are all too common with just a `package.json`. Assuming you have [nvm](https://github.com/creationix/nvm) installed, you just need to install v5 and then install the dependencies:

```bash
$ nvm install 5.12.0
$ nvm use 5.12.0
$ cd api.pokedextracker.com
$ yarn
```

If you have [avn](https://github.com/wbyoung/avn) or [`nodenv`](https://github.com/nodenv/nodenv) setup, the `.node-version` file should automatically switch the version for you.

### Database

This project uses PostgreSQL as its database, so you'll need to have the role and database setup. Assuming you already have it installed (either through [`brew`](http://brew.sh/) on OS X or `apt-get` on Ubuntu), you can just run the following:

```
$ psql postgres
postgres=# CREATE ROLE "pokedex_tracker_user" CREATEDB CREATEUSER LOGIN;
$ createdb -O pokedex_tracker_user pokedex_tracker
$ yarn db:migrate
```

### Secrets

There are some secrets needed to run this repo locally, such as the Stripe API Key. Since no secrets are being checked in, you should copy `.env.example` to `.env` and populate it with all of the secrets listed there.

## Data

This repo doesn't include a way to completely load up the DB with all of the actual Pokemon data. That's only been loaded into the staging and production databases. For testing purposes and to make sure everything is functioning as expected, having that data isn't entirely necessary. You should be relying on tests and factories instead of the database state.

## Tests

This project uses [Mocha](https://mochajs.org/) as the test runner, [Chai BDD](http://chaijs.com/api/bdd/) as our assertion library, and [Istanbul](https://github.com/gotwarlost/istanbul) to track code coverage. To run the tests locally, all you need to do is run:

```
$ yarn test
```

It will output the results of the test, and a coverage summary. To see a line-by-line breakdown of coverage to see what you missed, you should open `./coverage/lcov-report/index.html`.
