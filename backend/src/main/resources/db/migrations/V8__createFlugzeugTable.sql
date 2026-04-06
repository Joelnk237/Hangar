CREATE TABLE flugzeug (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
                          flugzeugbesitzer_id UUID NOT NULL REFERENCES flugzeugbesitzer(id) ON DELETE CASCADE,
                          flugzeugtyp flugzeugtyp_enum,
                          flugzeuggroesse flugzeuggroesse_enum ,
                          kennzeichen VARCHAR(255) NOT NULL UNIQUE,
                          bild VARCHAR(255)


);
