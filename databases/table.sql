drop database Sakaiza;

create database sakaiza;
\c sakaiza;

-- FONCTION DE HASH
CREATE EXTENSION pgcrypto;
CREATE OR REPLACE FUNCTION sha1(bytea) returns text AS $$
    SELECT encode(digest($1, 'sha1'), 'hex')
$$ LANGUAGE SQL STRICT IMMUTABLE;


CREATE SEQUENCE mysequence INCREMENT 1 START 1;
SELECT nextval('mysequence');

CREATE SEQUENCE chatsequence INCREMENT 1 START 1;
CREATE SEQUENCE conversationsequence INCREMENT 1 START 1;
CREATE SEQUENCE notificationsequence INCREMENT 1 START 1;
CREATE SEQUENCE demandesequence INCREMENT 1 START 1;
CREATE SEQUENCE likesequence INCREMENT 1 START 1;
CREATE SEQUENCE matchsequence INCREMENT 1 START 1;
CREATE SEQUENCE photosequence INCREMENT 1 START 1;

/** Sequence pour jeton **/
/*CREATE SEQUENCE jetonsequence INCREMENT 1 START 1;*/

create table PROFIL(
   IDPROFIL   	varchar(50) not null,
   DESIGNATION  varchar(50) not null,
   primary key (IDPROFIL)
);


create table UTILISATEUR(
   IDUTILISATEUR  	varchar(50) not null,
   IDPROFIL      		varchar(50),
   --M: ampiana unique
   EMAIL                varchar(50) not null unique,
   PASSWORD             varchar(100) not null,
   NOM                  varchar(50) not null,
   PRENOM               varchar(50) not null,
   --M: selon utilisateur 
   PSEUDO               varchar(50) not null,
   NAISSANCE            date not null,
   VILLE                varchar(50),
   ADRESSE              varchar(50),
   DESCRIPTION          text,
   NATIONALITE          varchar(70),
   --M: atao text fa base64 tsinona no atao eto
   PHOTO                text not null,
   PHOTOMATCHING        text not null,
   SEXE                 varchar(50) not null,
   TELEPHONE            varchar(10),
   --M: atokana table iray
   NBJETONS             int,
   ETAT                 int,
   DATEINSCRIPTION      timestamp,
   primary key (IDUTILISATEUR)
);

create table PREFERENCE(
   IDPREFERENCE         varchar(50) not null,
   IDUTILISATEUR        varchar(50) not null,
   SEXE                 varchar(50) not null,
   AGEDEBUT             int not null,
   AGEFIN               int not null,
   IDINTERET            varchar(50) not null,
   --AV = à voir
   --AV: Antananarivo sy Tananarive ve mitovy??
   VILLE                varchar(50) not null,
   primary key (IDPREFERENCE)
);

create table INTERET(
   IDINTERET            varchar(50) not null,
   DESIGNATION          varchar(70) not null,
   DESCRIPTIONS          text not null,
   primary key (IDINTERET)
);

create table STATUT(
   IDSTATUS             varchar(50) not null,
   IDUTILISATEUR        varchar(50) not null,
   ETAT                 int not null,
   primary key (IDSTATUS)
);

create table LIKES(
   IDLIKE               varchar(50) not null,
   IDLIKEUR             varchar(50) not null,
   IDLIKER              varchar(50) not null,
   primary key (IDLIKE)
);
create table DEMANDE(
   IDDEMANDE            varchar(50) not null,
   IDDEMANDEUR          varchar(50) not null,
   IDDEMANDER           varchar(50) not null,
   --M: default = 0
   ETAT                 int not null,
   primary key (IDDEMANDE)
);

create table MATCH(
   IDAMITIE             varchar(50) not null,
   IDUTILISATEUR1       varchar(50) not null,
   IDUTILISATEUR2       varchar(50) not null,
   DATEMATCH            timestamp DEFAULT CURRENT_TIMESTAMP
);

create table CHAT(
   IDCHAT               varchar(50) not null,
   ENVOYEUR             varchar(50) not null,
   RECEVEUR             varchar(50) not null,
   DATY                 timestamp DEFAULT CURRENT_TIMESTAMP,
   MESSAGES             text not null,
   TYPEMESSAGES         text not null,
   IDCONVERSATION       varchar(50) not null,
   ETAT                 int,
   primary key (IDCHAT)
);

create table CONVERSATIONS(
   IDCONVERSATION       varchar(50) not null,
   ACTEUR1              varchar(50) not null,
   ACTEUR2              varchar(50) not null,
   DATEINITIALISATION   timestamp DEFAULT CURRENT_TIMESTAMP,
   DATEEXPIRATION       timestamp not null,
   --M: default = 1
   ETAT                 int,
   primary key (IDCONVERSATION)
);
 

