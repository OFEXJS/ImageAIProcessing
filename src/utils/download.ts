import JSZip from "jszip";
import { saveAs } from "file-saver";
import { type ImageTask } from "../types/image";

export async function downloadAll(tasks: ImageTask[]) {
  const zip = new JSZip();

  tasks.forEach((task) => {
    if (task.resultBlob) {
      // 获取原始文件名（不含扩展名）
      const originalName = task.file.name.replace(/\.[^/.]+$/, "");

      // 从blob类型中提取扩展名
      const blobType = task.resultBlob.type;
      const extension = blobType.split("/")[1];

      // 使用新的文件名（包含正确的扩展名）
      const newFileName = `${originalName}.${extension}`;

      zip.file(newFileName, task.resultBlob);
    }
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "images.zip");
}
