import style from "./style.module.scss";

const DoodleStarsBackground = () => {
  const glitchShapes = ["|", "/", "\\", "─", "║", "▓", "▒", "░", "╱", "╲"];
  
  return (
    <div className={style.starsContainer}>
      <div
        className={style.estrella}
        style={{
          top: "10%",
          left: "20%",
          fontSize: "24px",
          animationDelay: "0s",
        }}
      >
        |
      </div>
      <div
        className={style.estrella}
        style={{
          top: "30%",
          left: "50%",
          fontSize: "16px",
          animationDelay: "2s",
        }}
      >
        /
      </div>
      <div
        className={style.estrella}
        style={{
          top: "70%",
          left: "40%",
          fontSize: "20px",
          animationDelay: "4s",
        }}
      >
        ║
      </div>
      <div
        className={style.estrella}
        style={{
          top: "80%",
          left: "80%",
          fontSize: "14px",
          animationDelay: "1s",
        }}
      >
        \
      </div>
      <div
        className={style.estrella}
        style={{
          top: "50%",
          left: "10%",
          fontSize: "18px",
          animationDelay: "3s",
        }}
      >
        ─
      </div>
      <div
        className={style.estrella}
        style={{
          top: "15%",
          left: "70%",
          fontSize: "22px",
          animationDelay: "1.5s",
        }}
      >
        ▓
      </div>
      <div
        className={style.estrella}
        style={{
          top: "60%",
          left: "30%",
          fontSize: "12px",
          animationDelay: "2.5s",
        }}
      >
        ╱
      </div>
      <div
        className={style.estrella}
        style={{
          top: "40%",
          left: "85%",
          fontSize: "16px",
          animationDelay: "3.5s",
        }}
      >
        ╲
      </div>
      <div
        className={style.estrella}
        style={{
          top: "90%",
          left: "15%",
          fontSize: "20px",
          animationDelay: "0.5s",
        }}
      >
        ▒
      </div>
      <div
        className={style.estrella}
        style={{
          top: "25%",
          left: "60%",
          fontSize: "14px",
          animationDelay: "4.5s",
        }}
      >
        ░
      </div>
    </div>
  );
};

export default DoodleStarsBackground;
