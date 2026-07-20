-- Test user 'catchthemall' with all dex types
-- Password: catchthemall123
-- Generated for local development and demo purposes

-- 1. Create test user
INSERT INTO users (username, password, date_created, date_modified)
VALUES ('catchthemall', '$2y$10$d/b2b2fs9ZDSdrJAJvfYbuGzq9nS9Jm53HtdtYe2ciuQOm1a2G7oK', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- 2. Create one dex per dex type
DO $$
DECLARE
  v_user_id INTEGER;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE username = 'catchthemall';

  -- XY Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'XY Regional', 'xy-regional', false, 'x', 1, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- XY Full National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'XY National', 'xy-national', false, 'x', 2, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- ORAS Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'ORAS Regional', 'oras-regional', false, 'omega_ruby', 3, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- ORAS Full National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'ORAS National', 'oras-national', false, 'omega_ruby', 4, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Sun/Moon Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Sun Regional', 'sun-regional', false, 'sun', 5, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Sun/Moon Full National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Sun National', 'sun-national', false, 'sun', 6, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- USUM Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Ultra Sun Regional', 'usum-regional', false, 'ultra_sun', 7, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- USUM Full National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Ultra Sun National', 'usum-national', false, 'ultra_sun', 8, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Let's Go Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Lets Go Pikachu', 'lets-go-pikachu', false, 'lets_go_pikachu', 9, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Sword Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Sword Regional', 'sword-regional', false, 'sword', 10, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Sword Full National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Sword National', 'sword-national', false, 'sword', 11, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Sword Expansion Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Sword Expansion', 'sword-expansion', false, 'sword_expansion_pass', 12, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Sword Expansion Full National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Sword Expansion National', 'sword-expansion-national', false, 'sword_expansion_pass', 13, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- BDSP Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Brilliant Diamond Regional', 'bdsp-regional', false, 'brilliant_diamond', 14, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- BDSP Game National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Brilliant Diamond National', 'bdsp-national', false, 'brilliant_diamond', 15, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Legends Arceus Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Legends Arceus', 'legends-arceus', false, 'legends_arceus', 16, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- HOME Gigantamax Forms
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'HOME Gigantamax', 'home-gigantamax', false, 'home', 17, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Scarlet Regional
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Scarlet Regional', 'scarlet-regional', false, 'scarlet', 18, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Scarlet Expansion Full Paldea
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Scarlet Full Paldea', 'scarlet-full-paldea', false, 'scarlet_expansion_pass', 19, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Kitakami
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Kitakami', 'kitakami', false, 'scarlet_expansion_pass', 20, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- HOME Full National
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'HOME National', 'home-national', false, 'home', 21, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Blueberry
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Blueberry', 'blueberry', false, 'scarlet_expansion_pass', 22, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Z-A Lumiose
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Z-A Lumiose', 'za-lumiose', false, 'legends_z_a', 23, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Z-A Hyperspace
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Z-A Hyperspace', 'za-hyperspace', false, 'legends_z_a', 24, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- Z-A Full
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'Z-A Full', 'za-full', false, 'legends_z_a', 25, true, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- HOME Mega Evolution Forms
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'HOME Mega Evolution', 'home-mega', false, 'home', 26, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

  -- HOME Gigantamax + Mega Evolution Forms
  INSERT INTO dexes (user_id, title, slug, shiny, game_id, dex_type_id, regional, date_created, date_modified)
  VALUES (v_user_id, 'HOME All Forms', 'home-all-forms', false, 'home', 27, false, NOW(), NOW())
  ON CONFLICT (user_id, slug) DO NOTHING;

END $$;

-- 3. Add random captures (10-20 per dex)
-- For each dex, pick random Pokemon from that dex type and mark as captured
DO $$
DECLARE
  v_dex RECORD;
  v_pokemon_ids INTEGER[];
  v_count INTEGER;
  v_pid INTEGER;
BEGIN
  FOR v_dex IN
    SELECT d.id as dex_id, d.dex_type_id
    FROM dexes d
    JOIN users u ON d.user_id = u.id
    WHERE u.username = 'catchthemall'
  LOOP
    -- Get random 15 Pokemon from this dex type
    SELECT ARRAY(
      SELECT pokemon_id
      FROM dex_types_pokemon
      WHERE dex_type_id = v_dex.dex_type_id
      ORDER BY random()
      LIMIT 15
    ) INTO v_pokemon_ids;

    -- Insert captures
    FOREACH v_pid IN ARRAY v_pokemon_ids LOOP
      INSERT INTO captures (dex_id, pokemon_id, captured, date_created, date_modified)
      VALUES (v_dex.dex_id, v_pid, true, NOW(), NOW())
      ON CONFLICT (dex_id, pokemon_id) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
