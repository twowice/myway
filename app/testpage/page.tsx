
"use client";

import Tag from "@/components/tag/tag";
import Toast from "@/components/toast/toast";

export default function Home() {
    const handleRemove = () => {
        console.log("Tag removed");
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            {/* <div className="bg-[yellow] p-5 mr-3 ">
                <p className="pb-3">TAG</p>
                <Tag label="#축제" />
                <div className="h-4" />
                <Tag label="#행사" removable onRemove={handleRemove} />
            </div> */}
            
            {/* <div className="bg-[yellow] p-5">
                <p className="pb-3">Toast</p>
                <Toast message="새 경로가 등록되었습니다." />
                <div className="h-4 p-3" />
                <Toast message="새 다이어리가 등록되었습니다." />
                <div className="h-4 p-3" />
                <Toast message="새 파티가 등록되었습니다." />
            </div> */}

            <div className="scrollbar overflow-y-auto h-[200px] w-[300px]">
                <div className="h-[400px]">
                    스크롤 테스트
                </div>
            </div>

            <div className="scrollbar overflow-x-auto w-[300px]">
                <div className="w-[600px]">
                    가로 스크롤 테스트
                </div>
            </div>
        </div>
    );
}
