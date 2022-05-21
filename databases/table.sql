
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
insert into detailstheme (idtheme, titre, desce, video) values ('THM0001', 'Comment réutiliser les boites de céréales en rangement', 'Ce dont vous avez besoin: <p>-boite de céréales</p> <p>-colle</p> <p>-crayon de bois, gomme, règle</p> <p>-scotch</p> <p>-papier adhésif décoratif</p> Avec de simples boites de céréales, réalisez un petit rangement. Je coupe le haut des boites en diagonale, je les recouvre de papier, en comptant un rentré (dans la boite) pour que cela soit plus joli et le tour est joué!!! Pour coller, le vernis-colle est parfait! Evidemment, j`ai opté pour les papiers japonais que je trouve sublimes. La prochaine fois, ce sera une version adulte en noir et blanc avec le tuto, hyper tendance cet hiver!!', 'http://karinethiboult.over-blog.com/2015/09/diy-recup-rangement-avec-des-boites-de-cereales.html');
insert into detailstheme (idtheme, titre, desce, img) values ('THM0001', 'Transformer une boite de céréales en petit cahier de notes', '- Boîte de céréales (1 boîte de céréales permet de fabriquer 2 cahiers. Vous pouvez également utiliser du carton, du papier cartonné ou des boîtes cadeaux)
- Du papier pour les pages intérieures (j`ai utilisé 20 feuilles de papier informatique de format 8,5" x 11", mais vous pouvez aussi utiliser du papier ligné ou du papier millimétré).
- Un morceau de papier décoratif (pour couvrir le dos)
- des ciseaux
- une règle
- Un stylo
- Bâton de colle, ruban adhésif ou ruban double-face
- Aiguille et fil à broder
- Bouton

<p> Marche à suivre : 
- Découpez la boîte de céréales pour créer la couverture de votre cahier. J`ai découpé un morceau de 5,5 x 8 pouces pour le mien, mais vous pouvez le faire aussi petit ou grand que vous le souhaitez.
- Pliez-la en deux de façon à ce que le côté vierge soit orienté vers l`extérieur.
- Passez du fil à broder dans l`aiguille et cousez le bouton sur le devant du carnet. Laissez pendre environ 30 cm de fil. Il servira à entourer le cahier pour le fermer.
- Pour recouvrir les images de la boîte de céréales, appliquez de la colle ou du ruban adhésif à l`intérieur du carnet (assurez-vous d`atteindre les coins !) et placez un morceau de papier par-dessus pour le fixer. Coupez autour des bords pour enlever l`excédent de papier.
- Prenez votre papier pour les pages intérieures et coupez-le de façon à ce qu`il soit légèrement plus petit que le carnet (environ 1/4" plus court sur tous les côtés).
- À l`aide de l`aiguille et du fil à broder, cousez le papier sur le cahier, le long du dos.
- Appliquez de la colle ou du ruban adhésif sur votre papier décoratif et fixez-le au dos du carnet.
- Facultatif : Pour un aspect plus fini, coupez des coins arrondis sur les quatre bords du carnet.</p>
', 'http://4.bp.blogspot.com/-w5Y-TMiELLc/T82X-6S_wYI/AAAAAAAABOg/HTG9wD8BAwU/s640/DIY-Project-Tutorial-Mini-Pocket-Notebook-Journal-Cereal-Box-2.jpg');
insert into detailstheme (idtheme, titre, desce, video) values ('THM0001', 'Réaliser une mangeoire pour oiseaux avec une boîte à oeufs', 'Ce dont nous avons besoin: Ciseaux, 30cm de ficelle, 1 boite à oeufs et des graines', 'https://www.youtube.com/watch?v=w7hlmcudasE&t=14s');
insert into detailstheme (idtheme, titre, desce, img) values ('THM0001', 'Faire un bracelet écolo en recyclant une bouteille d’eau et des chutes de tissus', 'Rien de plus simple, il vous faut :
-une bouteille d’eau vide
-des chutes de tissus, plus ou moins larges selon l’effet désiré
-une bonne paire de ciseaux
-du scotch
-de la colle', 'bracelet.png');
insert into detailstheme (idtheme, titre, desce, video) values ('THM0001', 'Réaliser des vases avec des bouteilles en plastique', 'Nettoyer et sécher la bouteille en plastique puis la couper en deux. ...
Peindre des motifs simples comme des fleurs sur le dessus de la bouteille pour la décorer.
Ajouter des arabesques ou des lignes en suivant les formes de la bouteille.
Laisser sécher le vase bouteille qui est terminé !', 'https://www.youtube.com/watch?v=mYvYl2LhXaY');
insert into detailstheme (idtheme, titre, desce, img) values ('THM0002', 'Les couleurs pour les déchets', 'Vert: pour les verres, Bleu: pour les papiers, Jaune: pour les boîtes de conserve, Orange: pour les plastiques, Gris: pour les matières organiques, Rouge: pour les matières non recyclable comme les batteries, les ampoules ou les piles', 'https://www.pinterest.fr/pin/342484746665792949/');
insert into detailstheme (idtheme, titre, desce) values ('THM0003', 'Economiser l`eau', 'Se brosser les dents avec un gobelet permet d`économiser l`eau');
insert into detailstheme (idtheme, titre, desce) values ('THM0003', 'Eteindre les lumières avant de dormir', '');
insert into detailstheme (idtheme, titre, desce) values ('THM0003', 'Utiliser des sacs biodégradables', '');

CREATE SEQUENCE niveauseq INCREMENT 1 START 1;

create table niveau (
    id varchar (25) primary key,
    ordre int, 
    valeur varchar (250)
);
insert into niveau (ordre, valeur) values (1, 'cocon');
insert into niveau (ordre, valeur) values (2, 'chenille');
insert into niveau (ordre, valeur) values (3, 'papillon');
CREATE SEQUENCE questionseq INCREMENT 1 START 1;
create table question(
    id varchar(25) primary key,
    idtheme varchar(25),
    question varchar(500),
    idniveau varchar (25),
    foreign key (idtheme) references theme(id),
    foreign key (idniveau) references niveau(id)
);
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0001', 'Le plastique est-il biodégradable?');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0001', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0002', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0001', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0002', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0003', '');
insert into question (idtheme, idniveau, question) values ('THM0003', 'NIV0003', '');
CREATE SEQUENCE repquestseq INCREMENT 1 START 1;
create table reponsequestion(
    id varchar(25) primary key,
    idquestion varchar(25),
    libelle varchar(500),
    foreign key (idquestion) references question(id)
);
insert into reponsequestion (idquestion, libelle, pts) values ('QUE0001', 'Oui', 1);
insert into reponsequestion (idquestion, libelle, pts) values ('QUE0001', 'Non', 0);
insert into reponsequestion (idquestion, libelle, pts) values ('QUE0001', 'Je ne sais pas', 0);

CREATE SEQUENCE repjseq INCREMENT 1 START 1;
create table reponsejoueur(
    id varchar(25) primary key,
    idquestion varchar(25),
    idjoueur varchar(25),
    pts int,
    foreign key (idquestion) references question(id),
    foreign key (idjoueur) references joueur(id)
);
insert into reponsejoueur (idquestion, idjoueur, pts) values ('QUE0001', 'JOU001', 1);

alter table reponsequestion add column pts int;
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