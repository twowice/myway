'use client';

import { panelstore } from '@/stores/panelstore';
import SlidePanel from '../slidepanel';

export default function MorePanel({ children }: { children: React.ReactNode }) {
   const { openpanel, setopenpanel } = panelstore();

   return (
      <SlidePanel isopen={openpanel === 'more'} onclose={() => setopenpanel(null)} title="더보기">
         {/* <div className="space-y-4"> */}
         {children}
         {/* </div> */}
      </SlidePanel>
   );
}
