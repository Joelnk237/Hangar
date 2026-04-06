ALTER TABLE stellplatz
  ADD COLUMN kennzeichen VARCHAR(255),
ADD COLUMN besonderheit TEXT;

ALTER TABLE stellplatz
  ALTER COLUMN kennzeichen SET NOT NULL;
