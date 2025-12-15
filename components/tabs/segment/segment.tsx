import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContentsProps } from "../tabContentsProps";
import { cn } from "@/lib/utils";

/**
 *
 * @typedef {object} SegmentProps
 * @property {TabContentsProps[]} contents - 탭 메뉴 및 콘텐츠를 정의하는 객체 배열.
 * @property {string} [defaultValue] - 초기 활성화될 탭의 `value`. 제공되지 않으면 `contents` 배열의 첫 번째 항목이 기본값으로 사용됩니다.
 */

/**
 *
 * Segment는 primary 색상의 배경을 가진 tab menu들에 secondary 색상을 지닌 박스로 selected를 표시해주는 컴포넌트입니다
 * Tab과 로직상 다른 점은 존재하지 않으며 디자인의 차이점만 존재합니다
 *
 * @param {SegmentProps} props - `Segment` 컴포넌트의 프로퍼티.
 * @returns {React.ReactElement} 커스텀 탭 메뉴 컴포넌트.
 *
 * */

export const Segment = ({
  contents,
  defaultValue,
}: {
  contents: TabContentsProps[];
  defaultValue?: string;
}): React.ReactElement => {
  if (defaultValue === undefined) defaultValue = contents[0].value;

  return (
    <Tabs className="flex w-full h-fit p-0" defaultValue={defaultValue}>
      <TabsList className="flex w-full h-fit bg-primary opacity-80 py-[5px]">
        {contents.map((element, idx) => (
          <TabsTrigger
            key={idx}
            value={element.value}
            className={cn(
              "py-1",
              "w-full",
              "data-[state=active]:bg-secondary",
              "text-primary-foreground",
              "transition-none",
              "data-[state=active]:text-secondary-foreground",
              "text-base"
            )}
          >
            {element.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {contents.map((element, idx) => (
        <TabsContent key={idx} value={element.value}>
          {element.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
