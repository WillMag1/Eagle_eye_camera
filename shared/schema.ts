import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const processedImages = pgTable("processed_images", {
  id: serial("id").primaryKey(),
  originalBlob: text("original_blob").notNull(),
  processedBlob: text("processed_blob").notNull(),
  processingSettings: text("processing_settings").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProcessedImageSchema = createInsertSchema(processedImages).omit({
  id: true,
  createdAt: true,
});

export type InsertProcessedImage = z.infer<typeof insertProcessedImageSchema>;
export type ProcessedImage = typeof processedImages.$inferSelect;

export interface ProcessingSettings {
  unsharpMask: {
    amount: number;
    radius: number;
    threshold: number;
  };
  ycbcr: {
    y: number;
    cb: number;
    cr: number;
  };
  contrast: number;
  brightness: number;
  saturation: number;
  blend: {
    opacity: number;
    mode: string;
    imageCount: number;
  };
}
