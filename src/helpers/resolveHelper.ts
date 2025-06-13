export const resolvableFlags: string[] = [
  "EXAM_DOCUMENTATION_REPROVED",
  "EXAM_WAITING_SCHEDULE_WITHDRAWAL",
  "EXAM_SCHEDULE_DISAPROVED",
  "EXAM_PROBLEM_WITH_SAMPLE",
];

export type ResolvableFlag = (typeof resolvableFlags)[number];

export function getCategoryFromFlag(flag: string | null | undefined): string {
  switch (flag) {
    case "EXAM_DOCUMENTATION_REPROVED":
      return "Documentação";
    case "EXAM_WAITING_SCHEDULE_WITHDRAWAL":
    case "EXAM_SCHEDULE_DISAPROVED":
      return "Solicitações de Retirada de Amostra";
    case "EXAM_PROBLEM_WITH_SAMPLE":
      return "Problema com a Amostra";
    default:
      return "";
  }
}