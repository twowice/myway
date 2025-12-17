'use client';

import { useRouter } from 'next/navigation';
import MoreContent, { allPolicys } from '../../page';
import { Button } from '@/components/ui/button';
import { Icon24 } from '@/components/icons/icon24';
import { use } from 'react';

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
            <div className="flex flex-col h-[calc(100vh-300px)]">
               <Button onClick={handleBack} variant={'ghost'} className="justify-start w-10 p-0">
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
         <div className="flex flex-col h-[calc(100vh-250px)]">
            <Button onClick={handleBack} variant={'ghost'} className="justify-between">
               <Icon24 name="back" className="text-foreground" />
               {policy.title}
            </Button>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
               <div className="whitespace-pre-wrap pb-4">{policy.detail}</div>
            </div>
         </div>
      </MoreContent>
   );
}
