# api.pokedextracker.com

[![CircleCI](https://circleci.com/gh/pokedextracker/api.pokedextracker.com.svg?style=shield)](https://circleci.com/gh/pokedextracker/api.pokedextracker.com)

The API for [pokedextracker.com](http://pokedextracker.com). 

## Local Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for full local setup instructions including database seeding, Legends Z-A data, and test user configuration.

**Quick start:**

```bash
docker compose up -d
make db:migrate
# See DEVELOPMENT.md for seed instructions
make start
```

**Test user:** `catchthemall` / `catchthemall123` (see [DEVELOPMENT.md](DEVELOPMENT.md#test-user))

## Data

This fork includes complete seed scripts to load all Pokemon data locally. See `scripts/` for:
- `scripts/local/` - Base Pokemon data scraped from production (1454 Pokemon, all dex types)
- `scripts/mega-*.sql` - Legends Z-A and Mega Evolution data (93 megas + 2 primals)
- `scripts/seed-test-user.sql` - Test user with all 27 dex types

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
