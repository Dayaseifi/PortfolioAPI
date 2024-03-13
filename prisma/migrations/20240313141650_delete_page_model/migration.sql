/*
  Warnings:

  - You are about to drop the `page` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Image_projectID_fkey` ON `image`;

-- DropTable
DROP TABLE `page`;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_collaborationID_fkey` FOREIGN KEY (`collaborationID`) REFERENCES `Collaborations`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_concatID_fkey` FOREIGN KEY (`concatID`) REFERENCES `Concat`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
