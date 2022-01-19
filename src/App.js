import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "./components/layout/container/Container";
import Footer from "./components/layout/footer/Footer";
import NavBar from "./components/layout/nav/NavBar";
import Company from "./components/pages/company/Company";
import Contact from "./components/pages/contact/Contact";
import Home from "./components/pages/home/Home";
import NewProject from "./components/pages/newProject/NewProject";
import Project from "./components/pages/projects/project/Project";
import Projects from "./components/pages/projects/Projects";




function App() {
  return (
    <BrowserRouter>
      <NavBar/>
    <Container customClass="min-heigth">
      <Routes>      
              <Route index element={<Home />} />
              <Route path="/company" element={<Company />} />
              <Route path="/projects" element={<Projects/>}/>
              <Route path="/contact" element={<Contact />} />
              <Route path="/newproject" element={<NewProject />} /> 
              <Route path="/project/:id" element={<Project />} />    
      </Routes>
    </Container>
        <Footer/>
    </BrowserRouter>
  );
}

export default App;
