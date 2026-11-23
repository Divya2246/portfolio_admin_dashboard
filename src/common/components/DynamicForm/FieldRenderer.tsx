import type { DynamicFormFieldConfig } from './types';
import {
  InputField,
  TextAreaField,
  SelectField,
  CheckboxField,
  RadioField,
  FileField,
  SectionField,
  StringArrayField,
  SkillArrayField,
  ProjectArrayField,
  EducationArrayField,
  ExperienceArrayField,
  MediaArrayField,
  FreelanceProjectArrayField,
  FeaturedProjectArrayField,
  TestimonialArrayField,
  SkillCategoryArrayField,
  ImageUploadField,
  ImageArrayField,
  ServiceItemArrayField,
  FaqArrayField,
} from './fields';

interface FieldRendererProps {
  field: DynamicFormFieldConfig;
}

export function FieldRenderer({ field }: FieldRendererProps) {
  switch (field.type) {
    case 'section':
      return <SectionField field={field} />;
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'date':
      return <InputField field={field} />;
    case 'textarea':
      return <TextAreaField field={field} />;
    case 'select':
      return <SelectField field={field} />;
    case 'checkbox':
      return <CheckboxField field={field} />;
    case 'radio':
      return <RadioField field={field} />;
    case 'file':
      return <FileField field={field} />;
    case 'stringArray':
      return <StringArrayField field={field} />;
    case 'skillArray':
      return <SkillArrayField field={field} />;
    case 'projectArray':
      return <ProjectArrayField field={field} />;
    case 'educationArray':
      return <EducationArrayField field={field} />;
    case 'experienceArray':
      return <ExperienceArrayField field={field} />;
    case 'mediaArray':
      return <MediaArrayField field={field} />;
    case 'freelanceProjectArray':
      return <FreelanceProjectArrayField field={field} />;
    case 'featuredProjectArray':
      return <FeaturedProjectArrayField field={field} />;
    case 'testimonialArray':
      return <TestimonialArrayField field={field} />;
    case 'skillCategoryArray':
      return <SkillCategoryArrayField field={field} />;
    case 'imageUpload':
      return <ImageUploadField field={field} />;
    case 'imageArray':
      return <ImageArrayField field={field} />;
    case 'serviceItemArray':
      return <ServiceItemArrayField field={field} />;
    case 'faqArray':
      return <FaqArrayField field={field} />;
    default:
      return <InputField field={field} />;
  }
}
