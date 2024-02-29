#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: UserAdmin
#------------------------------------------------------------

CREATE TABLE UserAdmin (
    AdresseMail VARCHAR(255),
    Nom VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
    Prenom VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
    Telephone CHAR(10) NOT NULL,
    MotDePasse VARCHAR(255) NOT NULL,
    ChangeRole BOOLEAN NOT NULL DEFAULT FALSE,
    Role ENUM('Utilisateur', 'Administrateur') NOT NULL,
    CONSTRAINT PK_UserAdmin PRIMARY KEY (AdresseMail)
);


#------------------------------------------------------------
# Table: SuperAdmin
#------------------------------------------------------------

CREATE TABLE SuperAdmin (
    AdresseMail VARCHAR(255),
    Nom VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
    Prenom VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
    Telephone CHAR(10) NOT NULL,
    MotDePasse VARCHAR(255) NOT NULL,
    CONSTRAINT PK_SuperAdmin PRIMARY KEY (AdresseMail)
);