import { getLatestRegistrationConsent } from "@/services/annotation";

export type AttachmentModel = {
  fileName?: string;
  contentType?: string;
  documentBody?: string; 
};

/* =========================
 * Cache do DOCUMENTO (termo)
 * ========================= */

let cachedDoc: AttachmentModel | null = null;
let inflight: Promise<AttachmentModel> | null = null;

export function primeConsentDoc(doc: AttachmentModel) {
  cachedDoc = doc;
}

export function getCachedConsentDoc(): AttachmentModel | null {
  return cachedDoc;
}

export async function ensureConsentDoc(): Promise<AttachmentModel> {
  if (cachedDoc) return cachedDoc;
  if (inflight) return inflight;
  inflight = getLatestRegistrationConsent().then((doc) => {
    cachedDoc = doc;
    inflight = null;
    return doc;
  });
  return inflight;
}

/* =========================
 * Cache do ACEITE (status por sessão)
 * ========================= */

let cachedConsentOk: boolean | null = null;
let inflightOk: Promise<boolean> | null = null;
let cachedConsentVersion: string | null = null;

export function primeConsentOk(ok: boolean, version?: string | null) {
  cachedConsentOk = ok;
  if (version !== undefined) cachedConsentVersion = version ?? null;
}

export function isConsentOk(): boolean {
  return cachedConsentOk === true;
}

export function getConsentVersion(): string | null {
  return cachedConsentVersion;
}

export function clearConsentOk() {
  cachedConsentOk = null;
  cachedConsentVersion = null;
  inflightOk = null;
}

export async function ensureConsentOk(
  fetchStatus?: () => Promise<{ value: boolean; version?: string | null }>
): Promise<boolean> {
  if (cachedConsentOk !== null) return cachedConsentOk;
  if (!fetchStatus) {
    throw new Error("fetchStatus é obrigatório na primeira chamada de ensureConsentOk()");
  }
  if (inflightOk) return inflightOk;

  inflightOk = fetchStatus().then((res) => {
    cachedConsentOk = !!res.value;
    cachedConsentVersion = res.version ?? null;
    inflightOk = null;
    return cachedConsentOk!;
  });

  return inflightOk;
}

export function clearAllConsentCaches() {
  cachedDoc = null;
  inflight = null;
  clearConsentOk();
}