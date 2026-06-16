import { prisma } from "../src/lib/prisma";

async function main() {
  const services = await prisma.service.findMany({
    select: { slug: true, name: true }
  });
  console.log(services);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
