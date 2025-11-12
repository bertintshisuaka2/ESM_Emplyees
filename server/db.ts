import { eq, desc, and, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, InsertEmployee, accidents, InsertAccident, documents, InsertDocument } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Employee queries
export async function createEmployee(employee: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(employees).values(employee);
  return employee;
}

export async function getEmployee(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(employees).orderBy(desc(employees.createdAt));
}

export async function updateEmployee(id: string, data: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(employees).set(data).where(eq(employees.id, id));
}

export async function deleteEmployee(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(employees).where(eq(employees.id, id));
}

export async function searchEmployees(searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(employees).where(
    or(
      like(employees.firstName, `%${searchTerm}%`),
      like(employees.lastName, `%${searchTerm}%`),
      like(employees.email, `%${searchTerm}%`),
      like(employees.department, `%${searchTerm}%`),
      like(employees.position, `%${searchTerm}%`)
    )
  );
}

// Accident queries
export async function createAccident(accident: InsertAccident) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(accidents).values(accident);
  return accident;
}

export async function getAccident(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(accidents).where(eq(accidents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeeAccidents(employeeId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(accidents)
    .where(eq(accidents.employeeId, employeeId))
    .orderBy(desc(accidents.accidentDate));
}

export async function getAllAccidents() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(accidents).orderBy(desc(accidents.accidentDate));
}

export async function updateAccident(id: string, data: Partial<InsertAccident>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(accidents).set(data).where(eq(accidents.id, id));
}

export async function deleteAccident(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(accidents).where(eq(accidents.id, id));
}

// Document queries
export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(documents).values(document);
  return document;
}

export async function getDocument(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeeDocuments(employeeId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(documents)
    .where(eq(documents.employeeId, employeeId))
    .orderBy(desc(documents.createdAt));
}

export async function getAllDocuments() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(documents).orderBy(desc(documents.createdAt));
}

export async function deleteDocument(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(documents).where(eq(documents.id, id));
}
