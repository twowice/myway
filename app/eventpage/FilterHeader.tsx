import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/searchInput/searchInput'

interface FilterHeaderProps {
    onSearch: (value: string) => void;
}

export function FilterHeader({ onSearch }: FilterHeaderProps) {
    return (
        <div className='flex items-center gap-3 w-full'>
            <Button variant="secondary">월별</Button>
            <Button variant="secondary">전체</Button>
            <SearchInput onSearch={onSearch} delay={300}/>
        </div>
    );
}



