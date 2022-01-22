import {parse, v4 as uuidv4} from "uuid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectForms from "../../../formulario/ProjectForms";
import Container from "../../../layout/container/Container";
import Loading from "../../../layout/loading/Loading";
import Message from "../../../layout/message/Message";
import ServiceForm from "../../services/ServicesForm";
import styles from "./Project.module.css";
import ServiceCard from "../../../cards/serviceCards/ServiceCard";

function Project() {
  let { id } = useParams()
  const [project, setProject] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState();
  const [ services, setServices] = useState([])
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
            setServices(data.services)

          }),
      0,
    )
  }, [id])

  function editPost(project) {
    // budget validation
    if (project.budget < project.cost) {
      setMessage('O Orçamento não pode ser menor que o custo do projeto!')
      setType('error')
      return false
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
        setMessage('Projeto atualizado!')
        setType('success')
      })
  }

  function removeService(id, cost) {
    setMessage('')

    const servicesUpdated = project.services.filter(
      (service) => service.id !==  id
    )

    const projectUpdated = project

    projectUpdated.services = servicesUpdated
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(projectUpdated),
    }).then(resp => resp.json())
    .then((data) => {
      setProject(projectUpdated)
      setServices(servicesUpdated)
      setMessage("Serviço removido com sucesso!")
    })
    .cath(err => console.log(err))

  }

  function createService(project) {
    setMessage('')
    // last service
    const lastService = project.services[project.services.length - 1]

    lastService.id = uuidv4()

    const lastServiceCost = lastService.cost

    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

    // maximum value validation
    if (newCost > parseFloat(project.budget)) {
      setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
      setType('error')
      project.services.pop()
      return false
    }

    // add service cost to project cost total
    project.cost = newCost

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setServices(data.services)
        setShowServiceForm(!showServiceForm)
        setMessage('Serviço adicionado!')
        setType('success')
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
                {showServiceForm && (
                  <ServiceForm
                  handleSubmit={createService}
                  btnText="Adicionar Serviço"
                  projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
            {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))}
              {services.length === 0 && <p>Não há serviços cadastrados.</p>}
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