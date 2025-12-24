interface Props {
  quality: number;
  onChange: (v: number) => void;
}

export default function CompressOptions({ quality, onChange }: Props) {
  return (
    <div>
      <label>压缩质量：{quality}</label>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        value={quality}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
