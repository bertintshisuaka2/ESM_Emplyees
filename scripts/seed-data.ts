import { drizzle } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";
import { employees, accidents, documents } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding database...");

  // Create sample employees
  const employeeIds = [
    nanoid(),
    nanoid(),
    nanoid(),
    nanoid(),
    nanoid(),
  ];

  await db.insert(employees).values([
    {
      id: employeeIds[0],
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@company.com",
      phone: "+1-555-0101",
      position: "Safety Manager",
      department: "Operations",
      hireDate: new Date("2020-01-15"),
      salary: "$75,000",
      address: "123 Main St, New York, NY 10001",
      emergencyContact: "Jane Smith (Wife) - +1-555-0102",
      status: "active",
    },
    {
      id: employeeIds[1],
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@company.com",
      phone: "+1-555-0201",
      position: "Warehouse Supervisor",
      department: "Logistics",
      hireDate: new Date("2019-06-20"),
      salary: "$65,000",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      emergencyContact: "Carlos Garcia (Husband) - +1-555-0202",
      status: "active",
    },
    {
      id: employeeIds[2],
      firstName: "David",
      lastName: "Chen",
      email: "david.chen@company.com",
      phone: "+1-555-0301",
      position: "Forklift Operator",
      department: "Warehouse",
      hireDate: new Date("2021-03-10"),
      salary: "$45,000",
      address: "789 Pine Rd, Chicago, IL 60601",
      emergencyContact: "Linda Chen (Mother) - +1-555-0302",
      status: "active",
    },
    {
      id: employeeIds[3],
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1-555-0401",
      position: "HR Coordinator",
      department: "Human Resources",
      hireDate: new Date("2018-09-01"),
      salary: "$60,000",
      address: "321 Elm St, Houston, TX 77001",
      emergencyContact: "Michael Johnson (Brother) - +1-555-0402",
      status: "active",
    },
    {
      id: employeeIds[4],
      firstName: "Robert",
      lastName: "Williams",
      email: "robert.williams@company.com",
      phone: "+1-555-0501",
      position: "Maintenance Technician",
      department: "Facilities",
      hireDate: new Date("2017-11-15"),
      salary: "$55,000",
      address: "654 Maple Dr, Phoenix, AZ 85001",
      emergencyContact: "Emily Williams (Wife) - +1-555-0502",
      status: "active",
    },
    {
      id: employeeIds[4],
      firstName: "MARCEL ",
      lastName: "MUKADI ",
      email: "robert.williams@company.com",
      phone: "+1-345435654",
      position: "Maintenance Engineer",
      department: "Facilities",
      hireDate: new Date("2017-11-15"),
      salary: "$55,000",
      address: "654 Maple Dr, Phoenix, AZ 85001",
      emergencyContact: "Emily Williams (Wife) - +1-555-0502",
      status: "active",
    },
  ]);

  console.log(`Created ${employeeIds.length} employees`);

  // Create sample accidents
  await db.insert(accidents).values([
    {
      id: nanoid(),
      employeeId: employeeIds[2],
      accidentDate: new Date("2024-10-15T14:30:00"),
      location: "Warehouse Aisle 5",
      description: "Employee slipped on wet floor while moving pallets. Minor injury to left ankle.",
      severity: "minor",
      witnesses: "Maria Garcia, John Smith",
      treatmentProvided: "First aid administered. Ice pack applied. Employee advised to rest.",
      reportedBy: employeeIds[0],
    },
    {
      id: nanoid(),
      employeeId: employeeIds[4],
      accidentDate: new Date("2024-09-22T10:15:00"),
      location: "Maintenance Shop",
      description: "Cut on right hand while handling sharp metal edge during equipment repair.",
      severity: "moderate",
      witnesses: "None",
      treatmentProvided: "Wound cleaned and bandaged. Employee sent to clinic for evaluation.",
      reportedBy: employeeIds[0],
    },
    {
      id: nanoid(),
      employeeId: employeeIds[1],
      accidentDate: new Date("2024-08-05T16:45:00"),
      location: "Loading Dock",
      description: "Strained back while lifting heavy box without proper technique.",
      severity: "moderate",
      witnesses: "David Chen",
      treatmentProvided: "Employee advised to rest. Referred to company physician for assessment.",
      reportedBy: employeeIds[0],
    },
    
  ]);

  console.log("Created 3 accident reports");

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

