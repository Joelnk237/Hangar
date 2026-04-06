CREATE TABLE stellplatz (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
                             hangaranbieter_id UUID NOT NULL REFERENCES hangaranbieter(id) ON DELETE CASCADE,
                             flugzeugtyp flugzeugtyp_enum,
                             flugzeuggroesse flugzeuggroesse_enum ,
                            standort VARCHAR(255) NOT NULL,

                             availability BOOLEAN NOT NULL DEFAULT true

);
