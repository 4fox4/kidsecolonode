drop database ecomania;

create database ecomania;
\c ecomania;

-- FONCTION DE HASH
CREATE EXTENSION pgcrypto;
CREATE OR REPLACE FUNCTION sha1(bytea) returns text AS $$
    SELECT encode(digest($1, 'sha1'), 'hex')
$$ LANGUAGE SQL STRICT IMMUTABLE;


CREATE SEQUENCE mysequence INCREMENT 1 START 1;

create table PROFIL(
   IDPROFIL   	varchar(50) not null,
   DESIGNATION  varchar(50) not null,
   primary key (IDPROFIL)
);

CREATE TABLE ACHAT_TARIF_ACCES (
    IDACHAT_TARIF_ACCES varchar(50) primary key,
    IDTARIF_ACCES varchar(50),
    IDUTILISATEUR varchar(50),
    DATE_DEBUT timestamp default CURRENT_TIMESTAMP,
    foreign key(IDTARIF_ACCES) references TARIF_ACCES(IDTARIF_ACCES),
    foreign key(IDUTILISATEUR) references UTILISATEUR(IDUTILISATEUR)
);