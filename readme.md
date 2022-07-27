# 多包管理
## lerna初始化
lerna init
## lerna配置文件
lerna.config.json
## 创建一个子包
lerna create @pv-arcgis/core arcgis
lerna create @pv-arcgis/services ./packages/arcgis
lerna create @pv-arcgis/utils ./packages/arcgis
lerna create @pv-gis/common ./packages/common

## 本地开发添加子包依赖：
lerna add @pv-argis/core --scope=@pv-argis/utils
lerna add @pv-argis/core @pv-argis/services
# 包开发流程
## 子包 src 目录中进行SDK开发
## 调试，全局安装ts-node，可以在vscode 中进行调试,示例如：
```bash
ts-node index.ts
```
## 本地测试
在example中编写调用示例，进行本地调试测试，以@pvgis/utils为例，执行如下命令可以启动:
```bash
yarn start:utils
```
## 单元测试
每个子包下面都有单元测试目录tests，在tests目录中编写单元测试用例，以@pvgis/utils为例，单元测试执行命令如下：
```bash
yarn test:utils
## 或者
yarn majestic ## 可视化界面执行单元测试
```
## git 提交代码，示例如下：
```bash
git add .
git commit -a -m 'feat: 新功能开发'
```

## 发包
> 注意：只能在master 分支下发包

开发完成，执行发包命令，进行发包，命令如下：
```bash
lerna publish
lerna publish <commit-id> ## 发布指定commit-id的代码
```

# 规范
## prettier eslint
1. prettier eslint 代码风格冲突  eslint-config-prettier  eslint-plugin-prettier
2. typescript lint 使用 @typescript-eslint/eslint-plugin  @typescript-eslint/parser

## 码提交规范
```javascript
feat: {
	description: '新功能',
	title: 'Features',
	emoji: '✨',
},
fix: {
	description: 'bug修复',
	title: 'Bug Fixes',
	emoji: '🐛',
},
docs: {
	description: '文档修改',
	title: 'Documentation',
	emoji: '📚',
},
style: {
	description:
		'代码样式的修改',
	title: 'Styles',
	emoji: '💎',
},
refactor: {
	description:
		'代码重构',
	title: 'Code Refactoring',
	emoji: '📦',
},
perf: {
	description: '代码优化',
	title: 'Performance Improvements',
	emoji: '🚀',
},
test: {
	description: '单元测试',
	title: 'Tests',
	emoji: '🚨',
},
build: {
	description:
		'打包构建',
	title: 'Builds',
	emoji: '🛠',
},
ci: {
	description:
		'ci流程修改',
	title: 'Continuous Integrations',
	emoji: '⚙️',
},
chore: {
	description: "其它文件的修改",
	title: 'Chores',
	emoji: '♻️',
},
revert: {
	description: '还原以前的提交',
	title: 'Reverts',
	emoji: '🗑',
},
```

