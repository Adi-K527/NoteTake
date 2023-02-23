/*
  Warnings:

  - You are about to drop the `_CourseToNote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseid` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CourseToNote" DROP CONSTRAINT "_CourseToNote_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToNote" DROP CONSTRAINT "_CourseToNote_B_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "courseid" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CourseToNote";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
