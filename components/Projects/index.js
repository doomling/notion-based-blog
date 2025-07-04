import styles from "./style.module.scss";
import Boxes from "../Boxes";
import Button from "../Button";
import Contact from "../Contact";

export default function Projects() {
  const projectList = [
    {
      name: "Galio",
      img: "projects_1.png",
      link: "https://proof.galio.app/?v=1",
    },
    {
      name: "Te lo explico com gatitos",
      img: "projects_2.png",
      link: "https://teloexplicocongatitos.com",
    },
    {
      name: "Diseño y planificación de cursos técnicos",
      img: "projects_3.png",
      link: "https://codigofacilito.com",
    },
  ];
  return (
    <section>
      <h2 id="proyectos">Trabajemos juntos</h2>
      <div>
        <h3>Tengo amplia experiencia en:</h3>
        <li>Desarollo fullstack, particularmente en productos financieros</li>
        <li>Armado y planeación de cursos y clases</li>
        <li>
          Creación de contenido y recursos educativos tanto para redes como para
          el aula
        </li>
        <h3>¿Necesitás estos servicios?</h3>
        <div className={styles.buttonContainer}>
          <a href="mailto: belenrey@gmail.com">
            <Button text="contactame" />
          </a>
          {/* <Contact /> */}
        </div>
      </div>
      <h2>Proyectos destacados:</h2>
      <Boxes items={projectList} />
      {/* <Button text="Más proyectos donde combino tecnología + docencia + diseño" /> */}
    </section>
  );
}
