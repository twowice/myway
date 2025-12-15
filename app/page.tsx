'use client';
import { Icon24 } from '@/components/icons/icon24';
import { Icon36 } from '@/components/icons/icon36';

export default function Home() {
  return (
    <div style={{ padding: '50px', background: '#f0f0f0' }}>
      <h1>아이콘 테스트 페이지</h1>

      {/* 기본 사용 */}
      <Icon24 name="arrow" />
      <Icon24 name="add" />
      <Icon36 name="notice36" />
      <Icon24 name="routedef" />
      <Icon24 name="sharedef" />
      <Icon24 name="pinned" />
      <Icon24 name="likedef" />
      <Icon24 name="minus" />
      <Icon24 name="plus" />
      <Icon24 name="drag" />
      <Icon24 name="down" />
      <Icon24 name="up" />
      <Icon24 name="sunny" />
      <Icon24 name="rainy" />
      <Icon24 name="cloudy" />
      <Icon24 name="snow" />
      <Icon24 name="thunder" />
      <Icon24 name="notify" />
      <Icon24 name="closeblack" />
      <Icon24 name="close" />
      <Icon24 name="back" />
      <Icon24 name="go" />
      <Icon24 name="notice" />
      <Icon24 name="search" />
      <Icon24 name="trash" />
      <Icon24 name="clock" />
      <Icon24 name="calendar" />

      <Icon36 name="more" />
      <Icon36 name="profile" />
      <Icon36 name="event" />
      <Icon36 name="alertexist" />
      <Icon36 name="alert" />
      <Icon36 name="location" />
      <Icon36 name="price" />
      <Icon36 name="city" />
      <Icon36 name="phone" />
      <Icon36 name="party" />
      <Icon36 name="sns" />
      <Icon36 name="bigcalendar" />
      <Icon36 name="matching" />
      <Icon36 name="record" />
      <Icon36 name="bigheartdef" />
      <Icon36 name="user" />
      <Icon36 name="festival" />


      <br /><br />

      {/* 크기 바꾸기 */}
      <Icon24 name="routedef" width={50} height={50} />

      <br /><br />

      {/* 색상 바꾸기 */}
      <Icon24 name="routedef" className="text-red-500" />

      <br /><br />

      {/* 클릭도 되는지 테스트 */}
      <Icon24 
        name="routedef" 
        width={60} 
        className="text-blue-600 hover:text-purple-600 cursor-pointer"
        onClick={() => alert('클릭됨!')}
      />

      <br /><br />
    </div>
  );
}