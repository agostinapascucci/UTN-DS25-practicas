
export function NewLayout({ logo, tituloSeccion, children }) {
    return(
        <div className="page-conteiner">
            <header className="site-header">
                <img src={logo} alt="logo" />
                <h1 >Cinderella Books</h1>
            </header>
            <nav className="main-nav">
                <ul className="nav-list">
                    <li><a className="nav-link" href="" target="_self">Inicio</a></li>
                    <li><a className="nav-link" href="" target="_self">Ciencia Ficción</a></li>
                    <li><a className="nav-link" href="" target="_self">Novela Histórica</a></li>
                    <li><a className="nav-link" href="" target="_self">Desarrollo Personal</a></li>
                    <li><a className="nav-link" href="" target="_self">Fantasía</a></li>
                    <li><a className="nav-link" href="" target="_self">Registración</a></li>
                    <li><a className="nav-link" href="" target="_self">Contacto</a></li>
                </ul>
            </nav>
            <div className="main-content-area">
                <main className="content-section">
                    <h2 className="section-title">{tituloSeccion}</h2>
                        {children}
                </main>
            </div>
            <footer className="site-footer">
                <div className="footer-content">
                    <p className='footer-text' id="derechos">Todos los derechos reservados.</p>
                    <p className='footer-text' id="red">Instagram: @cinderellabooks_</p>
                    <p className='footer-text' id="terminos"><a href="">Términos y condiciones</a></p>
                </div>
            </footer>
        </div>
    );
}

      