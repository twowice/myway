'use client';

import { panelstore } from "@/stores/panelstore"
import SlidePanel from '../slidepanel';

export default function LocationPanel() {
  const { openpanel, setopenpanel } = panelstore();
  
  return (
    <SlidePanel
      isopen={openpanel === 'location'}
      onclose={() => setopenpanel(null)}
      title="길찾기"
    >
      <div className="space-y-4">
        <p>길찾기 패널 내용</p>
      </div>
    </SlidePanel>
  );
}