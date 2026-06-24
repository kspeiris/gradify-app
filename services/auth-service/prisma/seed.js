const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  await prisma.role.createMany({
    data: [
      { name: "STUDENT" },
      { name: "ADMIN" }
    ],
    skipDuplicates: true
  });

}

main();
