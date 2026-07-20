-- New dex types for Legends Z-A and HOME mega customization
-- Generated: 2026-07-20 16:08:38 UTC

-- Z-A Lumiose Pokédex
INSERT INTO dex_types (id, name, game_family_id, "order", tags, description)
VALUES (23, 'Lumiose', 'legends_z_a', 1, '{"regional"}', 'Lumiose City Pokédex including Mega Evolutions')
ON CONFLICT (id) DO NOTHING;

-- Z-A Hyperspace Pokédex
INSERT INTO dex_types (id, name, game_family_id, "order", tags, description)
VALUES (24, 'Hyperspace', 'legends_z_a', 2, '{"regional"}', 'Hyperspace Pokédex from Mega Dimension DLC')
ON CONFLICT (id) DO NOTHING;

-- Z-A Full Pokédex (Lumiose + Hyperspace combined)
INSERT INTO dex_types (id, name, game_family_id, "order", tags, description)
VALUES (25, 'Full Pokédex', 'legends_z_a', 3, '{"regional"}', 'Complete Legends Z-A Pokédex (Lumiose + Hyperspace)')
ON CONFLICT (id) DO NOTHING;

-- HOME Mega Evolution Forms (customization on Full National)
INSERT INTO dex_types (id, name, game_family_id, "order", tags, description, base_dex_type_id)
VALUES (26, 'Mega Evolution Forms', 'home', -2, '{"full national","customization-mega evolution forms"}', 'Includes all Mega Evolutions and Primal Reversions', 21)
ON CONFLICT (id) DO NOTHING;

-- HOME Gigantamax + Mega Evolution Forms (both customizations selected)
INSERT INTO dex_types (id, name, game_family_id, "order", tags, description, base_dex_type_id)
VALUES (27, 'Gigantamax + Mega Evolution Forms', 'home', -3, '{"full national","customization-gigantamax forms","customization-mega evolution forms"}', 'Includes both Gigantamax and Mega Evolution Forms', 21)
ON CONFLICT (id) DO NOTHING;

SELECT setval('dex_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dex_types));
