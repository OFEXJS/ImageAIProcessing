interface Props {
  onFiles: (files: File[]) => void;
}

export default function UploadArea({ onFiles }: Props) {
  return (
    <div className="upload-area">
      <input
        type="file"
        multiple
        accept="image/*"
        className="upload-input"
        onChange={(e) => {
          if (e.target.files) {
            onFiles(Array.from(e.target.files));
          }
        }}
      />
      <div className="upload-content">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="upload-text">拖拽图片到此处，或点击选择图片</p>
        <p className="upload-hint">支持多种图片格式，可批量上传</p>
      </div>
    </div>
  );
}
