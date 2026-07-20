#!/usr/bin/env python3
"""
Generate all mega evolution SQL files from the Bulbapedia Mega Evolution Pokédex data.

Usage:
    python3 scripts/generate-mega-sql.py

Produces:
    scripts/mega-01-game-family.sql
    scripts/mega-02-pokemon.sql
    scripts/mega-03-evolutions.sql
    scripts/mega-04-dex-types.sql
    scripts/mega-05-dex-types-pokemon.sql
    scripts/mega-06-home-update.sql
"""

import os
import time

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

# Starting ID for new mega Pokemon records (current max is 1455)
MEGA_START_ID = 2000

# Existing dex type max is 22, new ones start at 23
# Game family order: next available after 23 (scarlet_violet_expansion_pass)
# HOME is 9999, so we use 24 for legends_z_a
ZA_GAME_FAMILY_ORDER = 24

# Full National HOME dex type ID
HOME_FULL_NATIONAL_ID = 21

# ── Base Pokemon mapping (from DB query) ──
# Format: national_id -> (db_id, name, evolution_family_id, game_family_id)
BASE_POKEMON = {
    3:    (3,    "Venusaur",     1,    "red_blue"),
    6:    (6,    "Charizard",    4,    "red_blue"),
    9:    (9,    "Blastoise",    7,    "red_blue"),
    15:   (15,   "Beedrill",     13,   "red_blue"),
    18:   (18,   "Pidgeot",      16,   "red_blue"),
    26:   (26,   "Raichu",       172,  "red_blue"),
    36:   (36,   "Clefable",     173,  "red_blue"),
    65:   (65,   "Alakazam",     63,   "red_blue"),
    71:   (71,   "Victreebel",   69,   "red_blue"),
    80:   (80,   "Slowbro",      79,   "red_blue"),
    94:   (94,   "Gengar",       92,   "red_blue"),
    115:  (115,  "Kangaskhan",   115,  "red_blue"),
    121:  (121,  "Starmie",      120,  "red_blue"),
    127:  (127,  "Pinsir",       127,  "red_blue"),
    130:  (130,  "Gyarados",     129,  "red_blue"),
    142:  (142,  "Aerodactyl",   142,  "red_blue"),
    149:  (149,  "Dragonite",    147,  "red_blue"),
    150:  (150,  "Mewtwo",       150,  "red_blue"),
    154:  (154,  "Meganium",     152,  "gold_silver"),
    160:  (160,  "Feraligatr",   158,  "gold_silver"),
    181:  (181,  "Ampharos",     179,  "gold_silver"),
    208:  (208,  "Steelix",      95,   "gold_silver"),
    212:  (212,  "Scizor",       123,  "gold_silver"),
    214:  (214,  "Heracross",    214,  "gold_silver"),
    227:  (227,  "Skarmory",     227,  "gold_silver"),
    229:  (229,  "Houndoom",     228,  "gold_silver"),
    248:  (248,  "Tyranitar",    246,  "gold_silver"),
    254:  (254,  "Sceptile",     252,  "ruby_sapphire"),
    257:  (257,  "Blaziken",     255,  "ruby_sapphire"),
    260:  (260,  "Swampert",     258,  "ruby_sapphire"),
    282:  (282,  "Gardevoir",    280,  "ruby_sapphire"),
    302:  (302,  "Sableye",      302,  "ruby_sapphire"),
    303:  (303,  "Mawile",       303,  "ruby_sapphire"),
    306:  (306,  "Aggron",       304,  "ruby_sapphire"),
    308:  (308,  "Medicham",     307,  "ruby_sapphire"),
    310:  (310,  "Manectric",    309,  "ruby_sapphire"),
    319:  (319,  "Sharpedo",     318,  "ruby_sapphire"),
    323:  (323,  "Camerupt",     322,  "ruby_sapphire"),
    334:  (334,  "Altaria",      333,  "ruby_sapphire"),
    354:  (354,  "Banette",      353,  "ruby_sapphire"),
    358:  (358,  "Chimecho",     433,  "ruby_sapphire"),
    359:  (359,  "Absol",        359,  "ruby_sapphire"),
    362:  (362,  "Glalie",       361,  "ruby_sapphire"),
    373:  (373,  "Salamence",    371,  "ruby_sapphire"),
    376:  (376,  "Metagross",    374,  "ruby_sapphire"),
    380:  (380,  "Latias",       380,  "ruby_sapphire"),
    381:  (381,  "Latios",       381,  "ruby_sapphire"),
    382:  (382,  "Kyogre",       382,  "ruby_sapphire"),
    383:  (383,  "Groudon",      383,  "ruby_sapphire"),
    384:  (384,  "Rayquaza",     384,  "ruby_sapphire"),
    398:  (398,  "Staraptor",    396,  "diamond_pearl"),
    428:  (428,  "Lopunny",      427,  "diamond_pearl"),
    445:  (445,  "Garchomp",     443,  "diamond_pearl"),
    448:  (448,  "Lucario",      447,  "diamond_pearl"),
    460:  (460,  "Abomasnow",    459,  "diamond_pearl"),
    475:  (475,  "Gallade",      280,  "diamond_pearl"),
    478:  (478,  "Froslass",     361,  "diamond_pearl"),
    485:  (485,  "Heatran",      485,  "diamond_pearl"),
    491:  (491,  "Darkrai",      491,  "diamond_pearl"),
    500:  (500,  "Emboar",       498,  "black_white"),
    530:  (530,  "Excadrill",    529,  "black_white"),
    531:  (531,  "Audino",       531,  "black_white"),
    545:  (545,  "Scolipede",    543,  "black_white"),
    560:  (560,  "Scrafty",      559,  "black_white"),
    604:  (604,  "Eelektross",   602,  "black_white"),
    609:  (609,  "Chandelure",   607,  "black_white"),
    623:  (623,  "Golurk",       622,  "black_white"),
    652:  (652,  "Chesnaught",   650,  "x_y"),
    655:  (655,  "Delphox",      653,  "x_y"),
    658:  (658,  "Greninja",     656,  "x_y"),
    668:  (668,  "Pyroar",       667,  "x_y"),
    670:  (670,  "Floette",      669,  "x_y"),
    678:  (678,  "Meowstic",     677,  "x_y"),
    687:  (687,  "Malamar",      686,  "x_y"),
    689:  (689,  "Barbaracle",   688,  "x_y"),
    691:  (691,  "Dragalge",     690,  "x_y"),
    701:  (701,  "Hawlucha",     701,  "x_y"),
    718:  (718,  "Zygarde",      718,  "x_y"),
    719:  (719,  "Diancie",      719,  "x_y"),
    740:  (740,  "Crabominable", 739,  "sun_moon"),
    768:  (768,  "Golisopod",    767,  "sun_moon"),
    780:  (780,  "Drampa",       780,  "sun_moon"),
    801:  (801,  "Magearna",     801,  "sun_moon"),
    807:  (825,  "Zeraora",      825,  "ultra_sun_ultra_moon"),
    870:  (925,  "Falinks",      925,  "sword_shield"),
    952:  (1265, "Scovillain",   1264, "scarlet_violet"),
    970:  (1293, "Glimmora",     1292, "scarlet_violet"),
    978:  (1278, "Tatsugiri",    1278, "scarlet_violet"),
    998:  (1277, "Baxcalibur",   1275, "scarlet_violet"),
}

