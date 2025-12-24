# 图片处理工具应用

这是一个基于 React + TypeScript + Vite 开发的现代图片处理应用，专注于提供高效的图片压缩和格式转换功能。

## 功能特点

- **图片压缩**：通过先进的压缩算法有效减小图片体积，同时保持良好的视觉质量
- **格式转换**：支持在多种图片格式之间进行转换（如 JPG、PNG、WEBP 等）
- **批量处理**：可同时处理多个图片文件
- **压缩质量调节**：提供压缩质量滑块，允许用户根据需求平衡文件大小和图片质量
- **独立功能按钮**：提供单独的压缩、转换以及组合操作按钮，满足不同使用场景

## 技术栈

- **前端框架**：React 18
- **编程语言**：TypeScript
- **构建工具**：Vite
- **图片处理**：browser-image-compression 库
- **代码规范**：ESLint
- **类型检查**：TypeScript 编译器

## 项目结构

```
ImageAIProcessing/
├── public/           # 静态资源文件
├── src/              # 源代码目录
│   ├── components/   # React 组件
│   │   ├── CompressOptions.tsx  # 压缩选项组件
│   │   ├── FormatSelector.tsx   # 格式选择器组件
│   │   ├── ResultItem.tsx       # 处理结果项组件
│   │   ├── ResultList.tsx       # 处理结果列表组件
│   │   └── UploadArea.tsx       # 文件上传区域组件
│   ├── utils/        # 工具函数
│   │   ├── download.ts        # 下载相关工具
│   │   ├── imageCompress.ts   # 图片压缩功能
│   │   └── imageConvert.ts    # 图片格式转换功能
│   ├── types/        # TypeScript 类型定义
│   ├── App.tsx       # 应用主组件
│   └── main.tsx      # 应用入口文件
├── dist/             # 构建输出目录
└── vite.config.ts    # Vite 配置文件
```

## 快速开始

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境运行

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

然后在浏览器中访问 http://localhost:3000

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build
```

构建产物将输出到 `dist` 目录。

## 使用说明

1. **上传图片**：点击上传区域或拖拽图片到指定区域
2. **选择处理方式**：
   - 仅压缩图片：保留原格式，只进行压缩操作
   - 仅转换格式：选择目标格式进行转换，不进行压缩
   - 压缩并转换：同时进行压缩和格式转换
3. **调整压缩质量**：使用滑块调整压缩质量（1-100）
4. **开始处理**：点击相应按钮开始处理图片
5. **下载结果**：处理完成后，点击下载按钮保存结果

## 开发指南

### ESLint 配置

项目使用 ESLint 进行代码质量检查。如需扩展配置，可以参考现有的 eslint.config.js 文件。

### TypeScript 配置

项目使用 TypeScript 进行类型检查，主要配置文件包括：

- tsconfig.json（基础配置）
- tsconfig.app.json（应用代码配置）
- tsconfig.node.json（Node.js 代码配置）

## 注意事项

- 压缩效果取决于原始图片的格式、大小和内容
- 某些格式转换可能会导致轻微的质量损失
- 大文件处理可能需要较长时间

## 许可证

MIT
