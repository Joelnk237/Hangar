ALTER TABLE angebotene_services
  ADD COLUMN preis NUMERIC NOT NULL,
ADD COLUMN einheit VARCHAR(255);

ALTER TABLE service
DROP COLUMN preis,
DROP COLUMN einheit;

INSERT INTO service (bezeichnung)
VALUES
  ('einlagerung'),
  ('flugbereitschaft'),
  ('tanken'),
  ('reinigung');
