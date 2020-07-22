-- Database: ProyectoSBD1

-- DROP DATABASE "ProyectoSBD1";

CREATE DATABASE "ProyectoSBD1"
 
CREATE TABLE perfume(
	nombre text,
	presentacion int
);

INSERT INTO "perfume" values ("bleu de chanel",100);

CREATE TABLE "tablaprueba" (
  "idprueba" integer not null,
  "nombreprueba" character varying not null,
  "descripcionprueba" character varying not null,
 CONSTRAINT prueba_pkey PRIMARY KEY ("idprueba")
);

INSERT INTO "tablaprueba" values (1,'prueba1','esta prueba es la numero 1 para la entrega opcional');
INSERT INTO "tablaprueba" values (2,'prueba2','esta prueba es la numero 2 para la entrega opcional');
INSERT INTO "tablaprueba" values (3,'prueba3','esta prueba es la numero 3 para la entrega opcional');
