export async function convertByCanvas(
  file: File,
  targetType: string,
  quality: number
): Promise<Blob> {
  // 检查是否支持目标格式
  const supportedTargetTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "image/bmp",
    "image/x-icon",
    "image/icns",
  ];

  if (!supportedTargetTypes.includes(targetType)) {
    console.warn(
      `Target format ${targetType} may not be fully supported. Using PNG as fallback.`
    );
    targetType = "image/png";
  }

  // 对于特殊格式的处理

  // 1. SVG文件的特殊处理
  if (file.type === "image/svg+xml") {
    // 如果目标格式也是SVG，直接返回
    if (targetType === "image/svg+xml") {
      return new Blob([await file.arrayBuffer()], { type: targetType });
    }

    // 否则通过Canvas转换为目标格式
    return svgToOtherFormat(file, targetType, quality);
  }

  // 2. 对于ICO和ICNS源文件的处理
  if (
    file.type === "image/x-icon" ||
    file.type === "image/icns" ||
    file.name.endsWith(".ico") ||
    file.name.endsWith(".icns")
  ) {
    // 如果目标格式是源格式，直接返回
    if (file.type === targetType) {
      return new Blob([await file.arrayBuffer()], { type: targetType });
    }
    // 否则通过Canvas转换
    // 这些格式通常会被浏览器自动识别并正确渲染
  }

  // 对于普通图片格式的转换
  const img = new Image();
  // 设置crossOrigin以避免跨域问题
  img.crossOrigin = "anonymous";
  img.src = URL.createObjectURL(file);

  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;
    // 设置背景色为白色（对于透明图片转换为不支持透明的格式时很重要）
    if (!targetType.includes("png") && !targetType.includes("webp")) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 验证转换后的类型
            if (blob.type === targetType) {
              console.log(`Successfully converted to ${targetType}`);
              resolve(blob);
            } else {
              console.warn(
                `Conversion resulted in ${blob.type} instead of requested ${targetType}`
              );
              // 某些浏览器可能对某些格式支持有限，尝试回退
              if (blob.type !== targetType && targetType !== "image/png") {
                console.log("Falling back to PNG format");
                canvas.toBlob(
                  (fallbackBlob) => {
                    if (fallbackBlob) {
                      resolve(fallbackBlob);
                    } else {
                      reject(
                        new Error("Failed to convert image even with fallback")
                      );
                    }
                  },
                  "image/png",
                  quality
                );
              } else {
                resolve(blob); // 返回可用的blob，即使类型不完全匹配
              }
            }
          } else {
            reject(new Error(`Failed to convert image to ${targetType}`));
          }
        },
        targetType,
        quality
      );
    });
  } catch (error) {
    console.error("Error during image conversion:", error);
    // 如果转换失败，尝试以原始格式返回
    return new Blob([await file.arrayBuffer()], { type: file.type });
  } finally {
    // 清理对象URL
    URL.revokeObjectURL(img.src);
  }
}

// SVG转换为其他格式的辅助函数
async function svgToOtherFormat(
  svgFile: File,
  targetType: string,
  quality: number
): Promise<Blob> {
  const svgText = await svgFile.text();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 根据目标格式确定画布尺寸
      let canvasWidth = 800;
      let canvasHeight = 800;

      // 为不同格式设置不同的默认尺寸
      if (targetType === "image/x-icon" || targetType === "image/icns") {
        // 图标格式使用较小的尺寸
        canvasWidth = canvasHeight = 256;
      } else if (targetType === "image/gif") {
        // GIF格式可以使用中等尺寸
        canvasWidth = canvasHeight = 600;
      }

      // 保持原始SVG的宽高比
      if (img.width && img.height) {
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 1) {
          canvasHeight = canvasWidth / aspectRatio;
        } else {
          canvasWidth = canvasHeight * aspectRatio;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext("2d")!;

      // 对于不支持透明的格式设置白色背景
      const needsWhiteBackground = [
        "image/jpeg",
        "image/bmp",
        "image/x-icon", // ICO可能支持透明，但为了兼容性也设置背景
      ];

      if (needsWhiteBackground.includes(targetType)) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 绘制SVG图像，保持比例
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 对于某些特殊格式（如ICO），可能需要特殊处理
      if (targetType === "image/x-icon") {
        // 尝试使用toBlob转换为ICO
        // 注意：浏览器对ICO格式的支持可能有限
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              console.log(`Successfully converted SVG to ${blob.type}`);
              resolve(blob);
            } else {
              // 如果转换失败，回退到PNG格式
              console.warn("Failed to convert to ICO, falling back to PNG");
              canvas.toBlob(
                (pngBlob) => {
                  if (pngBlob) {
                    resolve(pngBlob);
                  } else {
                    reject(new Error("Failed to convert SVG to any format"));
                  }
                },
                "image/png",
                quality
              );
            }
          },
          targetType,
          quality
        );
      } else {
        // 普通格式转换
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              console.log(`Successfully converted SVG to ${blob.type}`);
              resolve(blob);
            } else {
              reject(new Error("Failed to convert SVG"));
            }
          },
          targetType,
          quality
        );
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG"));
    };

    img.src = url;
  });
}
