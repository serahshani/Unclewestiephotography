-- AlterTable
ALTER TABLE `GalleryImage`
    ADD COLUMN `tags` JSON NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `photographerCredit` VARCHAR(191) NULL,
    ADD COLUMN `viewCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `fileSizeBytes` INTEGER NULL,
    ADD COLUMN `width` INTEGER NULL,
    ADD COLUMN `height` INTEGER NULL;

-- CreateIndex
CREATE INDEX `GalleryImage_published_sortOrder_idx` ON `GalleryImage`(`published`, `sortOrder`);
