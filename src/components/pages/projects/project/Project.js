import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectForms from "../../../formulario/ProjectForms";
import Container from "../../../layout/container/Container";
import Loading from "../../../layout/loading/Loading";
import Message from "../../../layout/message/Message";
import styles from "./Project.module.css";

function Project() {
  let { id } = useParams()
  const [project, setProject] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();
 

  useEffect(() => {
    // Para ver o loading
    setTimeout(
      () =>
        fetch(`http://localhost:5000/projects/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            setProject(data)

          }),
      0,
    )
  }, [id])

  function editPost(project) {
    setMessage('');
    // budget validation
    if (project.budget < project.cost) {
      setMessage("O orçamento não pode ser menor que o custo do projeto!");
      setType("error");
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data)
        setShowProjectForm(!showProjectForm)
        setMessage("Projeto Atualizado!")
        setType("success")
      })
  }

  function toggleProjectForm() {

      setShowProjectForm(!showProjectForm)
  }

  function toggleServiceForm() {

    setShowServiceForm(!showServiceForm)
  }


  return(
    <>
      {project.name ?
       (
       <div className={styles.project_details}>
         <Container customClass="column">
           {message && <Message type={type} msg={message}/>}
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? "Editar projeto" : "Fechar projeto"}
              </button>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria: </span>{project.category.name}
                  </p>
                 <p>
                   <span>Total de Orçamento</span> R$:{project.budget}
                 </p>
                 <p>
                   <span>Total Utilizado</span> R$:{project.cost}
                 </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForms
                    handleSubmit={editPost}
                    btnText="Concluir Edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <p>Adicione um serviço:</p>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? "Adicionar serviço" : "Fechar serviço"}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && <div>formulario de serviço</div>}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
                <p>Itens de serviços</p>
            </Container>
         </Container>
      </div>
      ) : (
        <Loading/>
      )}
    </>
  )
}

export default Project;