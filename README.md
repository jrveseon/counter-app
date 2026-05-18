# 计数器 📱

一个简洁易用的安卓计数应用，支持多人计数、加减操作和数据本地保存。

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 计数项输入 | 每一行可输入计数项名称（如人名、物品等） |
| 加减计数 | 点击 `+` 数字 +1，点击 `−` 数字 -1（最低 0） |
| 数字编辑 | 直接点击数字，弹出输入框手动输入任意数值 |
| 左滑删除 | 向左滑动行，露出红色删除按钮，松手或点击删除 |
| 新建行 | 底部圆形 `+` 按钮，点击添加新行 |
| 数据持久化 | 所有数据自动保存在手机本地，关闭应用不丢失 |

## 🎨 界面

清爽简洁的界面风格，灵感来自 Microsoft Todo：

```
┌──────────────────────────┐
│  计数器            3 项  │
├──────────────────────────┤
│ [王小明]     12 [−] [+]  │
│ [李小红]      8 [−] [+]  │
│ [张大伟]      3 [−] [+]  │
│                          │
│          [ ＋ ]          │
└──────────────────────────┘
```

## 📲 下载安装

[⬇️ 下载最新 APK](https://github.com/jrveseon/counter-app/releases/latest/download/counter-app-v2.apk)

或在 [Releases 页面](https://github.com/jrveseon/counter-app/releases) 选择版本下载。

> **安装须知**：Android 手机安装时需要允许「安装未知来源应用」。

## 🛠️ 技术栈

- **框架**: [Expo](https://expo.dev) SDK 54 + [React Native](https://reactnative.dev) 0.81
- **语言**: TypeScript
- **手势**: PanResponder（React Native 原生手势系统）
- **存储**: AsyncStorage（本地数据持久化）
- **编译**: EAS Build 云编译 → APK

## 🚀 本地开发

### 前置要求

- Node.js 18+
- npm 或 yarn
- [Expo 账号](https://expo.dev/signup)（用于云编译）

### 开发步骤

```bash
# 克隆项目
git clone https://github.com/jrveseon/counter-app.git
cd counter-app

# 安装依赖
npm install

# 启动开发服务器（可使用 Expo Go 在手机上预览）
npx expo start
```

### 编译 APK

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo
npx eas login

# 编译 APK
npx eas build --platform android --profile preview
```

> 💡 首次编译前需执行 `npx eas init` 初始化 EAS 项目。

## 📁 项目结构

```
counter-app/
├── App.tsx                          # 主入口
├── app.json                         # Expo 配置
├── babel.config.js                  # Babel 配置
├── eas.json                         # EAS Build 配置
├── index.ts                         # 注册入口
├── package.json                     # 依赖管理
├── tsconfig.json                    # TypeScript 配置
└── src/
    ├── components/
    │   ├── CounterRow.tsx           # 行组件（姓名、数字、加减、左滑）
    │   └── AddButton.tsx            # 底部添加按钮
    ├── types/
    │   └── index.ts                 # 类型定义
    └── utils/
        └── storage.ts               # 本地存储工具
```

## 📄 许可证

MIT
