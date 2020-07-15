-- Database: ProyectoSBD1

-- DROP DATABASE "ProyectoSBD1";

CREATE DATABASE "ProyectoSBD1"
 
CREATE TABLE perfume(
	nombre text,
	presentacion int
);

INSERT INTO "perfume" values ("bleu de chanel",100);

CREATE TABLE "tablaprueba" (
  "id_prueba" integer not null,
  "nombre_prueba" character varying not null,
  "descripcion_prueba" character varying not null,
 CONSTRAINT prueba_pkey PRIMARY KEY ("id_prueba")
);

INSERT INTO "Tabla_Prueba" values (1,'prueba1','esta prueba es la numero 1 para la entrega opcional');
INSERT INTO "Tabla_Prueba" values (2,'prueba2','esta prueba es la numero 2 para la entrega opcional');
INSERT INTO "Tabla_Prueba" values (3,'prueba3','esta prueba es la numero 3 para la entrega opcional');
