const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    include: { artisan: true, addresses: true }
  });
  console.log('--- ALL ACCOUNT INFORMATION ---\n');
  users.forEach(u => {
    console.log(`[${u.role}] ${u.firstName} ${u.lastName} <${u.email}>`);
    console.log(`  ID: ${u.id}`);
    console.log(`  Phone: ${u.phone || 'N/A'}`);
    console.log(`  Active: ${u.isActive}`);
    if (u.role === 'ARTISAN' && u.artisan) {
      console.log(`  Shop: ${u.artisan.shopName} (${u.artisan.specialization || 'N/A'})`);
      console.log(`  Location: ${u.artisan.location || 'N/A'}`);
    }
    if (u.addresses && u.addresses.length > 0) {
      console.log(`  Addresses: ${u.addresses.map(a => a.city + ' - ' + a.street).join(', ')}`);
    }
    console.log('');
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
