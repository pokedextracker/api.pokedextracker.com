#!/usr/bin/env python3
"""
Scrape prod API and generate SQL seed file for local development.
Uses concurrent requests for speed.

Usage:
    python3 scripts/scrape-seed.py > scripts/seed.sql
"""

import json
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

API_BASE = "https://pokedextracker.com/api"
MAX_POKEMON_ID = 1455
DEX_TYPE_FULL_NATIONAL_HOME = 21
CONCURRENCY = 20

UNPUBLISHED_GAME_FAMILIES = [
    ("red_blue", 1, 0, 0, 1, False),
    ("gold_silver", 2, 0, 0, 2, False),
    ("ruby_sapphire", 3, 0, 0, 3, False),
    ("fire_red_leaf_green", 3, 0, 0, 4, False),
    ("emerald", 3, 0, 0, 5, False),
    ("diamond_pearl", 4, 0, 0, 6, False),
    ("platinum", 4, 0, 0, 7, False),
    ("heart_gold_soul_silver", 4, 0, 0, 8, False),
    ("black_white", 5, 0, 0, 9, False),
    ("black2_white2", 5, 0, 0, 10, False),
    ("colosseum", 3, 0, 0, 11, False),
    ("xd", 3, 0, 0, 12, False),
]


def fetch_json(path):
    url = f"{API_BASE}{path}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "PokeTrack-Seed/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise
    except Exception:
        return None


def fetch_pokemon(pid):
    return pid, fetch_json(f"/pokemon/{pid}?dex_type={DEX_TYPE_FULL_NATIONAL_HOME}")


def sql_str(val):
    if val is None:
        return "NULL"
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"


def sql_bool(val):
    return "TRUE" if val else "FALSE"


def sql_int(val):
    return str(val) if val is not None else "NULL"


def sql_arr(vals):
    if not vals:
        return "'{}'::text[]"
    items = ",".join(f'"{v}"' for v in vals)
    return f"'{{{items}}}'::text[]"


