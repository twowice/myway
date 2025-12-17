import { Icon24 } from '@/components/icons/icon24';
import { BadgeComponent } from './badge';
import { Notice } from '@/app/morepage/page';
import { useRouter } from 'next/navigation';

type NoticeProps = {
   notice: Notice;
};

export function NormalNotice({ notice }: NoticeProps) {
   const router = useRouter();
   const handleClick = () => {
      router.push(`/morepage/notice/${notice.id}`);
   };
   return (
      <div className="flex p-2 gap-2 items-center border-b" onClick={handleClick}>
         <BadgeComponent type={notice.type} />
         <p className="flex-1 truncate">{notice.title}</p>
         <p className="shrink-0 text-foreground/60">{notice.date}</p>
      </div>
   );
}
export function NormalNoticeDetail({ notice }: NoticeProps) {
   return (
      <div className="flex flex-col gap-2 border-b">
         <BadgeComponent type={notice.type} />
         <p className="flex-1 truncate">{notice.title}</p>
         <p className="shrink-0 text-foreground/60">{notice.date}</p>
      </div>
   );
}
export function TopFixedlNotice({ notice }: NoticeProps) {
   const router = useRouter();
   const handleClick = () => {
      router.push(`/morepage/notice/${notice.id}`);
   };
   return (
      <div className="flex p-2 gap-1 items-center border-b bg-primary/30" onClick={handleClick}>
         <Icon24 name="pinned" />
         <BadgeComponent type={notice.type} />
         <p className="flex-1 truncate">{notice.title}</p>
         <p className="shrink-0 text-foreground/60">{notice.date}</p>
      </div>
   );
}
