import { type ImageTask } from "../types/image";

// 添加提取文件后缀名的辅助函数
const getFileExtension = (fileName: string) => {
  const match = fileName.match(/\.([^.]+)$/);
  return match ? match[1].toUpperCase() : 'FILE';
};

// 添加动态生成错误占位图SVG的函数
const generateErrorSvg = (fileName: string) => {
  const ext = getFileExtension(fileName);
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f0f0f0"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#cccccc" stroke-width="4"/>
      <text x="100" y="115" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#666666">${ext}</text>
    </svg>
  `;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
};

export default function ResultItem({
  task,
  onSelect,
  onDownload,
}: {
  task: ImageTask;
  onSelect?: (id: string, selected: boolean) => void;
  onDownload?: (task: ImageTask) => void;
}) {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(task.id, !task.selected);
    }
  };

  const handleDownload = () => {
    if (onDownload && task.resultBlob) {
      onDownload(task);
    }
  };

  return (
    <div className="result-item fade-in">
      <input
        type="checkbox"
        className="result-checkbox"
        checked={task.selected || false}
        onChange={handleSelect}
        disabled={task.status !== "done"}
      />
      <div className="result-images">
        <img
          src={task.originUrl}
          alt="原始图片"
          className="result-image result-image-origin"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = generateErrorSvg(task.file.name);
            img.onerror = null;
          }}
        />
        {task.resultUrl && (
          <img
            src={task.resultUrl}
            alt="处理后图片"
            className="result-image result-image-processed"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = generateErrorSvg(task.file.name);
              img.onerror = null;
            }}
          />
        )}
      </div>
      <div className="result-info">
        <div className="result-filename">文件名：{task.file.name}</div>
        <div className={`result-status status-${task.status}`}>
          状态：{task.status}
        </div>
        {task.resultSize && (
          <div className="result-size">
            大小：
            <span className="size-original">
              {Math.round((task.originSize / 1024) * 10) / 10}kb
            </span>{" "}
            <span className="size-arrow">→</span>
            <span className="size-processed">
              {Math.round((task.resultSize / 1024) * 10) / 10}kb
            </span>
            <span className="size-savings">
              ({Math.round((1 - task.resultSize / task.originSize) * 100)}%
              节省)
            </span>
          </div>
        )}
      </div>
      {task.status === "done" && task.resultBlob && (
        <button className="result-download-btn" onClick={handleDownload}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          导出
        </button>
      )}
    </div>
  );
}