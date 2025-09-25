# 新成员开发流程指南

> 面向第一次接触本项目、对 Docker 及协同规范不熟悉的同学。按顺序完成以下步骤，即可独立完成开发、提交与运行流程。

# 全容器开发任务清单（Next.js + VS Code Dev Containers）

## A. 前置准备（一次性）

1. 安装 **Docker Desktop**（或 Linux 上的 Docker Engine + Compose v2），确保能执行 `docker compose version`。
2. 安装 **VS Code** 与扩展：

   * Dev Containers（ms-vscode-remote.remote-containers）
   * Prettier、ESLint、Tailwind CSS（已在 devcontainer.json 中声明，也会在容器内自动装）
3. Windows 用户：开启 **WSL2**，并在 **Linux 文件系统路径**（如 `/home/<user>/projects`）存代码，不要放到 `C:\`（性能与挂载稳定性更好）。
4. 申请/配置私有镜像仓库或内部 npm 源（如有）。

---

## B. 克隆与目录结构

1. 克隆仓库到本机（建议 Linux/WSL2 路径）：

   ```bash
   git clone <repo-url> my-app && cd my-app
   ```
2. 确认关键结构（示例）：

   ```
   repo-root/
     .devcontainer/
       devcontainer.json
     docker/
       compose.dev.yml
       Dockerfile.dev (可选/按项目实际)
     package.json
     ...
   ```

---

## C. 配置 devcontainer（关键校验）

1. 打开 `.devcontainer/devcontainer.json`，确认：

   * `dockerComposeFile` 路径相对 **.devcontainer**：

     ```json
     "dockerComposeFile": "../docker/compose.dev.yml"
     ```
   * `service` 与 compose 中的服务名一致（例如 `web`）。
   * `workspaceFolder` 与容器工作目录一致（例如 `/app`）。
2. 打开 `docker/compose.dev.yml`，确认：

   * `services.web` 存在，且 `working_dir: /app`（或与 `workspaceFolder` 对齐）。
   * `volumes` 将项目根目录挂载到 `/app`，并（建议）为 `node_modules` 单独使用卷：

     ```yaml
     volumes:
       - ..:/app:cached
       - node_modules:/app/node_modules
     ```
   * （可选）`command` 启动命令符合项目（如 `npm install && npm run dev`）。

---

## D. 环境变量与依赖

1. 按项目 README 将 `.env.example` 复制为 `.env.local` 或 `.env` 并填好必需项：

   ```bash
   cp .env.example .env.local
   # 编辑 .env.local
   ```
2. 如需私有 npm 源/Token，放入 `.npmrc`/环境变量（遵循安全规范）。

---

## E. 首次启动（两步走）

1. 先在宿主机验证 Compose 配置无误（可快速定位路径/语法问题）：

   ```bash
   docker compose -f docker/compose.dev.yml config
   ```
2. 在 VS Code 中打开仓库根目录，执行 **“Dev Containers: Reopen in Container”**（在容器中重新打开）。

   * 首次会构建镜像/拉依赖，完成后 VS Code 会自动进入容器工作区。

---

## F. 启动后验证（开发可用性）

1. 终端（容器内）确认 Node、包管理器可用：

   ```bash
   node -v
   npm -v   # 或 pnpm/yarn -v
   ```
2. 跑开发服务（若没在 compose 的 `command` 中自动启动）：

   ```bash
   npm run dev
   ```
3. 打开浏览器访问 `http://localhost:3000`（或 compose 暴露的端口），确认页面能正常打开。
4. 在容器内运行 Lint/格式化（确认扩展生效）：

   ```bash
   npm run lint
   npm run format
   ```

---

## G. 日常协同开发（最少流程）

1. 拉取最新代码：`git pull`
2. 在 VS Code 里 **“Reopen in Container”**（已打开的项目下次会自动进容器）。
3. 在容器内开发、运行、调试、提交：

   ```bash
   npm run dev
   git add .
   git commit -m "feat: ..."
   git push
   ```

---

## H. 常见问题快速排查（10 分钟内搞定）

1. **容器打不开（Exit code 14 / compose 调用失败）**

   * 检查 `dockerComposeFile` **相对路径**是否正确（相对 `.devcontainer`）：`"../docker/compose.dev.yml"`
   * `service` 名称与 compose 是否一致（如 `web`）。
   * 在项目根目录运行：

     ```bash
     docker compose -f docker/compose.dev.yml config
     docker compose -f docker/compose.dev.yml up -d
     docker compose -f docker/compose.dev.yml logs -f web
     ```
2. **端口被占用**：修改 `compose.dev.yml` 中端口映射或释放占用。
3. **依赖/权限问题（node_modules）**：使用容器卷 `node_modules:/app/node_modules`；必要时 `docker compose down -v` 清理卷后重启。
4. **WSL2 性能/挂载异常**：把仓库放到 WSL2 的 Linux 路径（不是 `C:\` 挂载盘）。
5. **查看详细日志**：VS Code 设置 `dev.containers.logLevel: "trace"`，然后 **Show Log**。
6. **Compose v1/v2 混淆**：确保使用 `docker compose`（v2），不是 `docker-compose`（v1）。

---

## I. 退出与清理

1. 停止开发服务：`Ctrl+C` 或关闭 VS Code。
2. 停止容器（可选）：

   ```bash
   docker compose -f docker/compose.dev.yml down
   ```
3. 清理镜像/卷（需要时）：

   ```bash
   docker system prune -af
   docker volume prune -f
   ```

---

## J. 最终自检清单（勾选即过）

* [ ] 已安装 Docker、VS Code、Dev Containers 扩展
* [ ] 仓库位于（Linux/WSL2）合适路径
* [ ] `.devcontainer/devcontainer.json` 的 `dockerComposeFile` 为 `../docker/compose.dev.yml`
* [ ] `service` 与 compose 中 `services.<name>` 一致（例如 `web`）
* [ ] `workspaceFolder` 与容器 `working_dir`、卷挂载路径一致（如 `/app`）
* [ ] `.env.local` 等环境变量文件已就绪
* [ ] `docker compose -f docker/compose.dev.yml config` 正常
* [ ] VS Code 能 **Reopen in Container** 并进入容器
* [ ] `npm run dev` 正常，`http://localhost:3000` 可访问
* [ ] `npm run lint/format` 正常，提交代码无异常

 