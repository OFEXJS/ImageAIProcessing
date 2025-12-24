import { type ImageTask } from "../types/image";

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
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: 10,
        border: "1px solid #eee",
      }}
    >
      <input
        type="checkbox"
        checked={task.selected || false}
        onChange={handleSelect}
        disabled={task.status !== "done"}
      />
      <img src={task.originUrl} width={80} />
      {task.resultUrl && <img src={task.resultUrl} width={80} />}
      <div style={{ flex: 1 }}>
        <div>文件名：{task.file.name}</div>
        <div>状态：{task.status}</div>
        {task.resultSize && (
          <div>
            大小：
            {(task.originSize / 1024).toFixed(1)}kb →
            {(task.resultSize / 1024).toFixed(1)}kb
          </div>
        )}
      </div>
      {task.status === "done" && task.resultBlob && (
        <button onClick={handleDownload} style={{ padding: "5px 10px" }}>
          导出
        </button>
      )}
    </div>
  );
}
