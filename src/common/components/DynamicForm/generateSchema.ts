import { z } from 'zod';
import type { DynamicFormFieldConfig, FieldValidation } from './types';

function buildFieldSchema(field: DynamicFormFieldConfig): z.ZodTypeAny {
  const val = field.validation;
  const optional = !val?.required;

  switch (field.type) {
    case 'number': {
      let schema = z.number();
      if (val?.min != null) schema = schema.min(val.min);
      if (val?.max != null) schema = schema.max(val.max);
      return optional ? schema.optional() : schema;
    }
    case 'checkbox':
      return optional ? z.boolean().optional() : z.boolean().refine((v) => v === true);
    case 'file':
      return optional ? z.instanceof(FileList).optional() : z.instanceof(FileList).refine((f) => f?.length > 0);
    case 'date':
      return optional ? z.string().optional() : z.string().min(1);
    case 'stringArray':
      return optional ? z.array(z.string()).optional() : z.array(z.string()).min(1);
    case 'skillArray':
      return z.array(z.object({ name: z.string(), percentage: z.number().min(0).max(100).optional() })).optional();
    case 'projectArray': {
      const projectItem = z.object({
        name: z.string(),
        tech: z.string().optional(),
        url: z.string().optional(),
        highlights: z.string().optional(),
        screenshotUrl: z.string().optional(),
        resultHighlight: z.string().optional(),
        isNotWorking: z.boolean().optional(),
      });
      return optional ? z.array(projectItem).optional() : z.array(projectItem).min(1);
    }
    case 'educationArray':
      return optional
        ? z.array(z.object({ degree: z.string(), institution: z.string().optional(), location: z.string().optional(), period: z.string().optional(), grade: z.string().optional() })).optional()
        : z.array(z.object({ degree: z.string(), institution: z.string().optional(), location: z.string().optional(), period: z.string().optional(), grade: z.string().optional() })).min(1);
    case 'experienceArray': {
      const experienceItem = z.object({
        role: z.string(),
        company: z.string().optional(),
        location: z.string().optional(),
        period: z.string().optional(),
        points: z.string().optional(),
        techStack: z.string().optional(),
        systemsBuilt: z.string().optional(),
        performanceImprovements: z.string().optional(),
        reusableComponents: z.string().optional(),
        impact: z.string().optional(),
        projects: z.array(z.object({
          name: z.string(),
          summary: z.string().optional(),
          contribution: z.string().optional(),
          techStack: z.string().optional(),
          impact: z.string().optional(),
          url: z.string().optional(),
        })).optional(),
      });
      return optional ? z.array(experienceItem).optional() : z.array(experienceItem).min(1);
    }
    case 'freelanceProjectArray':
      return z.array(z.object({
        clientName: z.string().optional(),
        clientType: z.string().optional(),
        problem: z.string().optional(),
        solution: z.string().optional(),
        techStack: z.string().optional(),
        timeline: z.string().optional(),
        keyFeatures: z.string().optional(),
        results: z.string().optional(),
        resultHighlight: z.string().optional(),
        screenshotUrl: z.string().optional(),
        liveLink: z.string().optional(),
        isNda: z.boolean().optional(),
        isNotWorking: z.boolean().optional(),
      })).optional();
    case 'featuredProjectArray':
      return z.array(z.object({
        name: z.string().optional(),
        problem: z.string().optional(),
        solution: z.string().optional(),
        architectureThinking: z.string().optional(),
        keyFeatures: z.string().optional(),
        githubLink: z.string().optional(),
        liveLink: z.string().optional(),
        screenshotUrl: z.string().optional(),
        resultHighlight: z.string().optional(),
        isNotWorking: z.boolean().optional(),
      })).optional();
    case 'serviceItemArray':
      return z.array(z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        problemItSolves: z.string().optional(),
        whoItIsFor: z.string().optional(),
      })).optional();
    case 'faqArray':
      return z.array(z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      })).optional();
    case 'imageUpload':
      return optional ? z.string().optional() : z.string().min(1);
    case 'imageArray':
      return optional ? z.array(z.string()).optional() : z.array(z.string().min(1)).min(1);
    case 'testimonialArray':
      return z.array(z.object({
        clientName: z.string().optional(),
        feedback: z.string().optional(),
        projectType: z.string().optional(),
      })).optional();
    case 'skillCategoryArray':
      return z.array(z.object({
        category: z.string().optional(),
        skills: z.array(z.string()).optional(),
      })).optional();
    case 'mediaArray':
      return z.array(z.object({ title: z.string(), url: z.string().optional(), fileType: z.string().optional() })).optional();
    case 'text':
    case 'email':
    case 'password':
    case 'textarea':
    case 'select':
    case 'radio':
    default: {
      let schema: z.ZodString = z.string();
      if (field.type === 'email') schema = schema.email();
      if (val) schema = applyStringValidation(schema, val);
      return optional ? schema.optional() : schema.min(1);
    }
  }
}

function applyStringValidation(schema: z.ZodString, val: FieldValidation): z.ZodString {
  if (val.minLength != null) schema = schema.min(val.minLength);
  if (val.maxLength != null) schema = schema.max(val.maxLength);
  if (val.pattern) schema = schema.regex(val.pattern);
  return schema;
}

export function generateSchema(fields: DynamicFormFieldConfig[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    if (field.hidden || field.type === 'section') continue;
    shape[field.name] = buildFieldSchema(field);
  }
  return z.object(shape) as z.ZodObject<Record<string, z.ZodTypeAny>>;
}
