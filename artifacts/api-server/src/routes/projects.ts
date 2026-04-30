import { Router } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import {
  ListProjectsQueryParams,
  GetProjectParams,
  CreateProjectBody,
  UpdateProjectParams,
  UpdateProjectBody,
  DeleteProjectParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/projects", async (req, res) => {
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, featured } = parsed.data;

  const conditions = [eq(projectsTable.published, true)];
  if (category) conditions.push(eq(projectsTable.category, category));
  if (featured !== undefined) conditions.push(eq(projectsTable.featured, featured));

  const projects = await db
    .select()
    .from(projectsTable)
    .where(and(...conditions))
    .orderBy(asc(projectsTable.order), desc(projectsTable.createdAt));

  res.json(projects.map(serializeProject));
});

router.get("/projects/stats", async (_req, res) => {
  const allPublished = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.published, true));

  const byCategory: Record<string, number> = {};
  let featured = 0;

  for (const p of allPublished) {
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    if (p.featured) featured++;
  }

  res.json({
    total: allPublished.length,
    byCategory: Object.entries(byCategory).map(([category, count]) => ({ category, count })),
    featured,
  });
});

router.get("/projects/:id", async (req, res) => {
  const parsed = GetProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(and(eq(projectsTable.id, parsed.data.id), eq(projectsTable.published, true)));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(serializeProject(project));
});

router.get("/admin/projects", async (_req, res) => {
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.order), desc(projectsTable.createdAt));

  res.json(projects.map(serializeProject));
});

router.post("/admin/projects", async (req, res) => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db
    .insert(projectsTable)
    .values({
      ...parsed.data,
      tags: parsed.data.tags ?? [],
      updatedAt: new Date(),
    })
    .returning();

  res.status(201).json(serializeProject(project));
});

router.put("/admin/projects/:id", async (req, res) => {
  const paramsParsed = UpdateProjectParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: paramsParsed.error.message });
    return;
  }

  const bodyParsed = UpdateProjectBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const [project] = await db
    .update(projectsTable)
    .set({ ...bodyParsed.data, updatedAt: new Date() })
    .where(eq(projectsTable.id, paramsParsed.data.id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(serializeProject(project));
});

router.delete("/admin/projects/:id", async (req, res) => {
  const parsed = DeleteProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.delete(projectsTable).where(eq(projectsTable.id, parsed.data.id));
  res.status(204).send();
});

function serializeProject(p: typeof projectsTable.$inferSelect) {
  return {
    ...p,
    tags: p.tags ?? [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export default router;
