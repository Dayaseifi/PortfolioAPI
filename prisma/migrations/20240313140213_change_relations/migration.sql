/*
  Warnings:

  - A unique constraint covering the columns `[collaborationID]` on the table `logo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[concatID]` on the table `logo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Image_projectID_fkey` ON `image`;

-- DropIndex
DROP INDEX `logo_collaborationID_fkey` ON `logo`;

-- DropIndex
DROP INDEX `logo_concatID_fkey` ON `logo`;

-- CreateIndex
CREATE UNIQUE INDEX `logo_collaborationID_key` ON `logo`(`collaborationID`);

-- CreateIndex
CREATE UNIQUE INDEX `logo_concatID_key` ON `logo`(`concatID`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_collaborationID_fkey` FOREIGN KEY (`collaborationID`) REFERENCES `Collaborations`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_concatID_fkey` FOREIGN KEY (`concatID`) REFERENCES `Concat`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
