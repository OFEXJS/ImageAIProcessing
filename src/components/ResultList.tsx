import { type ImageTask } from "../types/image";
import ResultItem from "./ResultItem";

interface Props {
  list: ImageTask[];
  onSelect?: (id: string, selected: boolean) => void;
  onDownload?: (task: ImageTask) => void;
}

export default function ResultList({ list, onSelect, onDownload }: Props) {
  return (
    <div>
      {list.map((item) => (
        <ResultItem
          key={item.id}
          task={item}
          onSelect={onSelect}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
