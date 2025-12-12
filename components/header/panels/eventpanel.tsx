'use client';

import { panelstore } from '@/lib/panelstore';
import SlidePanel from '../slidepanel';

export default function EventPanel() {
  const { openpanel, setopenpanel } = panelstore();
  
  return (
    <SlidePanel
      isopen={openpanel === 'event'}
      onclose={() => setopenpanel(null)}
      title="이벤트"
    >
      <div className="space-y-4">
        <p>이벤트 패널 내용</p>
      </div>
    </SlidePanel>
  );
}