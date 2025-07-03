import styles from "./style.module.scss";
import Boxes from "../Boxes";

export default function Courses() {
  const courseList = [
    {
      name: "Bootcamp de Ciencias computacionales",
      img: "cover_ciencias.jpg",
    },
    {
      name: "Bootcamp de Javascript para el backend",
      img: "cover_js_backend.png",
    },
    {
      name: "Bootcamp de Fullstack Javascript",
      img: "cover_fullstack_javascript.jpg",
    },
    {
      name: "Bootcamp de Infraestructura para frontends",
      img: "cover_infra_front.png",
    },
    {
      name: "Bootcamp Premium de Frontend",
      img: "cover_frontend-premium.jpg",
    },
  ];
  return (
    <section>
      <h2>Estudía conmigo:</h2>
      <Boxes items={courseList} />
    </section>
  );
}
