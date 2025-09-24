# Next Docker Use

## 项目简介

- 基于 Next.js 15 + React 19 + Tailwind CSS v4 的全栈模板。
- 使用 pnpm 作为包管理器，并内置 Vitest、ESLint、Prettier、Husky 等工程化工具。
- 本仓库提供开发与生产两套 Docker 方案，帮助团队成员快速对齐环境。

## Git 协作指南

- 默认主干：`main`。推荐使用 `feature/<topic>`、`fix/<issue>` 等前缀建立功能分支。
- 提交信息需符合 Conventional Commits 规范，`pnpm prepare` 会安装 Husky 钩子自动校验。
- 在提交前会自动执行 `lint-staged`：含 ESLint、Prettier 及类型检查，确保代码质量。
- 合并前建议执行完整校验：`pnpm lint && pnpm typecheck && pnpm test`。
- 推送前可运行 `pnpm test` 与 `pnpm build`，避免 CI 失败。

## Docker 开发环境

### 准备工作

- 安装 Docker Engine / Docker Desktop ≥ 24。
- 首次运行前确认宿主机已安装 pnpm（如需本地执行脚本）。
- 可按需复制 `.env.example` 为 `.env.local`，在宿主机填入环境变量供容器读取。

### 启动开发容器

```bash
docker compose -f docker/compose.dev.yml up --build
```

- 容器使用 `node` 用户运行，宿主机源码通过挂载实时生效。
- 若首次启动或依赖版本变动，容器会自动执行 `pnpm install` 写入命名卷 `node_modules`。
- 在宿主机执行 `pnpm`、`git` 等命令均可；也可进入容器调试：

```bash
docker exec -it nextjs-app-dev sh
```

- 默认映射端口 `3000`，访问 http://localhost:3000。

### 常见任务

- 运行单元测试（宿主机）：`pnpm test` 或容器内执行同命令。
- 静态检查：`pnpm lint`、`pnpm typecheck`。
- 关闭容器：`docker compose -f docker/compose.dev.yml down`。

## Docker 生产构建

- 生产镜像使用仓库根目录的 `Dockerfile`，采用多阶段构建输出 Next standalone。
- 本地打包：

```bash
docker build -t nextjs-app:prod .
```

- 运行生产容器（示例）：

```bash
docker compose -f docker/compose.prod.yml up --build -d
```

- 需要的服务端环境变量可在启动时通过 `-e KEY=value` 或 `env_file` 注入，例如 `APP_SECRET`。

## 故障排查

- 若容器内缺失依赖，先执行 `docker compose ... down -v` 清理卷，再重新启动。
- Docked HMR 延迟时，可调节 `docker/compose.dev.yml` 中 `WATCHPACK_POLL_INTERVAL`。
- 提交失败时检查 Husky 日志，确保本地 `pnpm install` 成功并启用 Git hooks。

## 更多脚本

- `pnpm dev`：本地不经 Docker 直接开发。
- `pnpm build && pnpm start`：模拟生产部署。
- `pnpm format` / `pnpm format:check`：统一格式。
