-- CreateTable
CREATE TABLE `User` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `Phonenumber` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `refreshToken` LONGTEXT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_Phonenumber_key`(`Phonenumber`),
    UNIQUE INDEX `User_otp_key`(`otp`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expertise` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `percent` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Expertise_name_key`(`name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `technologies` LONGTEXT NOT NULL,

    UNIQUE INDEX `Project_name_key`(`name`),
    UNIQUE INDEX `Project_description_key`(`description`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collaborations` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `startMonth` VARCHAR(191) NOT NULL,
    `startyear` VARCHAR(191) NOT NULL,
    `endMonth` VARCHAR(191) NULL,
    `endYear` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,

    UNIQUE INDEX `Collaborations_name_key`(`name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Concat` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Concat_title_key`(`title`),
    UNIQUE INDEX `Concat_link_key`(`link`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `fileName` VARCHAR(191) NOT NULL,
    `src` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NOT NULL,
    `projectID` INTEGER NOT NULL,

    UNIQUE INDEX `Image_fileName_key`(`fileName`),
    UNIQUE INDEX `Image_src_key`(`src`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logo` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `src` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `collaborationID` INTEGER NULL,
    `concatID` INTEGER NULL,

    UNIQUE INDEX `logo_src_key`(`src`),
    UNIQUE INDEX `logo_fileName_key`(`fileName`),
    UNIQUE INDEX `logo_collaborationID_key`(`collaborationID`),
    UNIQUE INDEX `logo_concatID_key`(`concatID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Setting_name_key`(`name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_collaborationID_fkey` FOREIGN KEY (`collaborationID`) REFERENCES `Collaborations`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_concatID_fkey` FOREIGN KEY (`concatID`) REFERENCES `Concat`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