create table CONFIGURATIONS(
   IDCONFIGURATION      varchar(50) not null,
   DESIGNATION          varchar(30) not null,
   primary key (IDCONFIGURATION)
);

create table NOTIFICATIONS(
   IDNOTIFICATION       varchar(50) not null ,
   IDCONFIGURATION      varchar(50) not null,
   ENVOYEUR             varchar(50) not null,
   RECEVEUR             varchar(50) not null,
   DATY                 timestamp DEFAULT CURRENT_TIMESTAMP,
   ETAT                 int not null,
   primary key (IDNOTIFICATION)
);

create table VILLE(
   IDVILLE              varchar(50) not null,
   DESIGNATION          varchar(30) not null,
   primary key (IDVILLE)
);

alter table UTILISATEUR add constraint FK_REFERENCE_1 foreign key (IDPROFIL)
      references PROFIL (IDPROFIL) on delete restrict on update restrict;

alter table PREFERENCE add constraint FK_REFERENCE_2 foreign key (IDUTILISATEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table LIKES add constraint FK_REFERENCE_3 foreign key (IDLIKEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table LIKES add constraint FK_REFERENCE_4 foreign key (IDLIKER)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table CHAT add constraint FK_REFERENCE_5 foreign key (ENVOYEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table CHAT add constraint FK_REFERENCE_6 foreign key (RECEVEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table CONVERSATIONS add constraint FK_REFERENCE_7 foreign key (ACTEUR1)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table CONVERSATIONS add constraint FK_REFERENCE_8 foreign key (ACTEUR2)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table NOTIFICATIONS add constraint FK_REFERENCE_9 foreign key (ENVOYEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table NOTIFICATIONS add constraint FK_REFERENCE_10 foreign key (RECEVEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table NOTIFICATIONS add constraint FK_REFERENCE_11 foreign key (IDCONFIGURATION)
      references CONFIGURATIONS (IDCONFIGURATION) on delete restrict on update restrict;

alter table PREFERENCE add constraint FK_REFERENCE_12 foreign key (IDINTERET)
      references INTERET (IDINTERET) on delete restrict on update restrict;

alter table STATUT add constraint FK_REFERENCE_13 foreign key (IDUTILISATEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table DEMANDE add constraint FK_REFERENCE_14 foreign key (IDDEMANDEUR)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table DEMANDE add constraint FK_REFERENCE_15 foreign key (IDDEMANDER)
      references UTILISATEUR (IDUTILISATEUR) on delete restrict on update restrict;

alter table CHAT add constraint FK_REFERENCE_13 foreign key (IDCONVERSATION)
      references CONVERSATIONS (IDCONVERSATION) on delete restrict on update restrict;

-- apina eto ---
alter table UTILISATEUR add constraint FK_REFERENCE_14 foreign key (VILLE)
      references VILLE (IDVILLE) on delete restrict on update restrict;

alter table PREFERENCE add constraint FK_REFERENCE_15 foreign key (VILLE)
      references VILLE (IDVILLE) on delete restrict on update restrict;

-- create table TARIF(
--     IDTARIF                 varchar(50) not null,
--     NBJETONS                int not null,
--     DESIGNATION             varchar(50),
--     PRIX                    decimal(15,2) not null,
--     DATETARIFICATION        timestamp DEFAULT CURRENT_TIMESTAMP,
--     ETAT                    int default 1,
--     primary key (IDTARIF)
-- );

create table PAIEMENT(
    IDPAIEMENT              varchar(50) not null,
    -- foreign key(IDUTILISATEUR) ON TABLE(UTILISATEUR), facilité ny select * amty
    IDPAYEUR                varchar(50) not null,
    IDTARIF                 varchar(50) not null,
    DATEPAIEMENT            timestamp DEFAULT CURRENT_TIMESTAMP,
    --denormalisation, afin d'éviter de faire une jointure avec la table TARIF 
    NBJETONS                int not null,
    ETAT                    int default 1,
    primary key(IDPAIEMENT),
    foreign key(IDPAYEUR) references UTILISATEUR(IDUTILISATEUR)
);

create table JETONSUTILISES(
    IDJETON                 varchar(50) not null,
    -- foreign key(IDUTILISATEUR) ON TABLE(UTILISATEUR), facilité ny select * amty
    IDPROPRIO               varchar(50) not null,
    NBUTILISES              int,
    DATEUTILISATION         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    primary key(IDJETON),
    foreign key(IDPROPRIO) references UTILISATEUR(IDUTILISATEUR)
);

create table PHOTO(
	IDPHOTO                       varchar(50) not null,
	IDUSER                        varchar(50) not null,
	DATEUPLOAD                    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	IMAGE                         text not null,
	TYPEPHOTO                     varchar(50) null,
	ETAT                          int default 1,
	FOREIGN KEY(IDUSER) references UTILISATEUR(IDUTILISATEUR)
);

-- role admin
create table ROLEADMIN(
      IDROLE varchar(50) primary key,
      LIBELLE varchar(50),
      DROITACCES int
);

CREATE SEQUENCE administrationsequence INCREMENT 1 START 1;
create table ADMINISTRATION(
      IDADMIN varchar(50) not null primary key,
      NOM varchar(50) not null,
      PRENOM varchar(50) not null,
      PASSWORD  varchar(100) not null,
      EMAIL varchar(50),
      CONTACT varchar(50),
      IDROLE varchar(50),
      ETAT int,
      FOREIGN KEY (IDROLE) references ROLEADMIN(IDROLE)  
);

--resaka evenement
CREATE SEQUENCE evenementsequence INCREMENT 1 START 1;
create table EVENEMENT(
      IDEVENEMENT varchar(50) not null primary key,
      TITRE text,
      DATEEVENEMENT TIMESTAMP,
      DATEFIN TIMESTAMP,
      PHOTO text,
      DESCRIPTIONS text,
      LIEU varchar(50),
      LATITUDE decimal(50, 8),
      LOGITUDE decimal(50, 8),
      VILLE varchar(50) not null,
      ETAT int default 1,
      FOREIGN KEY(VILLE) references VILLE(IDVILLE)
);

CREATE SEQUENCE historiqueeventsequence INCREMENT 1 START 1;
create table HISTORIQUEEVENT(
      IDHISTORIQUEEVENT varchar(50) not null primary key,
      IDADMIN varchar(50),
      DATEMANIP timestamp DEFAULT CURRENT_TIMESTAMP,
      IDEVENEMENT varchar(50) not null,
      LIBELLE varchar(50),
      FOREIGN KEY(IDEVENEMENT) references EVENEMENT(IDEVENEMENT),
      FOREIGN KEY(IDADMIN) references ADMINISTRATION(IDADMIN)
);


CREATE SEQUENCE interessesequence INCREMENT 1 START 1;
create table INTERESSE(
      IDINTERESSE varchar(50) primary key,
      IDUTILISATEUR varchar(50),
      IDEVENEMENT varchar(50),
      FOREIGN KEY(IDUTILISATEUR) references UTILISATEUR(IDUTILISATEUR),
      FOREIGN KEY(IDEVENEMENT) references EVENEMENT(IDEVENEMENT)
);

CREATE SEQUENCE blocagesequence INCREMENT 1 START 1;
create table BLOCAGE(
      IDBLOCAGE varchar(50) primary key,
      IDUTILISATEUR varchar(50),
      IDBLOQUER varchar(50),
      DATEBLOCAGE timestamp default CURRENT_TIMESTAMP,
      ETAT int,
      FOREIGN KEY(IDUTILISATEUR) references UTILISATEUR(IDUTILISATEUR),
      FOREIGN KEY(IDBLOQUER) references UTILISATEUR(IDUTILISATEUR)
);

-- Les codes ci-apres concernent les photos ephemeres avec qq. fonctions reutilisables ( independantes de la fonctionnalite )
-- Expiration des photos en message
CREATE TABLE EXP_PHOTO (
    IDEXP_PHOTO varchar(50) primary key,
    IDCHAT      varchar(50) not null,
    DURATION_SEC int, -- duree en secondes
    foreign key(IDCHAT) references CHAT(IDCHAT)
);
CREATE SEQUENCE exp_photo_sequence INCREMENT 1 START 1;

-- Gestion des tarifs d'acces
CREATE TABLE TARIF_ACCES (
    IDTARIF_ACCES varchar(50) primary key,
    LIBELLE varchar(50) not null,
    DESCRIPTIONS text not null,
    DURATION_HOUR int,
    PRIX int,
    PHOTO varchar(50),
    ETAT int default 1 -- tarif encore fonctionnel (!= 1 sinon)
);
CREATE SEQUENCE tarif_acces_sequence INCREMENT 1 START 1;

CREATE TABLE ACHAT_TARIF_ACCES (
    IDACHAT_TARIF_ACCES varchar(50) primary key,
    IDTARIF_ACCES varchar(50),
    IDUTILISATEUR varchar(50),
    DATE_DEBUT timestamp default CURRENT_TIMESTAMP,
    foreign key(IDTARIF_ACCES) references TARIF_ACCES(IDTARIF_ACCES),
    foreign key(IDUTILISATEUR) references UTILISATEUR(IDUTILISATEUR)
);
CREATE SEQUENCE achat_tarif_sequence INCREMENT 1 START 1;