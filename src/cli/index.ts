import { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const program = new Command();

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

program
  .name("pmx-front")
  .description("Manage your Proxmox Frontend via the command line")
  .version(process.env.GIT_COMMIT_SHA || "development");

const user = program.command("user").description("Manage users");

user
  .command("info")
  .description("Show information about an existing user")
  .argument("<email>", "Email address of the user to show info for")
  .action(async (email) => {
    try {
      console.log(`Showing info for user with email: ${email}`);

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        console.log(`User with email ${email} not found`);
        return;
      }

      console.log(`User Info:`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
    } finally {
      await prisma.$disconnect();
    }
  });

user
  .command("promote")
  .description("Promote an existing user")
  .argument("<email>", "Email address of the user to promote")
  .action(async (email) => {
    try {
      console.log(`Promoting user with email: ${email}`);

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        console.log(`User with email ${email} not found`);
        return;
      }

      if (user.role === "admin") {
        console.log(
          `User with email ${email} is already an admin, aborting...`
        );
        return;
      }

      const ok = await confirm({
        message: `Promote user "${user.name}"?`,
        default: true
      });

      if (!ok) {
        console.log("Aborting...");
        return;
      }

      await prisma.user.update({ where: { email }, data: { role: "admin" } });
      console.log(`User with email ${email} promoted successfully`);
    } finally {
      await prisma.$disconnect(); // always runs, even on early returns
    }
  });

user
  .command("delete")
  .description("Delete an existing user")
  .argument("<email>", "Email address of the user to delete")
  .action(async (email) => {
    try {
      console.log(`Deleting user with email: ${email}`);

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        console.log(`User with email ${email} not found`);
        return;
      }

      const ok = await confirm({
        message: `Remove user "${user.name}"?`,
        default: true
      });

      if (!ok) {
        console.log("Aborting...");
        return;
      }

      await prisma.user.delete({ where: { email } });
      console.log(`User with email ${email} deleted successfully`);
    } finally {
      await prisma.$disconnect(); // always runs, even on early returns
    }
  });

program.parse();
