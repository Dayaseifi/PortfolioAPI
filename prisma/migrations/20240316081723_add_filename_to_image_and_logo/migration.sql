/*
  Warnings:

  - A unique constraint covering the columns `[fileName]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fileName]` on the table `logo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `logo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Image_projectID_fkey` ON `image`;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `fileName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `logo` ADD COLUMN `fileName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Image_fileName_key` ON `Image`(`fileName`);

-- CreateIndex
CREATE UNIQUE INDEX `logo_fileName_key` ON `logo`(`fileName`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_collaborationID_fkey` FOREIGN KEY (`collaborationID`) REFERENCES `Collaborations`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_concatID_fkey` FOREIGN KEY (`concatID`) REFERENCES `Concat`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
