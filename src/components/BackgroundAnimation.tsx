import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BackgroundAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 设置SVG尺寸
    svg.attr("width", width).attr("height", height);

    // 创建渐变背景
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "backgroundGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("style", "stop-color:#60a5fa;stop-opacity:0.2");
    gradient
      .append("stop")
      .attr("offset", "50%")
      .attr("style", "stop-color:#3b82f6;stop-opacity:0.3");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("style", "stop-color:#2563eb;stop-opacity:0.2");

    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "url(#backgroundGradient)");

    // 创建气泡
    const numBubbles = 20;
    const bubbles = Array.from({ length: numBubbles }, (_, i) => i);

    svg
      .selectAll("circle")
      .data(bubbles)
      .enter()
      .append("circle")
      .attr("r", () => Math.random() * 50 + 20)
      .attr("cx", () => Math.random() * width)
      .attr("cy", () => Math.random() * height)
      .attr("fill", () => {
        const colors = ["#93c5fd", "#38bdf8", "#06b6d4", "#22d3ee"];
        return colors[Math.floor(Math.random() * colors.length)];
      })
      .attr("opacity", () => Math.random() * 0.3 + 0.1);

    // 动画函数
    const animate = () => {
      svg
        .selectAll("circle")
        .transition()
        .duration(() => Math.random() * 8000 + 5000)
        .attr("cy", (_, i, nodes) => {
          const circle = nodes[i] as SVGCircleElement;
          return -parseFloat(circle.getAttribute("r") || "0");
        })
        .attr("cx", () => Math.random() * width)
        .ease(d3.easeLinear)
        .on("end", function () {
          d3.select(this)
            .attr("cy", height + parseFloat(d3.select(this).attr("r") || "0"))
            .attr("cx", Math.random() * width)
            .transition()
            .duration(() => Math.random() * 8000 + 5000)
            .attr("cy", -parseFloat(d3.select(this).attr("r") || "0"))
            .attr("cx", () => Math.random() * width)
            .ease(d3.easeLinear)
            .on("end", animate);
        });
    };

    // 开始动画
    animate();

    // 窗口大小调整处理
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      svg.attr("width", newWidth).attr("height", newHeight);
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
