-- Add mega/primal forms to HOME Mega Evolution Forms dex type (customization)
-- Generated: 2026-07-20 16:08:38 UTC
-- Note: Megas are NOT added to HOME Full National (dex_type 21).
-- They only appear when the 'Mega Evolution Forms' customization (dex_type 26) is selected.

-- HOME Mega Evolution Forms (dex_type_id = 26)
-- This inherits all Pokemon from Full National (id 21) + adds mega/primal forms
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box)
SELECT 26, pokemon_id, "order", dex_number, box
FROM dex_types_pokemon
WHERE dex_type_id = 21
ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;

INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2036, 2001, 3, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2037, 2002, 6, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2038, 2003, 6, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2039, 2004, 9, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2003, 2005, 15, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2004, 2006, 18, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2069, 2007, 26, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2070, 2008, 26, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2011, 2009, 36, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2012, 2010, 65, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2015, 2011, 71, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2032, 2012, 80, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2013, 2013, 94, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2061, 2014, 115, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2008, 2015, 121, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2046, 2016, 127, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2006, 2017, 130, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2051, 2018, 142, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2035, 2019, 149, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2066, 2020, 150, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2067, 2021, 150, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2000, 2022, 154, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2002, 2023, 160, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2005, 2024, 181, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2052, 2025, 208, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2045, 2026, 212, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2047, 2027, 214, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2058, 2028, 227, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2020, 2029, 229, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2054, 2030, 248, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2078, 2031, 254, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2079, 2032, 257, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2080, 2033, 260, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2018, 2034, 282, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2028, 2035, 302, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2029, 2036, 303, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2053, 2037, 306, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2016, 2038, 308, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2017, 2039, 310, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2033, 2040, 319, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2025, 2041, 323, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2021, 2042, 334, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2024, 2043, 354, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2081, 2044, 358, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2030, 2045, 359, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2072, 2046, 359, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2042, 2047, 362, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2060, 2048, 373, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2063, 2049, 376, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2088, 2050, 380, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2089, 2051, 381, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2093, 2052, 382, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2094, 2053, 383, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2090, 2054, 384, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2084, 2055, 398, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2023, 2056, 428, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2027, 2057, 445, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2071, 2058, 445, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2031, 2059, 448, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2073, 2060, 448, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2044, 2061, 460, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2019, 2062, 475, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2043, 2063, 478, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2086, 2064, 485, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2087, 2065, 491, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2001, 2066, 500, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2026, 2067, 530, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2022, 2068, 531, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2014, 2069, 545, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2049, 2070, 560, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2034, 2071, 604, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2050, 2072, 609, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2083, 2073, 623, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2057, 2074, 652, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2059, 2075, 655, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2055, 2076, 658, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2010, 2077, 668, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2009, 2078, 670, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2068, 2079, 678, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2040, 2080, 687, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2007, 2081, 689, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2041, 2082, 691, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2048, 2083, 701, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2064, 2084, 718, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2065, 2085, 719, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2085, 2086, 740, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2082, 2087, 768, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2062, 2088, 780, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2091, 2089, 801, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2092, 2090, 807, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2056, 2091, 870, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2074, 2092, 952, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2075, 2093, 970, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2076, 2094, 978, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (26, 2077, 2095, 998, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;

-- HOME Gigantamax + Mega Evolution Forms (dex_type_id = 27)
-- Contains: Full National base + Gigantamax forms (from dex_type 17) + Mega/Primal forms
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box)
SELECT 27, pokemon_id, "order", dex_number, box
FROM dex_types_pokemon
WHERE dex_type_id = 17
ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;

INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2036, 2001, 3, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2037, 2002, 6, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2038, 2003, 6, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2039, 2004, 9, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2003, 2005, 15, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2004, 2006, 18, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2069, 2007, 26, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2070, 2008, 26, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2011, 2009, 36, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2012, 2010, 65, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2015, 2011, 71, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2032, 2012, 80, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2013, 2013, 94, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2061, 2014, 115, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2008, 2015, 121, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2046, 2016, 127, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2006, 2017, 130, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2051, 2018, 142, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2035, 2019, 149, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2066, 2020, 150, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2067, 2021, 150, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2000, 2022, 154, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2002, 2023, 160, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2005, 2024, 181, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2052, 2025, 208, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2045, 2026, 212, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2047, 2027, 214, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2058, 2028, 227, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2020, 2029, 229, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2054, 2030, 248, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2078, 2031, 254, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2079, 2032, 257, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2080, 2033, 260, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2018, 2034, 282, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2028, 2035, 302, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2029, 2036, 303, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2053, 2037, 306, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2016, 2038, 308, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2017, 2039, 310, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2033, 2040, 319, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2025, 2041, 323, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2021, 2042, 334, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2024, 2043, 354, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2081, 2044, 358, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2030, 2045, 359, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2072, 2046, 359, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2042, 2047, 362, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2060, 2048, 373, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2063, 2049, 376, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2088, 2050, 380, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2089, 2051, 381, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2093, 2052, 382, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2094, 2053, 383, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2090, 2054, 384, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2084, 2055, 398, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2023, 2056, 428, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2027, 2057, 445, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2071, 2058, 445, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2031, 2059, 448, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2073, 2060, 448, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2044, 2061, 460, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2019, 2062, 475, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2043, 2063, 478, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2086, 2064, 485, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2087, 2065, 491, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2001, 2066, 500, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2026, 2067, 530, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2022, 2068, 531, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2014, 2069, 545, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2049, 2070, 560, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2034, 2071, 604, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2050, 2072, 609, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2083, 2073, 623, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2057, 2074, 652, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2059, 2075, 655, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2055, 2076, 658, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2010, 2077, 668, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2009, 2078, 670, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2068, 2079, 678, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2040, 2080, 687, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2007, 2081, 689, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2041, 2082, 691, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2048, 2083, 701, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2064, 2084, 718, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2065, 2085, 719, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2085, 2086, 740, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2082, 2087, 768, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2062, 2088, 780, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2091, 2089, 801, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2092, 2090, 807, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2056, 2091, 870, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2074, 2092, 952, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2075, 2093, 970, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2076, 2094, 978, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;
INSERT INTO dex_types_pokemon (dex_type_id, pokemon_id, "order", dex_number, box) VALUES (27, 2077, 2095, 998, 'Mega Evolutions') ON CONFLICT (dex_type_id, pokemon_id) DO NOTHING;