# ── All 93 Mega Evolutions from Bulbapedia Mega Evolution Pokédex ──
# Format: (national_id, form, ldex, hdex, added_in, mega_stone)
# ldex/hdex = None if not in that dex
MEGA_EVOLUTIONS = [
    # Base game (Lumiose) - 68 entries
    (154, "mega",   3,   None, "Base game", "Meganiumite"),
    (500, "mega",   6,   None, "Base game", "Emboarite"),
    (160, "mega",   9,   None, "Base game", "Feraligite"),
    (15,  "mega",   20,  None, "Base game", "Beedrillite"),
    (18,  "mega",   23,  None, "Base game", "Pidgeotite"),
    (181, "mega",   26,  None, "Base game", "Ampharosite"),
    (130, "mega",   33,  None, "Base game", "Gyaradosite"),
    (689, "mega",   35,  None, "Base game", "Barbaracite"),
    (121, "mega",   37,  None, "Base game", "Starminite"),
    (670, "mega",   39,  None, "Base game", "Floettite"),
    (668, "mega",   46,  None, "Base game", "Pyroarite"),
    (36,  "mega",   57,  None, "Base game", "Clefablite"),
    (65,  "mega",   64,  None, "Base game", "Alakazite"),
    (94,  "mega",   67,  None, "Base game", "Gengarite"),
    (545, "mega",   70,  None, "Base game", "Scolipite"),
    (71,  "mega",   76,  None, "Base game", "Victreebelite"),
    (308, "mega",   84,  None, "Base game", "Medichamite"),
    (310, "mega",   86,  None, "Base game", "Manectite"),
    (282, "mega",   89,  None, "Base game", "Gardevoirite"),
    (475, "mega",   90,  None, "Base game", "Galladite"),
    (229, "mega",   92,  None, "Base game", "Houndoominite"),
    (334, "mega",   94,  None, "Base game", "Altarianite"),
    (531, "mega",   95,  None, "Base game", "Audinite"),
    (428, "mega",   110, None, "Base game", "Lopunnite"),
    (354, "mega",   112, None, "Base game", "Banettite"),
    (323, "mega",   117, None, "Base game", "Cameruptite"),
    (530, "mega",   121, None, "Base game", "Excadrite"),
    (445, "mega",   130, None, "Base game", "Garchompite"),
    (302, "mega",   132, None, "Base game", "Sablenite"),
    (303, "mega",   133, None, "Base game", "Mawilite"),
    (359, "mega",   134, None, "Base game", "Absolite"),
    (448, "mega",   136, None, "Base game", "Lucarionite"),
    (80,  "mega",   138, None, "Base game", "Slowbronite"),
    (319, "mega",   141, None, "Base game", "Sharpedonite"),
    (604, "mega",   144, None, "Base game", "Eelektrossite"),
    (149, "mega",   147, None, "Base game", "Dragoninite"),
    (3,   "mega",   150, None, "Base game", "Venusaurite"),
    (6,   "mega-x", 153, None, "Base game", "Charizardite X"),
    (6,   "mega-y", 153, None, "Base game", "Charizardite Y"),
    (9,   "mega",   156, None, "Base game", "Blastoisinite"),
    (687, "mega",   160, None, "Base game", "Malamarite"),
    (691, "mega",   162, None, "Base game", "Dragalgite"),
    (362, "mega",   170, None, "Base game", "Glalitite"),
    (478, "mega",   171, None, "Base game", "Froslassite"),
    (460, "mega",   173, None, "Base game", "Abomasite"),
    (212, "mega",   177, None, "Base game", "Scizorite"),
    (127, "mega",   178, None, "Base game", "Pinsirite"),
    (214, "mega",   179, None, "Base game", "Heracronite"),
    (701, "mega",   181, None, "Base game", "Hawluchanite"),
    (560, "mega",   185, None, "Base game", "Scraftinite"),
    (609, "mega",   191, None, "Base game", "Chandelurite"),
    (142, "mega",   192, None, "Base game", "Aerodactylite"),
    (208, "mega",   198, None, "Base game", "Steelixite"),
    (306, "mega",   201, None, "Base game", "Aggronite"),
    (248, "mega",   208, None, "Base game", "Tyranitarite"),
    (658, "mega",   211, None, "Base game", "Greninjite"),
    (870, "mega",   212, None, "Base game", "Falinksite"),
    (652, "mega",   215, None, "Base game", "Chesnaughtite"),
    (227, "mega",   216, None, "Base game", "Skarmorite"),
    (655, "mega",   219, None, "Base game", "Delphoxite"),
    (373, "mega",   222, None, "Base game", "Salamencite"),
    (115, "mega",   223, None, "Base game", "Kangaskhanite"),
    (780, "mega",   224, None, "Base game", "Drampanite"),
    (376, "mega",   227, None, "Base game", "Metagrossite"),
    (718, "mega",   230, None, "Base game", "Zygardite"),
    (719, "mega",   231, None, "Base game", "Diancite"),
    (150, "mega-x", 232, None, "Base game", "Mewtwonite X"),
    (150, "mega-y", 232, None, "Base game", "Mewtwonite Y"),
    # Mega Dimension DLC megas with Lumiose Pokemon (go to Hyperspace dex)
    (678, "mega",   44,  None, "Mega Dimension", "Meowsticite"),
    (26,  "mega-x", 54,  None, "Mega Dimension", "Raichunite X"),
    (26,  "mega-y", 54,  None, "Mega Dimension", "Raichunite Y"),
    (445, "mega-z", 130, None, "Mega Dimension", "Garchompite Z"),
    (359, "mega-z", 134, None, "Mega Dimension", "Absolite Z"),
    (448, "mega-z", 136, None, "Mega Dimension", "Lucarionite Z"),
    # Mega Dimension DLC megas with Hyperspace Pokemon
    (952, "mega",   None, 15,  "Mega Dimension", "Scovillainite"),
    (970, "mega",   None, 21,  "Mega Dimension", "Glimmoranite"),
    (978, "mega",   None, 31,  "Mega Dimension", "Tatsugirinite"),
    (998, "mega",   None, 34,  "Mega Dimension", "Baxcalibrite"),
    (254, "mega",   None, 41,  "Mega Dimension", "Sceptilite"),
    (257, "mega",   None, 44,  "Mega Dimension", "Blazikenite"),
    (260, "mega",   None, 47,  "Mega Dimension", "Swampertite"),
    (358, "mega",   None, 50,  "Mega Dimension", "Chimechite"),
    (768, "mega",   None, 63,  "Mega Dimension", "Golisopite"),
    (623, "mega",   None, 72,  "Mega Dimension", "Golurkite"),
    (398, "mega",   None, 83,  "Mega Dimension", "Staraptite"),
    (740, "mega",   None, 88,  "Mega Dimension", "Crabominite"),
    (485, "mega",   None, 113, "Mega Dimension", "Heatranite"),
    (491, "mega",   None, 125, "Mega Dimension", "Darkranite"),
    (380, "mega",   None, 126, "Mega Dimension", "Latiasite"),
    (381, "mega",   None, 127, "Mega Dimension", "Latiosite"),
    (384, "mega",   None, 130, "Mega Dimension", None),  # Rayquaza has no Mega Stone
    (801, "mega",   None, 131, "Mega Dimension", "Magearnite"),
    (807, "mega",   None, 132, "Mega Dimension", "Zeraorite"),
]

