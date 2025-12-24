interface Props {
  onFiles: (files: File[]) => void;
}

export default function UploadArea({ onFiles }: Props) {
  return (
    <div style={{ border: "2px dashed #aaa", padding: 20 }}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            onFiles(Array.from(e.target.files));
          }
        }}
      />
    </div>
  );
}
