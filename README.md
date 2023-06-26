# api.pokedextracker.com

[![CircleCI](https://circleci.com/gh/pokedextracker/api.pokedextracker.com.svg?style=shield)](https://circleci.com/gh/pokedextracker/api.pokedextracker.com)

The API for [pokedextracker.com](http://pokedextracker.com). 

## Install

TODO

## Data

This repo doesn't include a way to completely load up the DB with all of the
actual Pokemon data. That's only been loaded into the staging and production
databases. For testing purposes and to make sure everything is functioning as
expected, having that data isn't entirely necessary. You should be relying on
tests and factories instead of the database state.

## Docker

Every time we deploy this repo, we build a new Docker image and upload it to
Docker Hub. We use an explicit tag with the first 7 characters of the commit
hash. The server will be listening on port 8647 so if you run a container
locally, make sure that traffic is forwarded to that port. For example:

 ```sh
docker run --rm --publish 8647:8647 --name pokedextracker-api pokedextracker/api.pokedextracker.com:$(git rev-parse --short HEAD)
```

## Deployments

>Note: you need the necessary permissions to be able to deploy.

The [deploy script](script/deploy.sh) uses [Helm](https://helm.sh/) and the
[`web-app` Helm
chart](https://github.com/pokedextracker/charts/tree/master/src/web-app) to
create a new release in the PokedexTracker Kubernetes cluster. Pass in the
newly created Docker tag to deploy that version to the cluster.

```sh
yarn deploy
```
