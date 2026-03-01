// Go API の json タグに対応した TypeScript 型定義
// バックエンドの json タグが変わったらここも更新すること

export interface Theme {
  id: string
  user_id: string
  name: string
  description: string | null
  current_point: number
  total_earned_point: number
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface TaskSet {
  id: string
  theme_id: string
  name_i18n: Record<string, string>
  description_i18n: Record<string, string> | null
  type: 'daily' | 'weekly' | 'monthly' | 'adhoc'
  recurrence_pattern: Record<string, unknown> | null
  active_from: string | null
  active_until: string | null
  display_order: number
  created_at: string
}

export interface Task {
  id: string
  task_set_id: string
  name_i18n: Record<string, string>
  description_i18n: Record<string, string> | null
  point: number
  achievement_logic: Record<string, unknown> | null
  created_at: string
}

export interface TaskSetRecord {
  id: string
  task_set_id: string
  target_date: string
  created_at: string
}

export interface TaskRecord {
  id: string
  task_id: string
  task_set_record_id: string
  achieved: boolean
  achieved_at: string | null
  viewed: boolean
}

// POST /api/v1/task-set-records のレスポンス
// task_records は task_set_record 作成時に自動生成される
export interface TaskSetRecordWithTasks {
  task_set_record: TaskSetRecord
  task_records: TaskRecord[]
}

// ---- リクエスト型 ----

export interface CreateThemeRequest {
  name: string
  description?: string
}

export interface CreateTaskSetRequest {
  name_i18n: Record<string, string>
  description_i18n?: Record<string, string>
  type: TaskSet['type']
  recurrence_pattern?: Record<string, unknown>
  active_from?: string
  active_until?: string
  display_order?: number
}

export interface CreateTaskRequest {
  name_i18n: Record<string, string>
  description_i18n?: Record<string, string>
  point: number
  achievement_logic?: Record<string, unknown>
}

export interface CreateTaskSetRecordRequest {
  task_set_id: string
  target_date: string // YYYY-MM-DD
}

// ---- ユーティリティ ----

/** i18n フィールドから表示名を取得。フォールバックは 'ja' → 'en' → 最初のキー */
export function getI18nText(
  i18n: Record<string, string> | null | undefined,
  lang = 'ja',
): string {
  if (!i18n) return ''
  return i18n[lang] ?? i18n['en'] ?? Object.values(i18n)[0] ?? ''
}
