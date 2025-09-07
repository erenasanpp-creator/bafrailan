export type Role = "business" | "admin" | "candidate"

export type AdSlot = {
  href?: string | null
  dataUrl?: string | null
  width?: number | null
  height?: number | null
}

export type AdsConfig = {
  desktopLeft?: AdSlot | null
  desktopRight?: AdSlot | null
  mobileTop?: AdSlot | null
  // mobileBottom intentionally removed per request
}

export type Visit = { path: string; ts: string; ua?: string }

export type User = {
  id: string
  email: string
  password: string
  business_name?: string | null
  owner_name?: string | null
  phone?: string | null
  address?: string | null
  tax_id?: string | null
  role: Role
  approved: boolean
  /** İşletme logosu (data URL) */
  logo_dataUrl?: string | null
  created_at: string
}

export type Job = {
  id: string
  user_id: string
  store_name: string
  position: string
  work_hours: string
  location?: string | null
  salary_min?: number | null
  salary_max?: number | null
  employment_type?: string | null
  experience_level?: string | null
  education_level?: string | null
  benefits?: string | null
  description?: string | null
  requirements: string
  application_email?: string | null
  application_phone?: string | null
  application_link?: string | null
  is_active: boolean
  created_at: string
}

export type Application = {
  id: string
  job_id: string
  job_owner_id: string
  candidate_id: string
  candidate_name: string
  candidate_email: string
  candidate_phone?: string | null
  experience?: string | null
  cv_name?: string | null
  cv_type?: string | null
  cv_data?: string | null
  created_at: string
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) as T : fallback
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function users(): User[] { return read<User[]>("mock_users", []) }
export function jobs(): Job[] { return read<Job[]>("mock_jobs", []) }
export function applications(): Application[] { return read<Application[]>("mock_apps", []) }
export function visits(): Visit[] { return read<Visit[]>("mock_visits", []) }
export function adsConfig(): AdsConfig { return read<AdsConfig>("mock_ads", {}) }

export function saveUsers(v: User[]) { write("mock_users", v) }
export function saveJobs(v: Job[]) { write("mock_jobs", v) }
export function saveApplications(v: Application[]) { write("mock_apps", v) }
export function saveVisits(v: Visit[]) { write("mock_visits", v) }
export function saveAdsConfig(v: AdsConfig) { write("mock_ads", v) }

export function currentUserId(): string | null { return localStorage.getItem("mock_current_user") }
export function setCurrentUserId(id: string | null) {
  if (!id) localStorage.removeItem("mock_current_user")
  else localStorage.setItem("mock_current_user", id)
}
export function currentUser(): User | null {
  const id = currentUserId()
  return users().find(u => u.id === id) ?? null
}

/** Varsayılan yönetici tohum verisi */
export function ensureAdmin() {
  const all = users()
  if (!all.find(u => u.role === "admin")) {
    all.push({
      id: "admin-1",
      email: "admin@bafra.local",
      password: "admin123",
      business_name: "Yönetici",
      owner_name: "Site Admin",
      phone: "-",
      address: "-",
      tax_id: null,
      role: "admin",
      approved: true,
      logo_dataUrl: null,
      created_at: new Date().toISOString()
    })
    saveUsers(all)
  }
}
