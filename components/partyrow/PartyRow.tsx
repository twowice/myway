"use client";

import { Icon24 } from "@/components/icons/icon24";
import { TwoFunctionPopup } from "@/components/popup/twofunction";
import { RadioComponent } from "@/components/basic/radio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/contexts/ToastContext";
import { useState } from "react";

interface PartyRowProps {
  index: number;
  partyName: string;
  current_members: number;
  max_members: number;
  isSelected?: boolean; //선택 상태
  partyId?: string;
  liked?: boolean;
  onToggleLike?: (partyId: string) => void;
}

export function PartyRow({
  index,
  partyId,
  partyName,
  current_members,
  max_members,
  isSelected = false, //선택 상태
  liked = false,
  onToggleLike,
}: PartyRowProps) {
  const { showToast } = useToast();
  const categoryOptions = [
    { value: "사이비 포교 활동", label: "사이비 포교 활동" },
    { value: "미허가 영리활동", label: "미허가 영리활동" },
    { value: "부적절한 언어", label: "부적절한 언어" },
    { value: "사칭 목적 파티", label: "사칭 목적 파티" },
    { value: "불법 행위", label: "불법 행위" },
    { value: "광고", label: "광고" },
    { value: "기타", label: "기타" },
  ];

  const [reportCategory, setReportCategory] = useState(
    categoryOptions[0]?.value ?? "",
  );
  const [reportContent, setReportContent] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [addOpinion, setAddOpinion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const resetReportForm = () => {
    setReportCategory(categoryOptions[0]?.value ?? "");
    setReportContent("");
    setReportDate("");
    setAddOpinion("");
  };

  const handleReportOpenChange = (open: boolean) => {
    setIsReportOpen(open);
    if (!open) {
      resetReportForm();
    }
  };

  const handleSubmitReport = async () => {
    if (isSubmitting) return;
    if (!partyId) {
      alert("파티 정보를 찾을 수 없어요.");
      return;
    }
    if (!reportCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!reportContent.trim()) {
      alert("신고 내용을 입력해주세요.");
      return;
    }
    if (!reportDate) {
      alert("발생 일시를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/party/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyId,
          reportCategory,
          reportContent: reportContent.trim(),
          reportDate,
          addOpinion: addOpinion.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message ?? "파티 신고에 실패했어요.");
      }

      showToast("파티 신고가 접수됐어요.");
      resetReportForm();
      setIsReportOpen(false);
    } catch (error) {
      console.error("파티 신고 실패:", error);
      alert(error instanceof Error ? error.message : "파티 신고에 실패했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      className={`flex items-center justify-between w-full px-4 py-3 border-2 bg-[#007DE4]/10 rounded-[4px] ${isSelected ? "border-primary" : "border-transparent"}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-foreground font-semibold text-[16px] shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="text-[16px] font-medium text-[var(--foreground)] truncate min-w-0">
          {partyName}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[14px] text-[var(--foreground)]">
          {current_members}/{max_members}
        </span>

        <button
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!partyId || !onToggleLike) return;
            onToggleLike(partyId);
          }}
        >
          <Icon24 name={liked ? "likefill" : "likedef"} />
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          <TwoFunctionPopup
            dialogTrigger={
              <button className="cursor-pointer">
                <Icon24 name="notify" />
              </button>
            }
            title="파티 신고 처리"
            open={isReportOpen}
            onOpenChange={handleReportOpenChange}
            body={
              <div className="flex flex-col gap-5 w-full pb-5 pt-2 max-h-[60vh] overflow-y-auto px-1 pe-3">
                {/* 카테고리 */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-[#04152F]">카테고리</p>
                  <RadioComponent
                    options={categoryOptions}
                    className="flex flex-col gap-3"
                    itemGap="gap-2"
                    value={reportCategory}
                    onValueChange={setReportCategory}
                  />
                </div>

                {/* 파티명 */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-[#04152F]">파티명</p>
                  <Input value={partyName} readOnly />
                </div>

                {/* 신고 내용 */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-[#04152F]">
                    신고 내용
                  </p>
                  <Textarea
                    placeholder="신고 사유를 입력해주세요"
                    rows={4}
                    className="resize-none h-[96px]"
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                  />
                </div>

                {/* 발생 일시 */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-[#04152F]">
                    발생 일시
                  </p>
                  <Input
                    type="datetime-local"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                  />
                </div>

                {/* 추가 의견 */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-[#04152F]">
                    추가 의견{" "}
                    <span className="text-xs text-muted-foreground">
                      (선택)
                    </span>
                  </p>
                  <Input
                    placeholder="추가로 전달할 내용이 있다면 입력하세요"
                    value={addOpinion}
                    onChange={(e) => setAddOpinion(e.target.value)}
                  />
                </div>
              </div>
            }
            leftTitle="취소"
            rightTitle="신고"
            closeOnRight={false}
            leftCallback={resetReportForm}
            rightCallback={handleSubmitReport}
          />
        </div>
      </div>
    </div>
  );
}
