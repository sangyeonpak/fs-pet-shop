DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
  id serial,
  age integer,
  kind text,
  name text);

  INSERT INTO pets (age, name, kind) VALUES (5, 'maltese', 'fluffy');