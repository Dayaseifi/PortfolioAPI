/*
  Warnings:

  - A unique constraint covering the columns `[Phonenumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Phonenumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Image_projectID_fkey` ON `image`;

-- DropIndex
DROP INDEX `logo_collaborationID_fkey` ON `logo`;

-- DropIndex
DROP INDEX `logo_concatID_fkey` ON `logo`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `Phonenumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_Phonenumber_key` ON `User`(`Phonenumber`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_collaborationID_fkey` FOREIGN KEY (`collaborationID`) REFERENCES `Collaborations`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_concatID_fkey` FOREIGN KEY (`concatID`) REFERENCES `Concat`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
