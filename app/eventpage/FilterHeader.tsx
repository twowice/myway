import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/searchInput/searchInput'
import { ComboboxComponent } from '@/components/basic/combo';

interface FilterHeaderProps {
    onSearch: (value: string) => void;
}

export function FilterHeader({ onSearch }: FilterHeaderProps) {
    return (
        <div className='flex items-center gap-3 w-full'>
            <ComboboxComponent
                options={[
                    { value: 'festival', label: '축제' },
                    { value: 'performance', label: '공연' },
                    { value: 'exhibition', label: '전시' },
                    { value: 'popup', label: '팝업' },
                    { value: 'etc', label: '기타' },
                ]}
            />
            <ComboboxComponent
                options={[
                    { value: 'all', label: '전국' },
                    { value: 'seoul', label: '서울' },
                    { value: 'busan', label: '부산' },
                    { value: 'daegu', label: '대구' },
                    { value: 'incheon', label: '인천' },
                    { value: 'gwangju', label: '광주' },
                    { value: 'daejeon', label: '대전' },
                    { value: 'ulsan', label: '울산' },
                    { value: 'sejong', label: '세종' },
                    { value: 'gyeonggi', label: '경기도' },
                    { value: 'gangwon', label: '강원도' },
                    { value: 'chungbuk', label: '충청북도' },
                    { value: 'chungnam', label: '충청남도' },
                    { value: 'jeonbuk', label: '전라북도' },
                    { value: 'jeonnam', label: '전라남도' },
                    { value: 'gyeongbuk', label: '경상북도' },
                    { value: 'gyeongnam', label: '경상남도' },
                    { value: 'jeju', label: '제주도' },
                ]}
            />
            <Button variant="secondary">월별</Button>
            <Button variant="secondary">전체</Button>
            <SearchInput onSearch={onSearch} delay={300} />
        </div>
    );
}



