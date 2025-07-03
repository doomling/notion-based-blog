import style from "./style.module.scss";

const DoodleStarsBackground = () => {
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
        ★
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
        ★
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
        ★
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
        ★
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
        ★
      </div>
    </div>
  );
};

export default DoodleStarsBackground;
