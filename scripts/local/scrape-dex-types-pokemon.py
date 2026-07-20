#!/usr/bin/env python3
"""
Scrape dex_types_pokemon data from a prod user's dexes and approximate missing Full National dexes.

Usage:
    python3 scripts/scrape-dex-types-pokemon.py > scripts/seed-dex-types-pokemon.sql
"""

import json
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

API_BASE = "https://pokedextracker.com/api"
USERNAME = "ashketchum10"
CONCURRENCY = 10

# Dex types we already have from HOME Full National (id 21) in the first seed
ALREADY_SEEDED = {21}

# ashketchum10's dexes mapped to dex_type_id
USER_DEXES = [
    (1, "x-regional-living-dex"),
    (3, "omega-ruby-regional-living-dex"),
    (5, "sun-regional-living-dex"),
    (7, "ultra-sun-regional-living-dex"),
    (9, "lets-go-pikachu-regional-living-dex"),
    (10, "sword-regional-living-dex"),
    (11, "sword-national-living-dex"),
    (12, "sword-expansion-pass-regional-living-dex"),
    (14, "brilliant-diamond-regional-living-dex"),
    (15, "brilliant-diamond-national-living-dex"),
    (16, "legends-arceus-regional-living-dex"),
    (17, "shinies"),
    (18, "scarlet-regional-living-dex"),
    (19, "scarlet-expansion-living-dex"),
    (20, "scarlet-kitakami-living-dex"),
    (21, "home-national-living-dex"),
    (22, "scarlet-blueberry-living-dex"),
]

# Missing Full National dex types - approximate from generation cutoffs
# Format: (dex_type_id, max_national_id, allowed_forms)
APPROXIMATE_FULL_NATIONALS = [
    (2, 721, [None]),                          # XY Full National
    (4, 721, [None]),                          # ORAS Full National
    (6, 802, [None, "alola"]),                 # SM Full National
    (8, 807, [None, "alola"]),                 # USUM Full National
    (13, 898, [None, "alola", "galar", "gigantamax"]),  # SwSh EP Full National
]


def fetch_json(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "PokeTrack-Seed/1.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"  ERROR fetching {url}: {e}", file=sys.stderr)
        return None


def fetch_captures(dex_type_id, slug):
    url = f"{API_BASE}/users/{USERNAME}/dexes/{slug}/captures"
    data = fetch_json(url)
    return dex_type_id, slug, data


def main():
    out = sys.stdout
    err = sys.stderr

    out.write("-- dex_types_pokemon seed from prod user (ashketchum10)\n")
    out.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n\n")

    # First, clear existing dex_types_pokemon (except what we want to keep)
    out.write("-- Clear existing dex_types_pokemon to reload fresh\n")
    out.write("DELETE FROM dex_types_pokemon;\n\n")

    # ── Phase 1: Scrape from ashketchum10's dexes ──
    err.write(f"Scraping {len(USER_DEXES)} dexes from {USERNAME}...\n")

    all_dex_data = {}

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = {
            executor.submit(fetch_captures, dt_id, slug): (dt_id, slug)
            for dt_id, slug in USER_DEXES
        }
        for future in as_completed(futures):
            dt_id, slug, data = future.result()
            if data is not None:
                all_dex_data[dt_id] = data
                err.write(f"  dex_type {dt_id:2d}: {len(data)} Pokemon ({slug})\n")
            else:
                err.write(f"  dex_type {dt_id:2d}: FAILED ({slug})\n")

    # Write INSERT statements for scraped dex types
    for dt_id in sorted(all_dex_data.keys()):
        captures = all_dex_data[dt_id]
        out.write(f"-- dex_type {dt_id}\n")

        for order_idx, cap in enumerate(captures, 1):
            pokemon = cap["pokemon"]
            pid = pokemon["id"]
            dex_number = pokemon.get("dex_number", pokemon["national_id"])
            box = pokemon.get("box")
            box_sql = f"'{box}'" if box else "NULL"

            out.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box) "
                f"VALUES ({dt_id}, {pid}, {order_idx}, {dex_number}, {box_sql}) "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        out.write("\n")

    # ── Phase 2: Approximate missing Full National dexes ──
    err.write("\nApproximating missing Full National dex types...\n")

    # Get all Pokemon from our local data (use the HOME dex data we just scraped as source)
    home_data = all_dex_data.get(21, [])
    if not home_data:
        err.write("  WARNING: No HOME data available, skipping approximations\n")
    else:
        for dt_id, max_nat_id, allowed_forms in APPROXIMATE_FULL_NATIONALS:
            if dt_id in all_dex_data:
                err.write(f"  dex_type {dt_id}: already scraped, skipping\n")
                continue

            out.write(f"-- dex_type {dt_id} (approximated Full National, nat_id <= {max_nat_id})\n")
            order = 0
            for cap in home_data:
                pokemon = cap["pokemon"]
                nat_id = pokemon["national_id"]
                form = pokemon.get("form")

                if nat_id > max_nat_id:
                    continue
                if form not in allowed_forms:
                    continue

                order += 1
                pid = pokemon["id"]
                out.write(
                    f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box) "
                    f"VALUES ({dt_id}, {pid}, {order}, {nat_id}, NULL) "
                    f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
                )

            err.write(f"  dex_type {dt_id}: {order} Pokemon (approximated)\n")
            out.write("\n")

    err.write("\nDone!\n")


if __name__ == "__main__":
    main()
