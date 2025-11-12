import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Employees table - stores all employee information
 */
export const employees = mysqlTable("employees", {
  id: varchar("id", { length: 64 }).primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  position: varchar("position", { length: 200 }),
  department: varchar("department", { length: 200 }),
  hireDate: timestamp("hireDate"),
  salary: varchar("salary", { length: 50 }),
  address: text("address"),
  emergencyContact: text("emergencyContact"),
  status: mysqlEnum("status", ["active", "inactive", "terminated"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Accidents table - tracks workplace accidents
 */
export const accidents = mysqlTable("accidents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  employeeId: varchar("employeeId", { length: 64 }).notNull(),
  accidentDate: timestamp("accidentDate").notNull(),
  location: varchar("location", { length: 300 }),
  description: text("description").notNull(),
  severity: mysqlEnum("severity", ["minor", "moderate", "severe", "critical"]).notNull(),
  witnesses: text("witnesses"),
  treatmentProvided: text("treatmentProvided"),
  reportedBy: varchar("reportedBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Accident = typeof accidents.$inferSelect;
export type InsertAccident = typeof accidents.$inferInsert;

/**
 * Documents table - stores employee documents metadata
 */
export const documents = mysqlTable("documents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  employeeId: varchar("employeeId", { length: 64 }).notNull(),
  fileName: varchar("fileName", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileType: varchar("fileType", { length: 100 }),
  category: mysqlEnum("category", ["contract", "certification", "medical", "identification", "other"]).notNull(),
  uploadedBy: varchar("uploadedBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
