import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  {
    id: "classic",
    name: "Classic Traditional",
    description:
      "Traditional format with clean typography. Ideal for conservative industries and academic positions.",
  },
  {
    id: "modern",
    name: "Modern Professional",
    description:
      "Clean, modern design with subtle accent lines. Perfect for tech and creative roles.",
  },
  {
    id: "creative",
    name: "Creative Bold",
    description:
      "Eye-catching design with creative elements. Great for design and marketing roles.",
  },
];

async function main() {
  console.log("Seeding templates...");

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        description: template.description,
      },
      create: {
        id: template.id,
        name: template.name,
        description: template.description,
      },
    });
    console.log(`✓ Template "${template.name}" seeded`);
  }

  console.log("✅ Template seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding templates:", e);
    process.exit(1);
  })
  .finally(() => {
    return prisma.$disconnect();
  });
