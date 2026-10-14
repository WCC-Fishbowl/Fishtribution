
BEGIN;

INSERT INTO users
    (user_id, username, email, display_name, role)
VALUES
    ('10000000-0000-4000-8000-000000000001',
     'test_angler_1', 'angler1@example.com',
     'Test Angler One', 'angler'),

    ('10000000-0000-4000-8000-000000000002',
     'test_angler_2', 'angler2@example.com',
     'Test Angler Two', 'angler'),

    ('10000000-0000-4000-8000-000000000003',
     'test_moderator', 'moderator@example.com',
     'Test Moderator', 'moderator')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_settings
    (user_id, notifications_enabled,
     preferred_weight_unit, preferred_length_unit,
     profile_visibility)
VALUES
    ('10000000-0000-4000-8000-000000000001',
     TRUE, 'lb', 'in', 'public'),

    ('10000000-0000-4000-8000-000000000002',
     TRUE, 'kg', 'cm', 'private'),

    ('10000000-0000-4000-8000-000000000003',
     FALSE, 'lb', 'in', 'private')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO fish_taxa
    (taxon_id, common_name, scientific_name,
     family, genus)
VALUES
    ('20000000-0000-4000-8000-000000000001',
     'Largemouth Bass', 'Micropterus salmoides',
     'Centrarchidae', 'Micropterus'),

    ('20000000-0000-4000-8000-000000000002',
     'Bluegill', 'Lepomis macrochirus',
     'Centrarchidae', 'Lepomis'),

    ('20000000-0000-4000-8000-000000000003',
     'Yellow Perch', 'Perca flavescens',
     'Percidae', 'Perca'),

    ('20000000-0000-4000-8000-000000000004',
     'Northern Pike', 'Esox lucius',
     'Esocidae', 'Esox'),

    ('20000000-0000-4000-8000-000000000005',
     'Walleye', 'Sander vitreus',
     'Percidae', 'Sander')
ON CONFLICT (taxon_id) DO NOTHING;

INSERT INTO catches
    (catch_id, user_id, taxon_id,
     weight_kg, length_cm,
     bait_or_lure, notes, caught_at)
VALUES
    (
     '30000000-0000-4000-8000-000000000001',
     '10000000-0000-4000-8000-000000000001',
     '20000000-0000-4000-8000-000000000001',
     2.450, 48.50,
     'Plastic Worm',
     'Synthetic largemouth bass catch for testing.',
     '2026-09-15 09:30:00+00'
    ),

    (
     '30000000-0000-4000-8000-000000000002',
     '10000000-0000-4000-8000-000000000001',
     '20000000-0000-4000-8000-000000000002',
     0.420, 21.00,
     'Live Worm',
     'Synthetic bluegill catch for testing.',
     '2026-09-16 14:20:00+00'
    ),

    (
     '30000000-0000-4000-8000-000000000003',
     '10000000-0000-4000-8000-000000000002',
     '20000000-0000-4000-8000-000000000003',
     0.680, 29.00,
     'Small Jig',
     'Synthetic yellow perch catch for testing.',
     '2026-09-17 11:15:00+00'
    ),

    (
     '30000000-0000-4000-8000-000000000004',
     '10000000-0000-4000-8000-000000000002',
     '20000000-0000-4000-8000-000000000004',
     4.200, 82.00,
     'Spinnerbait',
     'Synthetic northern pike catch for testing.',
     '2026-09-18 08:45:00+00'
    ),

    (
     '30000000-0000-4000-8000-000000000005',
     '10000000-0000-4000-8000-000000000001',
     '20000000-0000-4000-8000-000000000005',
     1.850, 51.00,
     'Crankbait',
     'Synthetic walleye catch for testing.',
     '2026-09-19 17:10:00+00'
    )
ON CONFLICT (catch_id) DO NOTHING;

COMMIT;
