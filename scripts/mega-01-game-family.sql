-- Legends Z-A game family and game
-- Generated: 2026-07-20 16:08:38 UTC

INSERT INTO game_families (id, generation, regional_total, national_total, "order", published, regional_support, national_support)
VALUES ('legends_z_a', 9, 0, 0, 24, TRUE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO games (id, name, game_family_id, "order")
VALUES ('legends_z_a', 'Legends: Z-A', 'legends_z_a', 42)
ON CONFLICT (id) DO NOTHING;
