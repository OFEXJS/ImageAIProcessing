import { useState } from "react";
import UploadArea from "./components/UploadArea";
import ResultList from "./components/ResultList";
import FormatSelector from "./components/FormatSelector";
import BackgroundAnimation from "./components/BackgroundAnimation";
import { type ImageTask } from "./types/image";
import { convertByCanvas } from "./utils/imageConvert";
import { safeCompress } from "./utils/imageCompress";
import imageCompression from "browser-image-compression"; // 添加导入
import { downloadAll } from "./utils/download";

export default function App() {
  const [tasks, setTasks] = useState<ImageTask[]>([]);
  const [format, setFormat] = useState("image/png"); // 设置默认格式为PNG
  const [quality, setQuality] = useState(0.8);
  const [enableCompress, setEnableCompress] = useState(false); // 默认启用压缩

  function addFiles(files: File[]) {
    setTasks((prev) => [
      ...prev,
      ...files.map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        originUrl: URL.createObjectURL(f),
        originSize: f.size,
        status: "pending" as const, // 显式指定为const类型
        selected: false, // 初始化选中状态为false
      })),
    ]);
  }

  // 单独的压缩函数
  async function compressImage(task: ImageTask) {
    if (!enableCompress) return task.file;

    // 确保使用原始文件进行压缩，而不是之前的处理结果
    const originalFile = task.file;

    // 先尝试一次简单压缩
    let compressed = await safeCompress(originalFile, quality);

    // 如果压缩效果不明显，尝试更强的压缩
    if (compressed.size > originalFile.size * 0.8) {
      // 如果压缩后还大于原文件的80%
      console.log("尝试更强压缩...");
      compressed = await imageCompression(originalFile, {
        maxSizeMB: (originalFile.size / 1024 / 1024) * 0.5, // 直接目标50%大小
        maxWidthOrHeight: 1920,
        initialQuality: Math.max(0.5, quality - 0.3), // 更低质量
        useWebWorker: true,
      });
    }

    return compressed;
  }

  async function startProcess() {
    for (const task of tasks) {
      task.status = "processing";
      setTasks((t) => [...t]);

      let file = task.file; // 使用原始文件，而不是之前的结果

      // 先进行压缩
      if (enableCompress) {
        file = await compressImage(task);
        console.log(
          `压缩前: ${task.file.size} bytes, 压缩后: ${file.size} bytes`
        );
      }

      // 再进行格式转换
      const blob = await convertByCanvas(file, format, quality);

      task.resultBlob = blob;
      task.resultUrl = URL.createObjectURL(blob);
      task.resultSize = blob.size;
      task.status = "done";

      setTasks((t) => [...t]);
    }
  }

  // 处理选择图片
  function handleSelect(id: string, selected: boolean) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, selected } : task))
    );
  }

  // 单个导出图片
  function handleDownload(task: ImageTask) {
    if (!task.resultBlob) return;

    // 获取目标格式的扩展名
    const extension = format.split("/")[1];
    // 创建下载链接
    const url = URL.createObjectURL(task.resultBlob);
    const a = document.createElement("a");

    // 提取原始文件名（不含扩展名）并添加新扩展名
    const originalName = task.file.name.replace(/\.[^/.]+$/, "");
    a.download = `${originalName}.${extension}`;
    a.href = url;

    // 触发下载
    document.body.appendChild(a);
    a.click();

    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 导出功能
  function handleExport() {
    // 获取所有选中的完成任务
    const selectedTasks = tasks.filter(
      (task) => task.selected && task.status === "done" && task.resultBlob
    );

    if (selectedTasks.length === 0) {
      alert("请先选择要导出的图片");
      return;
    }

    downloadAll(selectedTasks);
  }

  // 获取选中的任务数量
  const selectedCount = tasks.filter((task) => task.selected).length;

  // 仅压缩函数
  async function compressOnly() {
    for (const task of tasks) {
      task.status = "processing";
      setTasks((t) => [...t]);

      // 只进行压缩，不进行格式转换
      const compressed = await compressImage(task); // 使用原始文件（task.file）进行压缩

      // 创建结果Blob，保持原始格式
      const blob = new Blob([await compressed.arrayBuffer()], {
        type: compressed.type,
      });

      task.resultBlob = blob;
      task.resultUrl = URL.createObjectURL(blob);
      task.resultSize = blob.size;
      task.status = "done";

      setTasks((t) => [...t]);
    }
  }

  // 仅转换格式函数
  async function convertOnly() {
    for (const task of tasks) {
      task.status = "processing";
      setTasks((t) => [...t]);

      // 只进行格式转换，不进行压缩
      const blob = await convertByCanvas(task.file, format, quality); // 使用原始文件

      task.resultBlob = blob;
      task.resultUrl = URL.createObjectURL(blob);
      task.resultSize = blob.size;
      task.status = "done";

      setTasks((t) => [...t]);
    }
  }

  return (
    <div className="app">
      <BackgroundAnimation />
      <div className="card">
        <UploadArea onFiles={addFiles} />
      </div>

      <div className="card row">
        <FormatSelector value={format} onChange={setFormat} />

        <label>
          <input
            type="checkbox"
            checked={enableCompress}
            onChange={(e) => setEnableCompress(e.target.checked)}
          />
          启用压缩
        </label>

        <input
          type="range"
          min="0.5"
          max="0.95"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          disabled={!enableCompress}
        />

        {/* 分开的功能按钮 */}
        <button onClick={compressOnly} disabled={!enableCompress}>
          仅压缩图片
        </button>
        <button onClick={convertOnly}>仅转换格式</button>
        <button onClick={startProcess} disabled={!enableCompress}>
          压缩并转换
        </button>
        <button
          className="secondary"
          onClick={handleExport}
          disabled={selectedCount === 0}
        >
          导出 ZIP ({selectedCount})
        </button>
      </div>

      <ResultList
        list={tasks}
        onSelect={handleSelect}
        onDownload={handleDownload}
      />
    </div>
  );
}