# Primal Reversions (in Hyperspace dex)
PRIMAL_REVERSIONS = [
    (382, "primal", None, 128, "Mega Dimension", "Blue Orb"),
    (383, "primal", None, 129, "Mega Dimension", "Red Orb"),
]

# Lumiose base Pokemon national IDs (232 Pokemon from Serebii scrape)
# Extracted from the Serebii image URLs
LUMIOSE_BASE_POKEMON_NATIDS = [
    152, 153, 154, 498, 499, 500, 158, 159, 160, 661, 662, 663, 659, 660,
    664, 665, 666, 13, 14, 15, 16, 17, 18, 179, 180, 181, 504, 505,
    406, 315, 407, 129, 130, 688, 689, 120, 121, 669, 670, 671, 672, 673,
    677, 678, 667, 668, 674, 675, 568, 569, 702, 172, 25, 26, 173, 35, 36,
    167, 168, 23, 24, 63, 64, 65, 92, 93, 94, 543, 544, 545, 679, 680, 681,
    69, 70, 71, 511, 512, 513, 514, 515, 516, 307, 308, 309, 310, 280, 281,
    282, 475, 228, 229, 333, 334, 531, 682, 683, 684, 685, 133, 134, 135,
    136, 196, 197, 470, 471, 700, 427, 428, 353, 354, 582, 583, 584, 322,
    323, 449, 450, 529, 530, 551, 552, 553, 66, 67, 68, 443, 444, 445, 703,
    302, 303, 359, 447, 448, 79, 80, 199, 318, 319, 602, 603, 604, 147, 148,
    149, 1, 2, 3, 4, 5, 6, 7, 8, 9, 686, 687, 690, 691, 361, 362, 478, 459,
    460, 123, 212, 127, 214, 701, 559, 560, 607, 608, 609, 142, 95, 208,
    304, 305, 306, 246, 247, 248, 656, 657, 658, 870, 650, 651, 652, 227,
    653, 654, 655, 371, 372, 373, 115, 780, 374, 375, 376, 718, 719, 150,
]

