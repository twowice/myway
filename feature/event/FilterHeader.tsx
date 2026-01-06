/* ===========================
    Event FiterHeader
=========================== */

import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/ui/searchBar'
import { ComboboxComponent } from '@/components/basic/combo';

interface FilterHeaderProps {
    keyword: string;
    onSearch: (value: string) => void;
    category: string;
    region: string;
    month: string;
    isPanel: boolean;
    onFilterChange: (filter: { category: string; region: string; month: string }) => void;
}

export function FilterHeader({ keyword, onSearch, category, region, month, onFilterChange, isPanel }: FilterHeaderProps) {

    /* ===========================
        Search Function
    =========================== */
    const handleSearch = (value: string) => {
        const trimmed = value.trim();
        if (trimmed === '' && keyword !== '') return;
        if (trimmed.length < 2) { onSearch(''); return; }

        onSearch(trimmed);
    };

    return (
        <div className='w-full flex flex-wrap gap-2 sm:gap-3 items-center '>
            <ComboboxComponent
                options={[
                    { value: 'A02', label: '축제' },
                    { value: 'performance', label: '공연' },
                    { value: 'exhibition', label: '전시' },
                    { value: 'popup', label: '팝업' },
                    { value: 'etc', label: '기타' },
                ]}
                value={category}
                onValueChange={(value) => onFilterChange({ category: value, region, month })}
            />
            {!isPanel && (
                <div className="w-[48%] sm:w-auto">
                    <ComboboxComponent
                        options={[
                            { value: 'all', label: '전국' },
                            { value: '서울', label: '서울' },
                            { value: '부산', label: '부산' },
                            { value: '대구', label: '대구' },
                            { value: '인천', label: '인천' },
                            { value: '광주', label: '광주' },
                            { value: '대전', label: '대전' },
                            { value: '울산', label: '울산' },
                            { value: '세종', label: '세종' },
                            { value: '경기도', label: '경기도' },
                            { value: '강원도', label: '강원도' },
                            { value: '충청북도', label: '충청북도' },
                            { value: '충청남도', label: '충청남도' },
                            { value: '전라북도', label: '전라북도' },
                            { value: '전라남도', label: '전라남도' },
                            { value: '경상북도', label: '경상북도' },
                            { value: '경상남도', label: '경상남도' },
                            { value: '제주도', label: '제주도' },
                        ]}
                        value={region}
                        onValueChange={(value) => onFilterChange({ category, region: value, month })}
                    />
                </div>
            )}

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
                    value={month}
                    onValueChange={(value) => onFilterChange({ category, region, month: value })}
                />
                {!isPanel && (
                    <Button variant="secondary" className='cursor-pointer h-[41px]' onClick={() => onFilterChange({ category: 'A02', region: 'all', month: 'all' })}>전체</Button>
                )}
            </div>
            <SearchBar value={keyword} onChange={onSearch} onSearch={handleSearch} delay={500} />
        </div>
    );
}



