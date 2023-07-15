export type ICore = "Basics" | "Applied engineering" | "Socio-humanistic"
export type IType = "elective" | "complementary" | "emphasis" | "subject"

export enum EType {
  elective = "elective", 
  complementary = "complementary",
  emphasis = "emphasis",
  subject = "subject",
  basics_elective = "basics_elective"
}

export enum TranslateType {
  elective = "Electiva",
  complementary = "Complementaria",
  emphasis = "Énfasis",
  subject = "Asignatura",
  basics_elective = "Electiva Ciencias Básicas"
}