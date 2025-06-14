import { BootstrapLayout } from "../src/components/BootstrapLayout"
import { BootstrapDestacados } from "../src/components/BootsrapDestacados"
import "bootstrap/dist/css/bootstrap.min.css"
import "./bootstrap-custom.css"

function App() {
  return (
    <>
      <BootstrapLayout
        logo={"https://img.freepik.com/vector-gratis/zapato-cristal-brillante-cenicienta_23-2148470395.jpg"}
        tituloSeccion="Libros Destacados"
        children={<BootstrapDestacados />}
      />
    </>
  )
}

export default App

