'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
   FaBold,
   FaItalic,
   FaUnderline,
   FaStrikethrough,
   FaAlignLeft,
   FaAlignCenter,
   FaAlignRight,
   FaAlignJustify,
} from 'react-icons/fa';
import { RadioComponent } from '@/components/basic/radio';
import { CheckboxComponent } from '@/components/basic/checkbox';
import { useEffect, useState } from 'react';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { RiResetLeftFill } from 'react-icons/ri';
import { NoticeData } from '@/types/userReport';
import { TwoFunctionPopup } from '@/components/popup/twofunction';

type MenuBarProps = {
   editor: Editor | null;
};

const MenuBar = ({ editor }: MenuBarProps) => {
   const [, setUpdate] = useState(0);

   if (!editor) {
      return null;
   }

   const forceUpdate = () => setUpdate(prev => prev + 1);

   const colors = [
      ['#000000', '#FF0000', '#0000FF'],
      ['#00FF00', '#FFFF00', '#FF00FF'],
   ];
   const highlightColors = [
      ['#FFFF00', '#FFD700', '#90EE90'],
      ['#87CEEB', '#FFC0CB', '#DDA0DD'],
   ];

   return (
      <div className="flex p-1 gap-1 border-b bg-primary/10">
         {/* 텍스트 스타일 */}
         <div className="flex gap-1">
            <button
               onClick={() => {
                  editor.chain().focus().toggleBold().run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive('bold') ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaBold />
            </button>
            <button
               onClick={() => {
                  editor.chain().focus().toggleItalic().run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive('italic') ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaItalic />
            </button>
            <button
               onClick={() => {
                  editor.chain().focus().toggleUnderline().run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive('underline') ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaUnderline />
            </button>
            <button
               onClick={() => {
                  editor.chain().focus().toggleStrike().run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive('strike') ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaStrikethrough />
            </button>
         </div>

         <div className="w-px bg-gray-300" />

         {/* 정렬 */}
         <div className="flex gap-1">
            <button
               onClick={() => {
                  editor.chain().focus().setTextAlign('left').run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaAlignLeft />
            </button>
            <button
               onClick={() => {
                  editor.chain().focus().setTextAlign('center').run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaAlignCenter />
            </button>
            <button
               onClick={() => {
                  editor.chain().focus().setTextAlign('right').run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaAlignRight />
            </button>
            <button
               onClick={() => {
                  editor.chain().focus().setTextAlign('justify').run();
                  forceUpdate();
               }}
               className={`p-2 rounded transition-colors hover:bg-primary/20 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-primary/30' : 'bg-transparent'}`}
               type="button"
            >
               <FaAlignJustify />
            </button>
         </div>

         <div className="w-px bg-gray-300" />

         {/* 텍스트 색상 */}
         <div className="flex items-center gap-2 px-2 py-1 bg-white/50 rounded">
            <span className="text-xs text-gray-600 font-medium">A</span>
            <div className="flex flex-col gap-1">
               {colors.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                     {row.map(color => (
                        <button
                           key={color}
                           onClick={() => {
                              editor.chain().focus().setColor(color).run();
                              forceUpdate();
                           }}
                           className={`w-4 h-4 rounded transition-all hover:scale-110 ${
                              editor.isActive('textStyle', { color })
                                 ? 'ring-2 ring-primary ring-offset-1'
                                 : 'border border-gray-300 hover:border-gray-400'
                           }`}
                           style={{ backgroundColor: color }}
                           type="button"
                        />
                     ))}
                  </div>
               ))}
            </div>
            <button
               onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  forceUpdate();
               }}
               className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
               type="button"
               title="색상 초기화"
            >
               <RiResetLeftFill size={14} />
            </button>
         </div>

         <div className="w-px bg-gray-300" />

         {/* 배경 색상 */}
         <div className="flex items-center gap-2 px-2 py-1 bg-white/50 rounded">
            <span className="text-xs text-gray-600 font-medium">BG</span>
            <div className="flex flex-col gap-1">
               {highlightColors.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                     {row.map(highlight => (
                        <button
                           key={highlight}
                           onClick={() => {
                              editor.chain().focus().setHighlight({ color: highlight }).run();
                              forceUpdate();
                           }}
                           className={`w-4 h-4 rounded transition-all hover:scale-110 ${
                              editor.isActive('highlight', { color: highlight })
                                 ? 'ring-2 ring-primary ring-offset-1'
                                 : 'border border-gray-300 hover:border-gray-400'
                           }`}
                           style={{ backgroundColor: highlight }}
                           type="button"
                        />
                     ))}
                  </div>
               ))}
            </div>
            <button
               onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  forceUpdate();
               }}
               className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
               type="button"
               title="배경색 초기화"
            >
               <RiResetLeftFill size={14} />
            </button>
         </div>
      </div>
   );
};

interface EditNoticeProps {
   notice: NoticeData | null;
   isOpen: boolean;
   onClose: () => void;
   onEditNotice: (formData: any, originalNotice: NoticeData) => Promise<void>;
   onDeleteNotice: (noticeId: number) => Promise<void>;
}

export function EditNotice({ notice, isOpen, onClose, onEditNotice, onDeleteNotice }: EditNoticeProps) {
   const [isEmpty, setIsEmpty] = useState(true);
   const [category, setCategory] = useState('normal');
   const [isTopFixed, setIsTopFixed] = useState(false);
   const [title, setTitle] = useState('');

   const editor = useEditor({
      immediatelyRender: false,
      extensions: [
         StarterKit,
         Underline,
         TextStyle,
         TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right', 'justify'],
            defaultAlignment: 'left',
         }),
         Color,
         Highlight.configure({
            multicolor: true,
         }),
      ],
      content: '',
      editorProps: {
         attributes: {
            class: 'p-4 focus:outline-none min-h-[700px]',
         },
      },
      onUpdate: ({ editor }) => {
         setIsEmpty(editor.isEmpty);
      },
   });

   useEffect(() => {
      if (notice) {
         setCategory(notice.category);
         setIsTopFixed(notice.is_top_fixed);
         setTitle(notice.title);

         if (editor && notice.content) {
            editor.commands.setContent(notice.content);
            setIsEmpty(false);
         }
      }
   }, [notice, editor]);

   const handleEdit = async () => {
      if (!title.trim()) {
         alert('제목을 입력해주세요.');
         return;
      }

      if (!editor || editor.isEmpty) {
         alert('내용을 입력해주세요.');
         return;
      }

      const noticeData = {
         category,
         isTopFixed,
         title: title.trim(),
         content: editor.getHTML(),
      };

      const formData = {
         category,
         isTopFixed,
         title: title.trim(),
         content: editor.getHTML(),
      };

      try {
         await onEditNotice(formData, notice!);

         onClose();

         alert('공지사항이 등록되었습니다.');
      } catch (error) {
         console.error('등록 실패:', error);
      }

      // // API
      // try {
      //    const response = await fetch('/api/notices', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(noticeData),
      //    });
      //    if (response.ok) {
      //       alert('공지사항이 등록되었습니다.');
      //       setTitle('');
      //       setCategory('normal');
      //       setIsTopFixed(false);
      //       editor?.commands.clearContent();
      //    }
      // } catch (error) {
      //    console.error('등록 실패:', error);
      //    alert('등록에 실패했습니다.');
      // }
   };

   const handleDelete = async () => {
      if (!notice?.id) return;
      const confirmDelete = window.confirm(
         '정말로 이 공지사항을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.',
      );

      if (!confirmDelete) return;

      try {
         await onDeleteNotice(notice.id);
         onClose();
         alert('공지사항이 삭제되었습니다.');
      } catch (error) {
         console.error('공지사항 삭제 실패:', error);
      }
   };

   if (!notice) return null;

   return (
      <TwoFunctionPopup
         className="max-w-[800px]!"
         open={isOpen}
         onOpenChange={open => {
            if (!open) onClose();
         }}
         dialogTrigger={<div />}
         title="공지사항 수정"
         body={
            <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-2">
               <div className="flex gap-2 w-full items-center">
                  <label className="text-sm font-semibold">카테고리</label>
                  <RadioComponent
                     options={[
                        { value: 'normal', label: '일반' },
                        { value: 'update', label: '업데이트' },
                        { value: 'event', label: '이벤트' },
                        { value: 'policy', label: '이용정책' },
                     ]}
                     value={category}
                     onValueChange={setCategory}
                  />
               </div>
               <div className="flex gap-2 w-full items-center">
                  <label className="text-sm font-semibold w-13">옵션</label>
                  <CheckboxComponent
                     options={[{ value: 'top_fixed', label: '상단 고정' }]}
                     values={isTopFixed ? ['top_fixed'] : []}
                     onValueChange={values => setIsTopFixed(values.includes('top_fixed'))}
                  />
               </div>
               <div className="flex gap-2 w-full items-center">
                  <label className="text-sm font-semibold w-13">제목</label>
                  <input
                     type="text"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     className="flex-1 text-sm px-4 py-2 border rounded-md"
                     placeholder="제목을 입력해주세요."
                  />
               </div>

               <div className="flex flex-col w-full border rounded-md overflow-hidden">
                  <MenuBar editor={editor} />
                  <div className="relative">
                     <EditorContent editor={editor} className="text-sm relative z-10" />
                     {isEmpty && (
                        <div className="absolute top-4 left-4 text-gray-400 pointer-events-none text-sm">
                           공지사항으로 작성할 내용을 입력하세요.
                        </div>
                     )}
                  </div>
               </div>
            </div>
         }
         leftTitle="삭제하기"
         rightTitle="수정하기"
         leftCallback={handleDelete}
         rightCallback={handleEdit}
         closeOnLeft={false}
         closeOnRight={false}
      />
   );
}
