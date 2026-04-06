CREATE TABLE hangaranbieter_flugzeugtypen (
                                            hangaranbieter_id UUID REFERENCES hangaranbieter(id) ON DELETE CASCADE,
                                            flugzeugtyp flugzeugtyp_enum NOT NULL,
                                            PRIMARY KEY (hangaranbieter_id, flugzeugtyp)
);
CREATE TABLE hangaranbieter_flugzeuggroessen (
                                               hangaranbieter_id UUID REFERENCES hangaranbieter(id) ON DELETE CASCADE,
                                               flugzeuggroesse flugzeuggroesse_enum NOT NULL,
                                               PRIMARY KEY (hangaranbieter_id, flugzeuggroesse)
);
