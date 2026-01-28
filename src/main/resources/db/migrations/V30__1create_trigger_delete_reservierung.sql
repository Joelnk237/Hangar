CREATE OR REPLACE FUNCTION after_delete_flugzeug_zu_stellplatz()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
v_hangaranbieter_id UUID;
  v_flugzeugbesitzer_id UUID;
  v_stellplatz_kennzeichen TEXT;
  v_standort TEXT;
  v_firmenname TEXT;
  v_email TEXT;
BEGIN
  --Infos Stellplatz + Hangaranbieter
SELECT s.hangaranbieter_id, s.kennzeichen, s.standort
INTO v_hangaranbieter_id, v_stellplatz_kennzeichen, v_standort
FROM stellplatz s
WHERE s.id = OLD.stellplatz_id;

--Flugzeugbesitzer
SELECT f.flugzeugbesitzer_id
INTO v_flugzeugbesitzer_id
FROM flugzeug f
WHERE f.id = OLD.flugzeug_id;

--Firmenname + Email
SELECT h.firmenname, b.email
INTO v_firmenname, v_email
FROM hangaranbieter h
       JOIN benutzer b ON b.id = h.benutzer_id
WHERE h.id = v_hangaranbieter_id;

-- Nachricht erstellen
INSERT INTO nachricht (
  hangaranbieter_id,
  flugzeugbesitzer_id,
  inhalt
)
VALUES (
         v_hangaranbieter_id,
         v_flugzeugbesitzer_id,
         format(
           'Sehr geehrter Kunde, Ihre Reservierung für den Stellplatz "%s" (%s) wurde storniert.
     Bitte kontaktieren Sie den Hangaranbieter "%s" (%s), wenn Sie Fragen haben.
     Ihr HangarByTHM Team, VG',
           v_stellplatz_kennzeichen,
           v_standort,
           v_firmenname,
           v_email
         )
       );

-- Zustand automatisch löschen
DELETE FROM zustand
WHERE flugzeug_id = OLD.flugzeug_id
  AND stellplatz_id = OLD.stellplatz_id;

RETURN OLD;
END;
$$;

CREATE TRIGGER trg_after_delete_flugzeug_zu_stellplatz
  AFTER DELETE ON flugzeug_zu_stellplatz
  FOR EACH ROW
  EXECUTE FUNCTION after_delete_flugzeug_zu_stellplatz();
