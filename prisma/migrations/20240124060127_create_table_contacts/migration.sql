-- CreateTable
CREATE TABLE "addresss" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(255),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(100) NOT NULL,
    "contact_id" INTEGER NOT NULL,

    CONSTRAINT "addresss_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "addresss" ADD CONSTRAINT "addresss_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
