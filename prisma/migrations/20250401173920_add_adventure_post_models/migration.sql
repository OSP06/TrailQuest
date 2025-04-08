-- CreateTable
CREATE TABLE "AdventurePost" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "badges" TEXT[],
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AdventurePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdventurePostImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdventurePostImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdventurePost" ADD CONSTRAINT "AdventurePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdventurePostImage" ADD CONSTRAINT "AdventurePostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "AdventurePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
