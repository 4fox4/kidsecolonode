
-- FONCTION DE HASH
CREATE EXTENSION pgcrypto;
CREATE OR REPLACE FUNCTION sha1(bytea) returns text AS $$
    SELECT encode(digest($1, 'sha1'), 'hex')
$$ LANGUAGE SQL STRICT IMMUTABLE;


CREATE SEQUENCE joueurseq INCREMENT 1 START 1;

create table joueur (
    id varchar (25) primary key,
    nom varchar (120),
    prenoms varchar (150),
    datenaissance date,
    pseudo varchar (250) not null unique, 
    etat int
);
CREATE SEQUENCE themeseq INCREMENT 1 START 1;
create table theme(
    id varchar (25) primary key,
    valeur varchar(150),
    desce text,
    etat int
);

insert into theme(valeur, desce, etat) values ('Recyclage', 'Transformer les déchets de tous les jours en des outils utiles. Par exemple: utiliser les bouteilles comme pots de fleurs, ou comme arrosoir, ...', 1);
insert into theme(valeur, desce, etat) values ('Trier les déchets', 'Trier les déchets', 1);
insert into theme(valeur, desce, etat) values ('Ecogeste', 'Utile pour le quotidien: utiliser le vélo au lieu du véhicule, utiliser un gobelet pour se brosser les dents, utiliser des sacs durables et biodégradables au lieu de plastique', 1);

CREATE SEQUENCE detailsthseq INCREMENT 1 START 1;
create table detailstheme(
    id varchar (25) primary key,
    idtheme varchar (25),
    titre varchar (150),
    desce text,
    img text,
    video text,
    foreign key (idtheme) references theme(id)
);
CREATE SEQUENCE niveauseq INCREMENT 1 START 1;
create table niveau (
    id varchar (25) primary key,
    ordre int, 
    valeur varchar (250)
);
CREATE SEQUENCE questionseq INCREMENT 1 START 1;
create table question(
    id varchar(25) primary key,
    idtheme varchar(25),
    question varchar(500),
    idniveau varchar (25),
    foreign key (idtheme) references theme(id),
    foreign key (idniveau) references niveau(id)
);
CREATE SEQUENCE repquestseq INCREMENT 1 START 1;
create table reponsequestion(
    id varchar(25) primary key,
    idquestion varchar(25),
    libelle varchar(500),
    foreign key (idquestion) references question(id)
);
CREATE SEQUENCE repjseq INCREMENT 1 START 1;
create table reponsejoueur(
    id varchar(25) primary key,
    idquestion varchar(25),
    idjoueur varchar(25),
    pts int,
    foreign key (idquestion) references question(id),
    foreign key (idjoueur) references joueur(id)
);

--lib theme (theme selon question)
create or replace view questiontheme as select q.id, idtheme, question, idniveau, t.valeur, desce, ordre, etat from question q join theme t on q.idtheme = t.id join niveau n on q.idniveau = n.id;
--reponse joueur complet
create or replace view reponsejoueurcplt as select rj.id, rj.idquestion, rj.idjoueur, rj.pts, j.nom, j.prenoms, j.pseudo, j.datenaissance, j.etat as etatj, qt.question, qt.idniveau, qt.ordre, qt.valeur, qt.desce from reponsejoueur rj join joueur j on 
rj.idjoueur = j.id join questiontheme qt on rj.idquestion = qt.id;
--score de joueur par theme
create or replace view scorepartheme as
select valeur, idjoueur, max(pts) as score from reponsejoueurcplt group by valeur, idjoueur;

--trigger
create or replace function joueur_func()
    returns trigger AS $$
        begin
            new.id = concat('JOU', TO_CHAR(nextval('joueurseq'), 'fm0000'));
            return new;
        END
    $$ LANGUAGE plpgsql;

CREATE TRIGGER insert_joueur
    BEFORE INSERT
    ON joueur
    FOR EACH ROW
    EXECUTE PROCEDURE joueur_func();

create or replace function theme_func()
    returns trigger AS $$
        begin
            new.id = concat('THM', TO_CHAR(nextval('themeseq'), 'fm0000'));
            return new;
        END
    $$ LANGUAGE plpgsql;

CREATE TRIGGER insert_theme
    BEFORE INSERT
    ON theme
    FOR EACH ROW
    EXECUTE PROCEDURE theme_func();

create or replace function detailsthm_func()
    returns trigger AS $$
        begin
            new.id = concat('DTH', TO_CHAR(nextval('detailsthseq'), 'fm0000'));
            return new;
        END
    $$ LANGUAGE plpgsql;

CREATE TRIGGER insert_detailtheme
    BEFORE INSERT
    ON detailstheme
    FOR EACH ROW
    EXECUTE PROCEDURE detailsthm_func();
    
create or replace function niveau_func()
    returns trigger AS $$
        begin
            new.id = concat('NIV', TO_CHAR(nextval('niveauseq'), 'fm0000'));
            return new;
        END
    $$ LANGUAGE plpgsql;

CREATE TRIGGER insert_niveau
    BEFORE INSERT
    ON niveau
    FOR EACH ROW
    EXECUTE PROCEDURE niveau_func();
        
create or replace function question_func()
    returns trigger AS $$
        begin
            new.id = concat('QUE', TO_CHAR(nextval('questionseq'), 'fm0000'));
            return new;
        END
    $$ LANGUAGE plpgsql;

CREATE TRIGGER insert_question
    BEFORE INSERT
    ON question
    FOR EACH ROW
    EXECUTE PROCEDURE question_func();

create or replace function resquestion_func()
    returns trigger AS $$
        begin
            new.id = concat('REQ',TO_CHAR(nextval('repquestseq'), 'fm0000'));
            return new;
        END
    $$ LANGUAGE plpgsql;

CREATE TRIGGER insert_repquestion
    BEFORE INSERT
    ON reponsequestion
    FOR EACH ROW
    EXECUTE PROCEDURE resquestion_func();

create or replace function repjoueur_func()
    returns trigger AS $$
        begin
            new.id = concat('REJ', TO_CHAR(nextval('repjseq'), 'fm0000'));
            return new;
        END
    $$ LANGUAGE plpgsql;

CREATE TRIGGER insert_repj
    BEFORE INSERT
    ON reponsejoueur
    FOR EACH ROW
    EXECUTE PROCEDURE repjoueur_func();

alter table joueur alter column etat set default 1;
alter table theme alter column etat set default 1;

alter table joueur add column mdp text;