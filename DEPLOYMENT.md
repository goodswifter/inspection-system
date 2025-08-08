# GitHub Pages 自动部署配置

## 配置步骤

### 1. 启用 GitHub Pages
1. 进入你的 GitHub 仓库
2. 点击 `Settings` 标签页  
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`

### 2. 推送代码触发部署
- 推送代码到 `main` 或 `master` 分支会自动触发部署
- 也可以在 GitHub Actions 页面手动触发

### 3. 访问你的应用
部署完成后，访问：`https://[你的用户名].github.io/inspection-system/`

## 注意事项
- 确保仓库已启用 GitHub Actions
- 首次部署可能需要几分钟时间
- 如果遇到问题，检查 Actions 标签页的构建日志
