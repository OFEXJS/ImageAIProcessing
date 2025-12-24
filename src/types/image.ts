export interface ImageTask {
  id: string;
  file: File;
  originUrl: string;
  originSize: number;

  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;

  status: "pending" | "processing" | "done" | "error";
  selected?: boolean; // 添加选中状态
}
