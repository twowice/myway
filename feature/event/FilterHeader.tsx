import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/ui/searchBar'
import { ComboboxComponent } from '@/components/basic/combo';

interface FilterHeaderProps { onSearch: (value: string) => void; }

export function FilterHeader({ onSearch }: FilterHeaderProps) {
    return (
        <div className='w-full flex flex-wrap gap-2 sm:gap-3 items-center '>
            <ComboboxComponent
                options={[
                    { value: 'festival', label: '페스티벌' },
                    { value: 'performance', label: '공연' },
                    { value: 'exhibition', label: '전시' },
                    { value: 'popup', label: '팝업' },
                    { value: 'etc', label: '기타' },
                ]}
            />
            <div className="w-[48%] sm:w-auto">
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
            </div>
            <div className="flex gap-2 w-[50%] sm:w-auto">
                <ComboboxComponent
                    options={[
                        { value: 'all', label: '월별' },
                        { value: '1월', label: '1월' },
                        { value: '2월', label: '2월' },
                        { value: '3월', label: '3월' },
                        { value: '4월', label: '4월' },
                        { value: '5월', label: '5월' },
                        { value: '6월', label: '6월' },
                        { value: '7월', label: '7월' },
                        { value: '8월', label: '8월' },
                        { value: '9월', label: '9월' },
                        { value: '10월', label: '10월' },
                        { value: '11월', label: '11월' },
                        { value: '12월', label: '12월' },
                    ]}
                />
                <Button variant="secondary">전체</Button>
            </div>
            <SearchBar onSearch={onSearch} delay={300} />
        </div>
    );
}



