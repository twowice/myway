'use client';

import { panelstore } from '@/lib/panelstore';
import SlidePanel from '../slidepanel';

export default function PartyPanel() {
  const { openpanel, setopenpanel } = panelstore();
  
  return (
    <SlidePanel
      isopen={openpanel === 'party'}
      onclose={() => setopenpanel(null)}
      title="파티 모집"
    >
      <div className="space-y-4">
        <p>파티 모집 패널 내용</p>
      </div>
    </SlidePanel>
  );
}