import imageCompression from "browser-image-compression";

export async function safeCompress(file: File, quality: number): Promise<File> {
  // 已经很小的不压缩
  if (file.size < 100 * 1024) return file;

  // 根据文件大小动态确定目标大小
  let targetSizeMB: number;
  const originalSizeMB = file.size / 1024 / 1024;

  // 动态计算目标大小，确保压缩后文件变小
  if (originalSizeMB > 10) {
    // 大文件压缩到原来的50%
    targetSizeMB = originalSizeMB * 0.5;
  } else if (originalSizeMB > 5) {
    // 中大型文件压缩到原来的60%
    targetSizeMB = originalSizeMB * 0.6;
  } else if (originalSizeMB > 2) {
    // 中型文件压缩到原来的70%
    targetSizeMB = originalSizeMB * 0.7;
  } else {
    // 小文件压缩到原来的80%
    targetSizeMB = originalSizeMB * 0.8;
  }

  // 设置最大宽度/高度，根据文件大小调整
  const maxWidthOrHeight = originalSizeMB > 5 ? 1920 : 2560;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      initialQuality: quality,
      useWebWorker: true,
      // 增加更多压缩选项
      fileType: file.type,
      // 进度回调可以根据需要启用
      // onProgress: (progress) => {
      //   console.log(`Compression progress: ${progress}`);
      // },
    });

    // 确保压缩后文件确实变小，否则尝试更激进的压缩
    if (compressed.size >= file.size) {
      // 如果第一次压缩没有效果，尝试更激进的压缩
      const aggressiveCompressed = await imageCompression(file, {
        maxSizeMB: targetSizeMB * 0.7, // 目标再小30%
        maxWidthOrHeight: maxWidthOrHeight * 0.8, // 尺寸再小20%
        initialQuality: Math.max(0.3, quality - 0.2), // 质量再降低0.2，但不低于0.3
        useWebWorker: true,
      });

      return aggressiveCompressed.size < file.size
        ? aggressiveCompressed
        : file;
    }

    return compressed;
  } catch (error) {
    console.error("Compression failed:", error);
    return file;
  }
}