def main():
    out = sys.stdout
    err = sys.stderr

    out.write("-- Auto-generated seed data from prod API\n")
    out.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n\n")

    # ── 1. Game Families ──
    err.write("Fetching /games...\n")
    games_data = fetch_json("/games")
    game_families = {}
    for g in games_data:
        gf = g["game_family"]
        game_families[gf["id"]] = gf

    out.write("-- game_families\n")
    for gf_id, gen, rt, nt, order, pub in UNPUBLISHED_GAME_FAMILIES:
        if gf_id not in game_families:
            out.write(
                f"INSERT INTO game_families (id, generation, regional_total, national_total, \"order\", published, regional_support, national_support) "
                f"VALUES ({sql_str(gf_id)}, {gen}, {rt}, {nt}, {order}, {sql_bool(pub)}, FALSE, FALSE) "
                f"ON CONFLICT (id) DO NOTHING;\n"
            )

    for gf_id, gf in sorted(game_families.items(), key=lambda x: x[1]["order"]):
        rs = sql_bool(gf.get("regional_support", False))
        ns = sql_bool(gf.get("national_support", False))
        out.write(
            f"INSERT INTO game_families (id, generation, regional_total, national_total, \"order\", published, regional_support, national_support) "
            f"VALUES ({sql_str(gf_id)}, {gf['generation']}, {gf['regional_total']}, {gf['national_total']}, {gf['order']}, {sql_bool(gf['published'])}, {rs}, {ns}) "
            f"ON CONFLICT (id) DO NOTHING;\n"
        )
    out.write("\n")

    # ── 2. Games ──
    out.write("-- games\n")
    for g in games_data:
        out.write(
            f"INSERT INTO games (id, name, game_family_id, \"order\") "
            f"VALUES ({sql_str(g['id'])}, {sql_str(g['name'])}, {sql_str(g['game_family']['id'])}, {g['order']}) "
            f"ON CONFLICT (id) DO NOTHING;\n"
        )
    out.write("\n")

    # ── 3. Pokemon (concurrent fetch) ──
    err.write(f"Fetching {MAX_POKEMON_ID} pokemon (concurrency={CONCURRENCY})...\n")
    all_pokemon = {}
    fetched = 0

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = {executor.submit(fetch_pokemon, pid): pid for pid in range(1, MAX_POKEMON_ID + 1)}
        for future in as_completed(futures):
            pid, data = future.result()
            fetched += 1
            if fetched % 200 == 0:
                err.write(f"  {fetched}/{MAX_POKEMON_ID}...\n")
            if data is not None:
                all_pokemon[pid] = data

    err.write(f"  Got {len(all_pokemon)} pokemon\n")

    # Sort by ID for deterministic output
    sorted_pokemon = sorted(all_pokemon.values(), key=lambda x: x["id"])

    # Build evolution family map
    evo_family_map = {}
    for p in sorted_pokemon:
        evo_fam = p.get("evolution_family", {})
        pokemon_stages = evo_fam.get("pokemon", [])
        if not pokemon_stages or not pokemon_stages[0]:
            evo_family_map[p["id"]] = p["id"]
            continue
        family_id = pokemon_stages[0][0]["id"]
        for stage in pokemon_stages:
            for ep in stage:
                evo_family_map[ep["id"]] = family_id

    # Write pokemon
    out.write("-- pokemon\n")
    for p in sorted_pokemon:
        evo_fam_id = evo_family_map.get(p["id"], p["id"])
        gf_id = p["game_family"]["id"]
        form = sql_str(p.get("form"))
        out.write(
            f"INSERT INTO pokemon (id, national_id, name, game_family_id, form, national_order, evolution_family_id) "
            f"VALUES ({p['id']}, {p['national_id']}, {sql_str(p['name'])}, {sql_str(gf_id)}, {form}, {p['id']}, {evo_fam_id}) "
            f"ON CONFLICT (id) DO NOTHING;\n"
        )
    out.write(f"\nSELECT setval('pokemon_id_seq', (SELECT COALESCE(MAX(id), 1) FROM pokemon));\n\n")

    # ── 4. Evolutions ──
    out.write("-- evolutions\n")
    seen_evolutions = set()

    for p in sorted_pokemon:
        evo_fam = p.get("evolution_family", {})
        pokemon_stages = evo_fam.get("pokemon", [])
        evo_stages = evo_fam.get("evolutions", [])
        family_id = evo_family_map.get(p["id"], p["id"])

        for stage_idx, stage_evos in enumerate(evo_stages):
            if stage_idx >= len(pokemon_stages) or stage_idx + 1 >= len(pokemon_stages):
                continue

            for evo in stage_evos:
                trigger = evo.get("trigger", "level")

                if trigger == "breed":
                    evolving_stage = pokemon_stages[stage_idx + 1]
                    evolved_stage = pokemon_stages[stage_idx]
                else:
                    evolving_stage = pokemon_stages[stage_idx]
                    evolved_stage = pokemon_stages[stage_idx + 1]

                for evolving in evolving_stage:
                    for evolved in evolved_stage:
                        evo_key = (evolving["id"], evolved["id"])
                        if evo_key in seen_evolutions:
                            continue
                        seen_evolutions.add(evo_key)

                        out.write(
                            f"INSERT INTO evolutions (evolving_pokemon_id, evolved_pokemon_id, evolution_family_id, stage, trigger, level, candy_count, stone, held_item, notes) "
                            f"VALUES ({evolving['id']}, {evolved['id']}, {family_id}, {stage_idx + 1}, {sql_str(trigger)}, "
                            f"{sql_int(evo.get('level'))}, {sql_int(evo.get('candy_count'))}, {sql_str(evo.get('stone'))}, "
                            f"{sql_str(evo.get('held_item'))}, {sql_str(evo.get('notes'))}) "
                            f"ON CONFLICT (evolving_pokemon_id, evolved_pokemon_id) DO NOTHING;\n"
                        )
    out.write("\n")

    # ── 5. Locations ──
    out.write("-- locations (skipped for speed - add later if needed)\n\n")

    # ── 6. Dex Types ──
    err.write("Fetching /dex-types...\n")
    dex_types = fetch_json("/dex-types")

    out.write("-- dex_types (insert without base_dex_type_id first, then update)\n")
    # Insert all without FK reference first
    for dt in dex_types:
        tags = sql_arr(dt.get("tags", []))
        desc = sql_str(dt.get("description"))
        out.write(
            f"INSERT INTO dex_types (id, name, game_family_id, \"order\", tags, description) "
            f"VALUES ({dt['id']}, {sql_str(dt['name'])}, {sql_str(dt['game_family_id'])}, {dt['order']}, {tags}, {desc}) "
            f"ON CONFLICT (id) DO NOTHING;\n"
        )
    # Now update base_dex_type_id for those that have it
    for dt in dex_types:
        if dt.get("base_dex_type_id"):
            out.write(
                f"UPDATE dex_types SET base_dex_type_id = {dt['base_dex_type_id']} WHERE id = {dt['id']};\n"
            )
    out.write(f"\nSELECT setval('dex_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dex_types));\n\n")

    # ── 7. Dex Types Pokemon ──
    out.write("-- dex_types_pokemon (Full National HOME dex = id 21)\n")
    order = 0
    for p in sorted(sorted_pokemon, key=lambda x: (x.get("form") is not None, x["national_id"], x["id"])):
        form = p.get("form")
        if form is None or form in ("alola", "galar", "hisui", "paldea", "gigantamax"):
            order += 1
            out.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number) "
                f"VALUES ({DEX_TYPE_FULL_NATIONAL_HOME}, {p['id']}, {order}, {p['national_id']}) "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
    out.write("\n")

    out.write("\n")
    err.write("Done!\n")


if __name__ == "__main__":
    main()
