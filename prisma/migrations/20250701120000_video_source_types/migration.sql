-- AlterTable
ALTER TABLE `Video`
    ADD COLUMN `sourceType` VARCHAR(191) NOT NULL DEFAULT 'youtube',
    ADD COLUMN `videoPath` VARCHAR(500) NULL,
    MODIFY `youtubeUrl` VARCHAR(191) NULL,
    MODIFY `youtubeId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Video_sourceType_idx` ON `Video`(`sourceType`);
