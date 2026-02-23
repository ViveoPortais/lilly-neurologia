export type ProgramCode = string;

export type ProgramSlug = "neurologia" | "oncologia" | "";

export type AppRole = "doctor" | "professional" | "operation" | "logistics" | "client" | "admin" | "master" | "laboratory" | "";

export type AccessProfile = {
  name: string;
  programCode: ProgramCode;
};

export function normalize(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

export function mapProfileNameToAppRole(profileName: string): AppRole {
  const n = normalize(profileName);
  const base = n.split("|")[0].trim();

  if (base === "master") return "master";
  if (base === "admin") return "admin";
  if (base === "doctor") return "doctor";
  if (base === "professional") return "professional";
  if (base === "laboratory") return "laboratory";
  if (base === "operation") return "operation";
  if (base === "logistics") return "logistics";
  if (base === "client") return "client";

  if (base.includes("diagnostico correto")) return "";

  return "";
}

export function getProgramsForRole(accessProfiles: AccessProfile[], role: AppRole): ProgramCode[] {
  const codes = (accessProfiles || []).filter((p) => mapProfileNameToAppRole(p.name) === role).map((p) => String(p.programCode));

  return Array.from(new Set(codes));
}

export function resolveRoleForProgram(accessProfiles: AccessProfile[], programCode: ProgramCode): AppRole {
  const code = String(programCode);

  const rolesInProgram = (accessProfiles || [])
    .filter((p) => String(p.programCode) === code)
    .map((p) => mapProfileNameToAppRole(p.name))
    .filter((r): r is Exclude<AppRole, ""> => r !== "");

  const priority: Exclude<AppRole, "">[] = ["master", "admin", "doctor", "professional", "laboratory", "operation", "logistics", "client"];

  for (const r of priority) {
    if (rolesInProgram.includes(r)) return r;
  }

  return "";
}

export function getAllowedPrograms(accessProfiles: AccessProfile[]): ProgramCode[] {
  const codes = (accessProfiles || []).map((p) => String(p.programCode));
  return Array.from(new Set(codes));
}

export function resolveActiveProgramCode(params: {
  accessProfiles: AccessProfile[];
  programsCode?: ProgramCode[];
  enforceProfessionalSelect?: boolean;
}): ProgramCode | null {
  const { accessProfiles, programsCode = [], enforceProfessionalSelect = false } = params;

  const allowedPrograms = getAllowedPrograms(accessProfiles);

  if (enforceProfessionalSelect) {
    const professionalPrograms = getProgramsForRole(accessProfiles, "professional");
    if (professionalPrograms.length > 1) return null;
  }

  const preferred = programsCode?.[0] ? String(programsCode[0]) : "";
  if (preferred && allowedPrograms.includes(preferred)) return preferred;

  if (allowedPrograms.length === 1) return allowedPrograms[0];

  return null;
}

export function getProgramSlug(programCode: ProgramCode): ProgramSlug {
  if (String(programCode) === "1001") return "neurologia";
  if (String(programCode) === "995") return "oncologia";
  return "";
}

export function shouldGoToSelectProgram(accessProfiles: AccessProfile[]): boolean {
  return getProgramsForRole(accessProfiles, "professional").length > 1;
}

export function buildDashboardRedirect(params: {
  accessProfiles: AccessProfile[];
  programsCode?: ProgramCode[];
  enforceProfessionalSelect?: boolean;
}): { programCode: ProgramCode; programSlug: ProgramSlug; role: AppRole; url: string } | null {
  const { accessProfiles, programsCode = [], enforceProfessionalSelect = false } = params;

  const activeProgramCode = resolveActiveProgramCode({
    accessProfiles,
    programsCode,
    enforceProfessionalSelect,
  });

  if (!activeProgramCode) return null;

  const role = resolveRoleForProgram(accessProfiles, activeProgramCode);
  if (!role) return null;

  const programSlug = getProgramSlug(activeProgramCode);
  if (!programSlug) return null;

  const url = `/${programSlug}/dashboard/starts`;

  return { programCode: activeProgramCode, programSlug, role, url };
}