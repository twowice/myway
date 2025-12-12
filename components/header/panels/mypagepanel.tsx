'use client';

import { panelstore } from '@/lib/panelstore';
import SlidePanel from '../slidepanel';

export default function MypagePanel() {
  const { openpanel, setopenpanel } = panelstore();
  
  return (
    <SlidePanel
      isopen={openpanel === 'mypage'}
      onclose={() => setopenpanel(null)}
      title="마이페이지"
    >
      <div className="space-y-4">
        <p>마이페이지 패널 내용</p>
      </div>
    </SlidePanel>
  );
}