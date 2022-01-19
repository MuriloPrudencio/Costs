import {useState, useEffect} from "react";

import Input from "../layout/input/Input";
import Select from "./selectForm/Select";
import Button from "../layout/button/Button";
import styles from "./ProjectForms.module.css";

function ProjectForms ({handleSubmit, btnText, projectData}) {
  const [project, setProject] = useState(projectData || {})
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCategories(data)
      })
  }, [])

  const submit = (e) => {
    e.preventDefault()
    handleSubmit(project)
  }

  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value })
  }

  function handleCategory(e) {
    setProject({
      ...project,
      category: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    })
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input 
      type="text" 
      text="Nome do projeto"
      name="name" 
      placeholder="Insira o nome do projeto"
      handleOnChange={handleChange}
      value={project.name ? project.name : ''}
      />
      <Input
      type="number" 
      text="Orçamento do Projeto" 
      name="budget" 
      placeholder="Insira o orçamento total"
      handleOnChange={handleChange}
      value={project.budget ? project.budget : ''}
      />
      <Select 
      name="category_id" 
      text="Selecione a categoria" 
      options={categories} 
      handleOnChange={handleCategory}
      value={project.category ? project.category.id : ''}
      />      
      <Button text={btnText}/>
    </form>
  )
}

export default ProjectForms;