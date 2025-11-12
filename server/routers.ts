import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  employees: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllEmployees();
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getEmployee(input.id);
      }),
    
    search: protectedProcedure
      .input(z.object({ searchTerm: z.string() }))
      .query(async ({ input }) => {
        return await db.searchEmployees(input.searchTerm);
      }),
    
    create: protectedProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        position: z.string().optional(),
        department: z.string().optional(),
        hireDate: z.date().optional(),
        salary: z.string().optional(),
        address: z.string().optional(),
        emergencyContact: z.string().optional(),
        status: z.enum(["active", "inactive", "terminated"]).default("active"),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        return await db.createEmployee({ ...input, id });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        position: z.string().optional(),
        department: z.string().optional(),
        hireDate: z.date().optional(),
        salary: z.string().optional(),
        address: z.string().optional(),
        emergencyContact: z.string().optional(),
        status: z.enum(["active", "inactive", "terminated"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEmployee(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteEmployee(input.id);
        return { success: true };
      }),
  }),
  
  accidents: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllAccidents();
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getAccident(input.id);
      }),
    
    getByEmployee: protectedProcedure
      .input(z.object({ employeeId: z.string() }))
      .query(async ({ input }) => {
        return await db.getEmployeeAccidents(input.employeeId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        employeeId: z.string(),
        accidentDate: z.date(),
        location: z.string().optional(),
        description: z.string().min(1),
        severity: z.enum(["minor", "moderate", "severe", "critical"]),
        witnesses: z.string().optional(),
        treatmentProvided: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = nanoid();
        return await db.createAccident({ 
          ...input, 
          id,
          reportedBy: ctx.user.id,
        });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        accidentDate: z.date().optional(),
        location: z.string().optional(),
        description: z.string().optional(),
        severity: z.enum(["minor", "moderate", "severe", "critical"]).optional(),
        witnesses: z.string().optional(),
        treatmentProvided: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateAccident(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteAccident(input.id);
        return { success: true };
      }),
  }),
  
  documents: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllDocuments();
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getDocument(input.id);
      }),
    
    getByEmployee: protectedProcedure
      .input(z.object({ employeeId: z.string() }))
      .query(async ({ input }) => {
        return await db.getEmployeeDocuments(input.employeeId);
      }),
    
    upload: protectedProcedure
      .input(z.object({
        employeeId: z.string(),
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        fileType: z.string(),
        category: z.enum(["contract", "certification", "medical", "identification", "other"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Decode base64 and upload to S3
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `documents/${input.employeeId}/${nanoid()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.fileType);
        
        const id = nanoid();
        return await db.createDocument({
          id,
          employeeId: input.employeeId,
          fileName: input.fileName,
          fileUrl: url,
          fileType: input.fileType,
          category: input.category,
          uploadedBy: ctx.user.id,
        });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteDocument(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
