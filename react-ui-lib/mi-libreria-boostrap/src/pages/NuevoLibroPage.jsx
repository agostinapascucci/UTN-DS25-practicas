import { BootstrapLayout } from "../components/BootstrapLayout";
import { NuevoLibro } from "../components/AgregarLibroNew";

function NuevoLibroPage({agregarLibro}) {
  return (
    <BootstrapLayout
      logo="https://img.freepik.com/vector-gratis/zapato-cristal-brillante-cenicienta_23-2148470395.jpg"
      tituloSeccion="Añadir nuevo libro"
      destacados={<NuevoLibro agregarLibro={agregarLibro} />}
    />
  );
}

export default NuevoLibroPage;
