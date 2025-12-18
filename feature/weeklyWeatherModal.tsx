import { useEffect } from "react";

type DailyWeather = {
  date: string;
  maxTemp: number;
  minTemp: number;
  weathercode: number;
  precipitation: number; //강수량
};

type Props = {
  weeklyWeather: DailyWeather[] | null;
  onClose: () => void;
};

const WeeklyWeatherModal = ({ weeklyWeather, onClose }: Props) => {
  useEffect(() => {
    // ESC로 닫기
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  return (
    <div>
      <div
        className="ms-5"
        style={{
          position: "fixed",
          bottom: "140px",
          background: "#F1F5FA",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          zIndex: 200,
          maxWidth: "500px",
          width: "400px",
          maxHeight: "500px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
            주간 날씨
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#04152F",
            }}
          >
            X
          </button>
        </div>

        <div style={{ padding: "0 16px 16px 16px" }}>
          {weeklyWeather?.map((day, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #dce3eb",
                  justifyContent: "space-between",
                }}
              >
                {/* 날짜 */}
                <div style={{ flex: 1, fontSize: "12px", color: "#04152F" }}>
                  {formatDate(day.date)}
                </div>

                {/* 아이콘 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid black",
                    width: "36px",
                    height: "36px",
                  }}
                >
                  {/* <Icon24 weathercode={day.weathercode} /> */}
                </div>

                {/* 강수량 */}
                <div
                  style={{
                    flex: 1,
                    fontSize: "12px",
                    color: "#04152F",
                    textAlign: "center",
                  }}
                >
                  {day.precipitation > 0 ? `${day.precipitation}mm` : "-"}
                </div>

                {/* 온도 */}
                <div
                  style={{
                    flex: 1,
                    fontSize: "12px",
                    color: "#04152F",
                    textAlign: "center",
                  }}
                >
                  {day.minTemp}° / {day.maxTemp}°
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyWeatherModal;
