# 新成员开发流程指南

> 面向第一次接触本项目、对 Docker 及协同规范不熟悉的同学。按顺序完成以下步骤，即可独立完成开发、提交与运行流程。

## 1. 基础准备

- **账户**：确认已在团队 Git 平台（GitHub/GitLab）拥有访问权限。
- **工具**：
  - [Git](https://git-scm.com/) ≥ 2.40，用于克隆和提交代码。
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) 或 Docker Engine ≥ 24，用于运行开发容器。
  - （可选）Node.js ≥ 20 与 pnpm：若希望在宿主机直接运行脚本或安装 Git hooks。
- **编辑器**：推荐 VS Code，并安装官方的 Docker、ESLint、Tailwind CSS、Vitest 等插件，提升开发体验。

## 2. 克隆仓库

```bash
# 任选本地工作目录
cd ~/workspace

# 克隆项目（示例使用 SSH）
git clone git@github.com:your-org/next-docker-use.git
cd next-docker-use
```

## 3. 初始化环境变量

1. 复制示例文件，生成你的本地配置：
   ```bash
   cp .env.example .env.local
   ```
2. 根据需要，在 `.env.local` 中填写后端 API 地址、密钥等变量；开发阶段没有特殊要求可以留空。

## 4. 启动 Docker 开发环境

```bash
docker compose -f docker/compose.dev.yml up --build
```

- 首次执行会：
  - 构建基于 `node:20` 的开发镜像。
  - 在容器内运行 `pnpm install`，并将依赖写入命名卷 `node_modules`，避免污染宿主机。
  - 启动 `pnpm dev`，默认监听 `http://localhost:3000`。
- 终端显示 `ready - started server on ...` 后即可在浏览器访问页面。
- 如需同时操作其他命令，可新开终端会话，`docker compose ...` 命令保持运行。

### 常用容器命令

```bash
# 查看服务列表
docker compose -f docker/compose.dev.yml ps

# 进入容器执行命令，如运行测试
docker exec -it nextjs-app-dev sh
# 然后在容器内：pnpm test

# 停止并移除服务
docker compose -f docker/compose.dev.yml down

# 清理依赖缓存卷（仅在依赖异常时使用）
docker compose -f docker/compose.dev.yml down -v
```

## 5. 本地开发建议

- **代码编辑**：在宿主机使用熟悉的 IDE/编辑器，所有修改会实时映射进容器。
- **热更新**：Next.js + Tailwind HMR 默认开启；若在 Docker Desktop 下偏慢，可调节 `docker/compose.dev.yml` 中的 `WATCHPACK_POLL_INTERVAL`。
- **调试日志**：保留 `docker compose` 终端窗口即可观察 Next.js 输出的日志与错误。

## 6. 运行测试与检查

- 宿主机（需安装 Node/pnpm）：
  ```bash
  pnpm lint
  pnpm typecheck
  pnpm test
  ```
- 或在容器内执行同样命令：
  ```bash
  docker exec -it nextjs-app-dev pnpm lint
  docker exec -it nextjs-app-dev pnpm typecheck
  docker exec -it nextjs-app-dev pnpm test
  ```
- 在提交代码前建议至少执行 `pnpm lint` 和 `pnpm test`，确保与 CI 一致。

## 7. Git 协作流程

1. **设置用户名 / 邮箱（首次）**：
   ```bash
   git config user.name "Your Name"
   git config user.email "you@example.com"
   ```
2. **新建功能分支**：
   ```bash
   git checkout -b feature/short-topic
   ```
3. **常规开发循环**：
   - 编辑代码 → 保存 → 浏览器查看效果 → 在容器日志中观察是否报错。
   - 若变更涉及依赖，容器会自动安装；如未触发，可手动执行 `docker exec -it nextjs-app-dev pnpm install`。
4. **查看变更**：
   ```bash
   git status
   git diff
   ```
5. **提交前检查**：确保 `pnpm lint && pnpm test` 全部通过。
6. **提交代码**（遵循 Conventional Commits，例如 `feat:`、`fix:`）：
   ```bash
   git add .
   git commit -m "feat: add onboarding guide"
   ```
   Husky 会自动执行 `lint-staged`、Vitest 等校验；若失败，根据提示修复后重新提交。
7. **推送远程并创建合并请求**：
   ```bash
   git push origin feature/short-topic
   ```
   在代码托管平台发起 Merge Request / Pull Request，指派审核人。

## 8. 生产镜像验证（可选）

- 构建：
  ```bash
  docker build -t nextjs-app:prod .
  ```
- 运行：
  ```bash
  docker compose -f docker/compose.prod.yml up --build -d
  ```
- 停止：
  ```bash
  docker compose -f docker/compose.prod.yml down
  ```

## 9. 常见问题排查

- **端口被占用**：检查本机是否已有其他服务使用 3000 端口，可通过 `lsof -i :3000` 查找并关闭。
- **依赖异常或锁文件冲突**：运行 `docker compose -f docker/compose.dev.yml down -v` 清理依赖卷后重新启动。
- **Git hooks 未执行**：确认仓库根目录存在 `.husky/_`，如缺失可在宿主机运行 `pnpm install` 或 `pnpm prepare` 重新安装。
- **Docker 构建缓慢**：首次构建包含依赖安装阶段属正常；后续会利用缓存。也可在宿主机使用 CDN/镜像加速。

---

如在按照本流程操作时遇到任何问题，欢迎在团队渠道（Slack/企业微信/Issue）反馈，便于及时协助并完善文档。
