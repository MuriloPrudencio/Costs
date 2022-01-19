import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProjectCards from "../../cards/ProjectCards";
import Container from "../../layout/container/Container";
import Loading from "../../layout/loading/Loading";
import LinkButton from "../../layout/linkButton/LinkButton";
import Message from "../../layout/message/Message";
import styles from "./Projects.module.css";




function Projects() {

  const [projects, setProject] =useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState('');


  useEffect(() => {

    fetch("http://localhost:5000/projects", {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
      },
    }).then(resp => resp.json())
    .then( data => {
      setProject(data)
      setRemoveLoading(true)
    })
    .catch(err => console.log(err))
  }, [])

  const location = useLocation();
  let message ='';
  if (location.state) {
    message = location.state.message
  }

  function removeProjects (id) {

    fetch(`http://localhost:5000/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type" : "application/json",
    },
    }).then(resp => resp.json())
    .then(() => {
      setProject(projects.filter((project) => project.id !== id))
      //message
      setProjectMessage("Projeto removido com sucesso!")
    })
    .catch(err => console.log(err))

  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto"/>
      </div>
     {message && <Message type="success" msg={message}/>}
     {projectMessage && <Message type="success" msg={projectMessage}/>}
     <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCards
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project.category.name}
              key={project.id}
              handleRemove={removeProjects}
            />
          ))}
          {!removeLoading && <Loading/>}
          {removeLoading && projects.lenth === 0 && (
            <p>Não há projetos cadastrados</p>
          )}
      </Container>
    </div>
  )
}

export default Projects;