'use client';

import { useRouter } from 'next/navigation';
import MoreContent from '../../page';
import { Button } from '@/components/ui/button';
import { Icon24 } from '@/components/icons/icon24';
import { use } from 'react';
import { allPolicys } from '@/dummy/more';

export default function PolicyDetail({ params }: { params: Promise<{ id: string }> }) {
   const router = useRouter();
   const { id } = use(params);
   const policy = allPolicys.find(n => n.id === Number(id));

   const handleBack = () => {
      router.push('/morepage?tab=policy');
   };

   if (!policy) {
      return (
         <MoreContent>
            <div className="flex flex-col h-full">
               <Button onClick={handleBack} variant={'ghost'} className="justify-start w-10 p-0 shrink-0">
                  <Icon24 name="back" className="text-foreground" />
               </Button>
               <div className="flex justify-center items-center flex-1">
                  <p className="text-gray-400">상세내용이 없습니다.</p>
               </div>
            </div>
         </MoreContent>
      );
   }

   return (
      <MoreContent>
         <div className="flex flex-col h-full">
            <Button onClick={handleBack} variant={'ghost'} className="justify-start p-0 shrink-0 w-full mb-3">
               <Icon24 name="back" className="text-foreground" />
               {policy.title}
            </Button>
            <div className="flex-1 overflow-y-auto min-h-0">
               <div className="whitespace-pre-wrap pb-4">{policy.detail}</div>
            </div>
         </div>
      </MoreContent>
   );
}
