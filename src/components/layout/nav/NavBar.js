import {Link} from "react-router-dom";

import Container from "../container/Container";

import styles from "../nav/NavBar.module.css"
import logo from "../../img/costs_logo.png";



function NavBar() {
  return (
      <nav className={styles.navbar}>   
        <Container>
          <img src={logo}alt ="logo"/>
          <ul className={styles.list}>
            <li className={styles.item}>
              <Link to="/">Home</Link>
            </li>
            <li className={styles.item}>
              <Link to="/projects">Projetos</Link> 
            </li>
            <li className={styles.item}>
              <Link to="/company">Empresa</Link> 
            </li>
            <li className={styles.item}>
              <Link to="/contact">Contato</Link>
            </li>
          </ul>                
        </Container>        
     </nav>
 
);
}

export default NavBar;