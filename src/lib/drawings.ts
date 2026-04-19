"use server"
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import path from "path";

type DrawingImage = {
  src: string;
  caption: string;
};

export type Drawing = {
  slug: string;
  title: string;
  date: string;
  description: string;
  images: DrawingImage[];
};

export async function getAllDrawings(): Promise<Drawing[]> {
  const folder = path.join(process.cwd(), "drawings");
  const files = readdirSync(folder);
  const data = await Promise.all(
    files.map((file) => getDrawingBySlug(file.replace(".mdx", "")))
  );
  data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return data;
}

export async function getDrawingBySlug(slug: string): Promise<Drawing> {
  const folder = path.join(process.cwd(), "drawings");
  const raw = readFileSync(path.join(folder, `${slug}.mdx`), "utf-8");
  const parsed = matter(raw);
  return {
    slug,
    title: parsed.data.title || "",
    date: parsed.data.date || "",
    description: parsed.data.description || "",
    images: parsed.data.images || [],
  };
}