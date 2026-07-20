# Local Development Setup

Complete guide for running the API locally with full Pokemon data, Legends Z-A support, and Mega Evolutions.

## Prerequisites

| Tool | Install | Purpose |
|------|---------|---------|
| Go 1.20+ | `brew install go` | Build and run the API |
| Docker | [docker.com](https://docker.com) | Run Postgres database |
| Docker Compose | Included with Docker Desktop | Orchestrate containers |

## Setup

### 1. Start Postgres

```bash
docker compose up -d
```

This starts Postgres 15 on port `9876` with:
- Database: `pokedex_tracker`
- User: `pokedex_tracker_admin` (no password, trust auth)

### 2. Run Migrations

```bash
make db:migrate
```

Runs all 44 migration files, creating the database schema.

### 3. Seed the Database

The database needs data to be useful. Run these in order:

```bash
# Base Pokemon data (1454 Pokemon, 24 game families, 22 games)
docker exec -i apipokedextrackercom-postgres-1 psql -U pokedex_tracker_admin -d pokedex_tracker --no-psqlrc < scripts/local/seed.sql

# Dex types Pokemon links (which Pokemon belong to which dex type)
docker exec -i apipokedextrackercom-postgres-1 psql -U pokedex_tracker_admin -d pokedex_tracker --no-psqlrc < scripts/local/seed-dex-types-pokemon.sql

# Legends Z-A + Mega Evolution data (game family, 95 mega/primal Pokemon, dex types)
for f in scripts/mega-0{1,2,3,4,5,6}*.sql; do
  docker exec -i apipokedextrackercom-postgres-1 psql -U pokedex_tracker_admin -d pokedex_tracker --no-psqlrc < "$f"
done

# Test user with all dex types (optional but recommended)
docker exec -i apipokedextrackercom-postgres-1 psql -U pokedex_tracker_admin -d pokedex_tracker --no-psqlrc < scripts/seed-test-user.sql
```

### 4. Start the API

```bash
make start
```

The API runs on port `8647` with live-reload via `gin`. It also starts Postgres if not already running.

### 5. Connect the Frontend

In the [pokedextracker.com](https://github.com/pokedextracker/pokedextracker.com) repo:

```bash
NODE_ENV=local yarn start
```

This starts the frontend on port `9898` pointing to `http://localhost:8647`.

## Test User

A pre-configured test user is created by `scripts/seed-test-user.sql`:

| Field | Value |
|-------|-------|
| Username | `catchthemall` |
| Password | `catchthemall123` |
| Profile URL | `http://localhost:9898/u/catchthemall` |

This user has **28 dexes** (one for every dex type + one shiny dex) with 15 random Pokemon marked as caught in each.

### Password Security

The test user password is stored as a bcrypt hash in the seed file. This is fine for local development.

**For production deployments:**
- Either delete the test user from the database
- Or replace the password hash with a secure one:

```bash
# Generate a new bcrypt hash
htpasswd -nbBC 10 '' 'your-secure-password' | cut -d: -f2
```

Then update the hash in `scripts/seed-test-user.sql` or run:

```sql
UPDATE users SET password = '$2y$10$YOUR_NEW_HASH' WHERE username = 'catchthemall';
```

You can also set the password via environment variable by generating the hash at seed time instead of hardcoding it.

## Database Details

### Seed Data Summary

| Data | Source | Records |
|------|--------|---------|
| Pokemon (base forms) | Scraped from production API | 1454 |
| Game families | Scraped from production API | 24 (12 published + 12 unpublished) |
| Games | Scraped from production API | 22 |
| Dex types | Scraped from production API + new Z-A types | 27 |
| Dex types Pokemon | Scraped from prod user + approximated | ~12,000 links |
| Mega/Primal Pokemon | Generated from Bulbapedia data | 95 (93 mega + 2 primal) |
| Mega evolutions | Generated | 95 evolution links |

### Seed Files

| File | Purpose |
|------|---------|
| `scripts/local/seed.sql` | Base Pokemon, game families, games, evolutions |
| `scripts/local/seed-dex-types-pokemon.sql` | Links Pokemon to all 22 original dex types |
| `scripts/local/scrape-seed.py` | Script to regenerate seed.sql from production API |
| `scripts/local/scrape-dex-types-pokemon.py` | Script to regenerate dex type links from a prod user |
| `scripts/mega-01-game-family.sql` | Legends Z-A game family + game |
| `scripts/mega-02-pokemon.sql` | 95 mega/primal Pokemon records |
| `scripts/mega-03-evolutions.sql` | Evolution links (base -> mega with Mega Stone info) |
| `scripts/mega-04-dex-types.sql` | 5 new dex types (Lumiose, Hyperspace, Full, Mega Forms, Combined) |
| `scripts/mega-05-dex-types-pokemon.sql` | Links Pokemon to Z-A dex types |
| `scripts/mega-06-home-update.sql` | Populates HOME Mega Evolution Forms customization dex |
| `scripts/generate-mega-sql.py` | Script to regenerate all mega-*.sql files |
| `scripts/seed-test-user.sql` | Creates test user with all dex types |

### Resetting the Database

To completely reset and re-seed:

```bash
# Drop and recreate the database
docker exec apipokedextrackercom-postgres-1 psql -U pokedex_tracker_admin -c "DROP DATABASE pokedex_tracker;"
docker exec apipokedextrackercom-postgres-1 psql -U pokedex_tracker_admin -c "CREATE DATABASE pokedex_tracker;"

# Re-run migrations + seeds
make db:migrate
# Then run all seed commands from Step 3 above
```

### Connecting with psql

```bash
# Via Docker (no local psql needed)
docker exec -it apipokedextrackercom-postgres-1 psql -U pokedex_tracker_admin -d pokedex_tracker

# Or if you have psql installed locally
psql -h localhost -p 9876 -U pokedex_tracker_admin -d pokedex_tracker
```

## Data Persistence

The Postgres data is stored in `./tmp/pgdata` (Docker volume). Data survives container restarts. To completely wipe the data:

```bash
docker compose down -v
rm -rf ./tmp/pgdata
```

## Available Dex Types

After seeding, the following dex types are available:

| ID | Name | Game | Pokemon Count |
|----|------|------|---------------|
| 1 | Regional | X & Y | 457 |
| 2 | Full National | X & Y | 721 |
| 3 | Regional | Omega Ruby & Alpha Sapphire | 211 |
| 4 | Full National | Omega Ruby & Alpha Sapphire | 721 |
| 5 | Regional | Sun & Moon | 302 |
| 6 | Full National | Sun & Moon | 820 |
| 7 | Regional | Ultra Sun & Ultra Moon | 403 |
| 8 | Full National | Ultra Sun & Ultra Moon | 825 |
| 9 | Regional | Let's Go Pikachu & Eevee | 171 |
| 10 | Regional | Sword & Shield | 428 |
| 11 | Full National | Sword & Shield | 967 |
| 12 | Regional | Sword & Shield Expansion | 882 |
| 13 | Full National | Sword & Shield Expansion | 935 |
| 14 | Regional | Brilliant Diamond & Shining Pearl | 151 |
| 15 | Game National | Brilliant Diamond & Shining Pearl | 493 |
| 16 | Regional | Legends: Arceus | 245 |
| 17 | Gigantamax Forms | HOME | 1112 |
| 18 | Regional | Scarlet & Violet | 404 |
| 19 | Full Paldea | Scarlet & Violet Expansion | 850 |
| 20 | Kitakami | Scarlet & Violet Expansion | 203 |
| 21 | Full National | HOME | 1080 |
| 22 | Blueberry | Scarlet & Violet Expansion | 246 |
| 23 | Lumiose | Legends: Z-A | 274 |
| 24 | Hyperspace | Legends: Z-A | 199 |
| 25 | Full Pokédex | Legends: Z-A | 473 |
| 26 | Mega Evolution Forms | HOME | 1175 |
| 27 | Gigantamax + Mega Evolution Forms | HOME | 1207 |
