import styles from "./style.module.scss";
import Boxes from "../Boxes";

export default function Courses() {
  const courseList = [
    {
      name: "Bootcamp de Fullstack Typescript",
      img: "cover_fullstack_javascript.jpg",
      link: "https://codigofacilito.com/bootcamps/fullstack-typescript?username=doomling",
      featured: true,
      badge: "Nuevo",
    },
    {
      name: "Bootcamp de Ciencias computacionales",
      img: "cover_ciencias.jpg",
      link: "https://codigofacilito.com/bootcamps/ciencias-computacionales",
    },
    {
      name: "Bootcamp de Javascript para el backend",
      img: "cover_js_backend.png",
      link: "https://codigofacilito.com/bootcamps/javascript-backend/",
    },
    {
      name: "Bootcamp de Infraestructura para frontends",
      img: "cover_infra_front.png",
      link: "https://codigofacilito.com/bootcamps/frontend-infraestructura/",
    },
    {
      name: "Bootcamp Premium de Frontend",
      img: "cover_frontend-premium.jpg",
      link: "https://codigofacilito.com/bootcamps/frontend-g4/",
    },
  ];
  return (
    <section>
      <h2>Aprender conmigo:</h2>
      <Boxes items={courseList} />
    </section>
  );
}
