'use client';
import { panelstore } from "@/stores/panelstore"
import SlidePanel from '../slidepanel';

export default function EventPanel({children}: {children: React.ReactNode}) {

  /* ===========================
      Hook
  =========================== */
  const { openpanel, setopenpanel } = panelstore();

  return (
    <SlidePanel
      isopen={openpanel === 'event'}
      onclose={() => setopenpanel(null)}
      title="이벤트"
    >
      <div className="h-full">{children}</div>
    </SlidePanel>
  );
}