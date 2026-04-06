
ALTER TABLE zusatzservice
  ADD COLUMN hangaranbieter_id UUID;


ALTER TABLE zusatzservice
  ADD CONSTRAINT fk_zusatzservice_hangaranbieter
    FOREIGN KEY (hangaranbieter_id)
      REFERENCES hangaranbieter(id)
      ON DELETE CASCADE;


ALTER TABLE zusatzservice
  ALTER COLUMN hangaranbieter_id SET NOT NULL;