# Hyperspace base Pokemon national IDs (132 Pokemon from Serebii scrape)
HYPERSPACE_BASE_POKEMON_NATIDS = [
    56, 57, 979, 52, 53, 863, 83, 865, 104, 105, 137, 233, 474, 951, 952,
    957, 958, 959, 967, 969, 970, 479, 971, 972, 769, 770, 352, 973, 615,
    977, 978, 996, 997, 998, 999, 1000, 211, 904, 252, 253, 254, 255, 256,
    257, 258, 259, 260, 349, 350, 433, 358, 876, 509, 510, 517, 518, 538,
    539, 562, 563, 867, 767, 768, 827, 828, 852, 853, 778, 900, 877, 622,
    623, 821, 822, 823, 174, 39, 40, 926, 927, 396, 397, 398, 325, 326,
    931, 739, 740, 932, 933, 934, 316, 317, 41, 42, 169, 935, 936, 937,
    942, 943, 848, 849, 944, 945, 335, 336, 439, 122, 866, 590, 591,
    485, 721, 638, 639, 640, 647, 648, 649, 720, 802, 808, 809, 491,
    380, 381, 382, 383, 384, 801, 807,
]


def sql_str(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"


def load_natid_to_dbid():
    """Load national_id -> db_id mapping from file generated by:
    psql ... -c "SELECT DISTINCT ON (national_id) national_id, id FROM pokemon WHERE form IS NULL ORDER BY national_id, id ASC;"
    """
    mapping = {}
    path = os.path.join("/var/folders/td/2m65y33s30z42l9jh3d7btbc0000gp/T/opencode", "natid_to_dbid.txt")
    if os.path.exists(path):
        with open(path) as fh:
            for line in fh:
                line = line.strip()
                if "|" in line:
                    nat_id, db_id = line.split("|")
                    mapping[int(nat_id)] = int(db_id)
    return mapping


def main():
    natid_to_dbid = load_natid_to_dbid()
    all_forms = MEGA_EVOLUTIONS + PRIMAL_REVERSIONS
    next_id = MEGA_START_ID

    # Assign IDs to each mega/primal form
    form_records = []
    for nat_id, form, ldex, hdex, added_in, stone in all_forms:
        base = BASE_POKEMON[nat_id]
        form_records.append({
            "id": next_id,
            "national_id": nat_id,
            "name": base[1],
            "form": form,
            "evolution_family_id": base[2],
            "game_family_id": "legends_z_a",
            "base_id": base[0],
            "ldex": ldex,
            "hdex": hdex,
            "added_in": added_in,
            "mega_stone": stone,
        })
        next_id += 1

    # ── File 1: Game Family ──
    with open(os.path.join(SCRIPTS_DIR, "mega-01-game-family.sql"), "w") as f:
        f.write("-- Legends Z-A game family and game\n")
        f.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n\n")
        f.write(f"INSERT INTO game_families (id, generation, regional_total, national_total, \"order\", published, regional_support, national_support)\n")
        f.write(f"VALUES ('legends_z_a', 9, 0, 0, {ZA_GAME_FAMILY_ORDER}, TRUE, FALSE, FALSE)\n")
        f.write(f"ON CONFLICT (id) DO NOTHING;\n\n")
        f.write(f"INSERT INTO games (id, name, game_family_id, \"order\")\n")
        f.write(f"VALUES ('legends_z_a', 'Legends: Z-A', 'legends_z_a', 42)\n")
        f.write(f"ON CONFLICT (id) DO NOTHING;\n")

    # ── File 2: Pokemon ──
    with open(os.path.join(SCRIPTS_DIR, "mega-02-pokemon.sql"), "w") as f:
        f.write("-- Mega Evolution and Primal Reversion Pokemon records\n")
        f.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n")
        f.write(f"-- Total: {len(form_records)} records (93 megas + 2 primals)\n")
        f.write(f"-- evolution_family_id = self (isolates mega from base family chain)\n\n")
        for rec in form_records:
            f.write(
                f"INSERT INTO pokemon (id, national_id, name, game_family_id, form, national_order, evolution_family_id)\n"
                f"VALUES ({rec['id']}, {rec['national_id']}, {sql_str(rec['name'])}, {sql_str(rec['game_family_id'])}, "
                f"{sql_str(rec['form'])}, {rec['id']}, {rec['id']})\n"
                f"ON CONFLICT (id) DO NOTHING;\n\n"
            )
        f.write(f"SELECT setval('pokemon_id_seq', (SELECT COALESCE(MAX(id), 1) FROM pokemon));\n")

    # ── File 3: Evolutions ──
    with open(os.path.join(SCRIPTS_DIR, "mega-03-evolutions.sql"), "w") as f:
        f.write("-- Evolution links: base Pokemon -> mega/primal form\n")
        f.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n")
        f.write(f"-- Each mega has its own isolated evolution family (evolution_family_id = mega's own id)\n")
        f.write(f"-- This shows a simple 2-Pokemon chain: Base → Mega (with Mega Stone info)\n\n")
        for rec in form_records:
            stone_note = rec["mega_stone"]
            if stone_note:
                notes = sql_str(f"Mega Stone: {stone_note}")
            elif rec["form"] == "primal":
                notes = sql_str("Primal Reversion")
            else:
                notes = sql_str("Dragon Ascent required")  # Rayquaza

            # evolving_pokemon_id = the base form with same national_id
            # evolution_family_id = mega's own id (isolated family)
            # stage = 1 always (simple 2-Pokemon chain)
            f.write(
                f"INSERT INTO evolutions (evolving_pokemon_id, evolved_pokemon_id, evolution_family_id, stage, trigger, notes)\n"
                f"VALUES ({rec['base_id']}, {rec['id']}, {rec['id']}, 1, 'other', {notes})\n"
                f"ON CONFLICT (evolving_pokemon_id, evolved_pokemon_id) DO NOTHING;\n\n"
            )

    # ── File 4: Dex Types ──
    with open(os.path.join(SCRIPTS_DIR, "mega-04-dex-types.sql"), "w") as f:
        f.write("-- New dex types for Legends Z-A and HOME mega customization\n")
        f.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n\n")
        # Z-A Lumiose (Regional)
        f.write("-- Z-A Lumiose Pokédex\n")
        f.write("INSERT INTO dex_types (id, name, game_family_id, \"order\", tags, description)\n")
        f.write("VALUES (23, 'Lumiose', 'legends_z_a', 1, '{\"regional\"}', 'Lumiose City Pokédex including Mega Evolutions')\n")
        f.write("ON CONFLICT (id) DO NOTHING;\n\n")
        # Z-A Hyperspace (Regional)
        f.write("-- Z-A Hyperspace Pokédex\n")
        f.write("INSERT INTO dex_types (id, name, game_family_id, \"order\", tags, description)\n")
        f.write("VALUES (24, 'Hyperspace', 'legends_z_a', 2, '{\"regional\"}', 'Hyperspace Pokédex from Mega Dimension DLC')\n")
        f.write("ON CONFLICT (id) DO NOTHING;\n\n")
        # Z-A Full Pokédex
        f.write("-- Z-A Full Pokédex (Lumiose + Hyperspace combined)\n")
        f.write("INSERT INTO dex_types (id, name, game_family_id, \"order\", tags, description)\n")
        f.write("VALUES (25, 'Full Pokédex', 'legends_z_a', 3, '{\"regional\"}', 'Complete Legends Z-A Pokédex (Lumiose + Hyperspace)')\n")
        f.write("ON CONFLICT (id) DO NOTHING;\n\n")
        # HOME Mega Evolution Forms (customization)
        f.write("-- HOME Mega Evolution Forms (customization on Full National)\n")
        f.write("INSERT INTO dex_types (id, name, game_family_id, \"order\", tags, description, base_dex_type_id)\n")
        f.write(f"VALUES (26, 'Mega Evolution Forms', 'home', -2, '{{\"full national\",\"customization-mega evolution forms\"}}', "
                f"'Includes all Mega Evolutions and Primal Reversions', {HOME_FULL_NATIONAL_ID})\n")
        f.write("ON CONFLICT (id) DO NOTHING;\n\n")
        # HOME Gigantamax + Mega Evolution Forms (combined customization)
        f.write("-- HOME Gigantamax + Mega Evolution Forms (both customizations selected)\n")
        f.write("INSERT INTO dex_types (id, name, game_family_id, \"order\", tags, description, base_dex_type_id)\n")
        f.write(f"VALUES (27, 'Gigantamax + Mega Evolution Forms', 'home', -3, "
                f"'{{\"full national\",\"customization-gigantamax forms\",\"customization-mega evolution forms\"}}', "
                f"'Includes both Gigantamax and Mega Evolution Forms', {HOME_FULL_NATIONAL_ID})\n")
        f.write("ON CONFLICT (id) DO NOTHING;\n\n")
        f.write("SELECT setval('dex_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dex_types));\n")

    # ── File 5: Dex Types Pokemon ──
    with open(os.path.join(SCRIPTS_DIR, "mega-05-dex-types-pokemon.sql"), "w") as f:
        f.write("-- Link Pokemon to Z-A dex types (Lumiose, Hyperspace, Full)\n")
        f.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n\n")

        # Build mega form lookup by national_id
        lumiose_megas = [r for r in form_records if r["added_in"] == "Base game"]
        hyperspace_megas = [r for r in form_records if r["added_in"] == "Mega Dimension"]

        def resolve_pid(nat_id):
            """Resolve national_id to DB pokemon id."""
            if nat_id in BASE_POKEMON:
                return BASE_POKEMON[nat_id][0]
            if nat_id in natid_to_dbid:
                return natid_to_dbid[nat_id]
            return nat_id  # fallback

        # ── Lumiose dex (id 23): 232 base + 68 megas = 300 ──
        f.write("-- Lumiose Pokédex (dex_type_id = 23): 232 base Pokemon + 68 Base game megas\n")
        order = 0
        # Base Pokemon first
        for nat_id in LUMIOSE_BASE_POKEMON_NATIDS:
            pid = resolve_pid(nat_id)
            order += 1
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number) "
                f"VALUES (23, {pid}, {order}, {order}) "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        # Lumiose megas (Base game only) — box = 'reset:1:Mega Evolutions', dex_number restarts from 1
        mega_num = 0
        for rec in sorted(lumiose_megas, key=lambda r: (r["ldex"] or 999, r["id"])):
            order += 1
            mega_num += 1
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box) "
                f"VALUES (23, {rec['id']}, {order}, {mega_num}, 'reset:1:Mega Evolutions') "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        f.write(f"-- Lumiose total: {order} entries ({mega_num} megas)\n\n")

        # ── Hyperspace dex (id 24): 132 base + 25 megas + 2 primals = 159 ──
        f.write("-- Hyperspace Pokédex (dex_type_id = 24): 132 base Pokemon + 25 Mega Dimension megas + 2 Primals\n")
        order = 0
        for nat_id in HYPERSPACE_BASE_POKEMON_NATIDS:
            pid = resolve_pid(nat_id)
            order += 1
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number) "
                f"VALUES (24, {pid}, {order}, {order}) "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        # Hyperspace megas (all Mega Dimension entries) — box = 'reset:1:Mega Evolutions', dex_number restarts from 1
        mega_num = 0
        for rec in sorted(hyperspace_megas, key=lambda r: (r["hdex"] or r["ldex"] or 999, r["id"])):
            order += 1
            mega_num += 1
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box) "
                f"VALUES (24, {rec['id']}, {order}, {mega_num}, 'reset:1:Mega Evolutions') "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        f.write(f"-- Hyperspace total: {order} entries ({mega_num} megas)\n\n")

        # ── Full Pokédex (id 25): everything combined ──
        f.write("-- Full Pokédex (dex_type_id = 25): all Lumiose + Hyperspace Pokemon and megas\n")
        all_natids = list(dict.fromkeys(LUMIOSE_BASE_POKEMON_NATIDS + HYPERSPACE_BASE_POKEMON_NATIDS))
        order = 0
        for nat_id in all_natids:
            pid = resolve_pid(nat_id)
            order += 1
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number) "
                f"VALUES (25, {pid}, {order}, {order}) "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        # All megas + primals — box = 'reset:1:Mega Evolutions', dex_number restarts from 1
        mega_num = 0
        for rec in sorted(form_records, key=lambda r: (r["national_id"], r["id"])):
            order += 1
            mega_num += 1
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box) "
                f"VALUES (25, {rec['id']}, {order}, {mega_num}, 'reset:1:Mega Evolutions') "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        f.write(f"-- Full Pokédex total: {order} entries ({mega_num} megas)\n\n")

    # ── File 6: HOME Update ──
    with open(os.path.join(SCRIPTS_DIR, "mega-06-home-update.sql"), "w") as f:
        f.write("-- Add mega/primal forms to HOME Mega Evolution Forms dex type (customization)\n")
        f.write(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n")
        f.write("-- Note: Megas are NOT added to HOME Full National (dex_type 21).\n")
        f.write("-- They only appear when the 'Mega Evolution Forms' customization (dex_type 26) is selected.\n\n")

        # Add to HOME Mega Evolution Forms customization (dex_type 26)
        f.write("-- HOME Mega Evolution Forms (dex_type_id = 26)\n")
        f.write("-- This inherits all Pokemon from Full National (id 21) + adds mega/primal forms\n")
        # First copy all entries from Full National
        f.write("INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box)\n")
        f.write("SELECT 26, pokemon_id, \"order\", dex_number, box\n")
        f.write("FROM dex_types_pokemon\n")
        f.write("WHERE dex_type_id = 21\n")
        f.write("ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n\n")
        # Then add the mega/primal forms
        order_offset = 2000  # High offset to put megas after base Pokemon
        for i, rec in enumerate(sorted(form_records, key=lambda r: (r["national_id"], r["id"]))):
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box) "
                f"VALUES (26, {rec['id']}, {order_offset + i + 1}, {rec['national_id']}, 'Mega Evolutions') "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        f.write("\n")

        # Add to HOME Gigantamax + Mega Evolution Forms (dex_type 27) — combined customization
        f.write("-- HOME Gigantamax + Mega Evolution Forms (dex_type_id = 27)\n")
        f.write("-- Contains: Full National base + Gigantamax forms (from dex_type 17) + Mega/Primal forms\n")
        # Copy everything from dex_type 17 (which already has base + gigantamax)
        f.write("INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box)\n")
        f.write("SELECT 27, pokemon_id, \"order\", dex_number, box\n")
        f.write("FROM dex_types_pokemon\n")
        f.write("WHERE dex_type_id = 17\n")
        f.write("ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n\n")
        # Then add the mega/primal forms on top
        for i, rec in enumerate(sorted(form_records, key=lambda r: (r["national_id"], r["id"]))):
            f.write(
                f"INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, \"order\", dex_number, box) "
                f"VALUES (27, {rec['id']}, {order_offset + i + 1}, {rec['national_id']}, 'Mega Evolutions') "
                f"ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;\n"
            )
        f.write("\n")

    print(f"Generated 6 SQL files in {SCRIPTS_DIR}/")
    print(f"  mega-01-game-family.sql")
    print(f"  mega-02-pokemon.sql     ({len(form_records)} records)")
    print(f"  mega-03-evolutions.sql  ({len(form_records)} records)")
    print(f"  mega-04-dex-types.sql   (4 dex types)")
    print(f"  mega-05-dex-types-pokemon.sql")
    print(f"  mega-06-home-update.sql")


if __name__ == "__main__":
    main()
