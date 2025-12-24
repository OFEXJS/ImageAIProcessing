interface Props {
  value: string;
  onChange: (v: string) => void;
}

// 支持的图像格式列表
export const SUPPORTED_FORMATS = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/svg+xml", label: "SVG" },
  { value: "image/gif", label: "GIF" },
  { value: "image/bmp", label: "BMP" },
  { value: "image/x-icon", label: "ICO" },
  { value: "image/icns", label: "ICNS" },
];

export default function FormatSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: "4px",
        border: "1px solid #ddd",
        fontSize: "14px",
        backgroundColor: "#fff",
      }}
    >
      {SUPPORTED_FORMATS.map((format) => (
        <option key={format.value} value={format.value}>
          {format.label}
        </option>
      ))}
    </select>
  );
}
