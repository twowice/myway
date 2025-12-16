'use client';

import { panelstore } from '@/stores/panelstore';
import SlidePanel from '../slidepanel';

export default function MorePanel() {
  const { openpanel, setopenpanel } = panelstore();
  
  return (
    <SlidePanel
      isopen={openpanel === 'more'}
      onclose={() => setopenpanel(null)}
      title="더보기"
    >
      <div className="space-y-4">
        <p>더보기 패널 내용</p>
      </div>
    </SlidePanel>
  );
}