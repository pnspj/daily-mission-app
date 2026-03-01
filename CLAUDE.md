# CLAUDE.md

設計方針は **[packages/api/src/types.ts](packages/api/src/types.ts)** および
バックエンドリポジトリ `pnspj/daily-mission-api` の `docs/design-doc.md` を参照。

## スタック

| 役割 | ライブラリ |
|---|---|
| モノレポ | Turborepo + pnpm workspaces |
| Web | Next.js 14 (App Router) |
| Native | Expo (Expo Router) — Web MVP 確認後 |
| スタイリング | Tailwind CSS / NativeWind (Native移行時) |
| サーバー状態 | TanStack Query v5 |
| クライアント状態 | Zustand v5 |
| 認証 | supabase-js v2 + @supabase/ssr |
| APIクライアント | packages/api（カスタム fetch ラッパー） |

## コマンド

```bash
# 開発サーバー起動
pnpm dev               # Web + Native 並行起動
pnpm dev --filter web  # Web のみ

# ビルド
pnpm build

# 型チェック
pnpm type-check

# 依存インストール
pnpm install
```

## ローカル環境変数 (apps/web/.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase status の Publishable key>
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## ディレクトリ構造

```
daily-mission-app/
├── apps/
│   └── web/                    # Next.js App Router
│       ├── app/
│       │   ├── (auth)/         # ログイン・サインアップ（未認証ルート）
│       │   └── (app)/          # 認証済みルート
│       ├── middleware.ts        # Supabase セッション確認 + 未認証リダイレクト
│       └── next.config.js
├── packages/
│   ├── api/                    # Go API クライアント + 型定義
│   │   └── src/
│   │       ├── types.ts        # ドメインモデル型（Go json タグと一致）
│   │       ├── client.ts       # 認証付き fetch ラッパー
│   │       ├── supabase.ts     # Supabase client singleton
│   │       └── hooks/          # TanStack Query hooks
│   ├── app/                    # 共有スクリーン・ビジネスロジック
│   │   └── src/
│   │       ├── features/       # 各機能の画面コンポーネント
│   │       ├── provider/       # AuthProvider
│   │       └── store/          # Zustand stores
│   └── ui/                     # 共有 UI コンポーネント
└── CLAUDE.md
```

## アーキテクチャ原則

- **認証**: supabase-js でセッション管理 → JWT を Go API に転送。DBを直接叩かない
- **データフェッチ**: `packages/api` の hooks のみ使用。コンポーネントで直接 fetch しない
- **型**: `packages/api/src/types.ts` が唯一の型ソース。Go API の json タグと一致させる
- **ナビゲーション**: packages/app の各 Screen コンポーネントは `on*` コールバック Props で
  ナビゲーションを受け取る。next/navigation は apps/web の Page コンポーネント内のみ使う
- **Native 移行時**: packages/app の HTML 要素を React Native primitives に置換し、
  NativeWind の className を維持するだけで移行完了する設計

## パッケージ名

| パス | 名前 |
|---|---|
| packages/api | @daily-mission/api |
| packages/app | @daily-mission/app |
| packages/ui | @daily-mission/ui |

## APIエンドポイント一覧

| メソッド | パス | 認証 |
|---|---|---|
| GET | /health | 不要 |
| GET | /api/v1/themes | 必須 |
| POST | /api/v1/themes | 必須 |
| GET | /api/v1/themes/:themeId/task-sets | 必須 |
| POST | /api/v1/themes/:themeId/task-sets | 必須 |
| GET | /api/v1/task-sets/:taskSetId/tasks | 必須 |
| POST | /api/v1/task-sets/:taskSetId/tasks | 必須 |
| POST | /api/v1/task-set-records | 必須 |
| PATCH | /api/v1/task-records/:id/achieve | 必須 |

## i18n

- タスク名等は `name_i18n[languageCode]` で取得
- フォールバックは `'ja'`
- 例: `task.name_i18n['ja'] ?? task.name_i18n['en'] ?? '(無題)'`

## デプロイ

- Web: Vercel (apps/web を対象)
- 環境変数を Vercel Dashboard に設定
- PWA 対応: next-pwa で設定済み
