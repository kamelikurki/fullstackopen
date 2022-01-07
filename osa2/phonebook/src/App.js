import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Filter = ({newFilter, handleNewFilter}) =>
{
  return (
  <form>
    <div>
      Filter shown with: <input value={newFilter} onChange={handleNewFilter}/>
    </div>
  </form>
  )
}

const PersonsForm = ({addNumber, handleNewName, handleNewNumber,newNumber, newName}) =>
{
  return (
    <form onSubmit={addNumber}>
      <div>
        name: <input value={newName} onChange={handleNewName}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({personsToShow, deleteHandler}) => 
{
  return(
  personsToShow.map(person => 
    <PersonView key={person.id} name={person.name} number={person.number} id={person.id} deleteHandler={deleteHandler}/>
  )
  )
}

const PersonView = ({name,number,id, deleteHandler}) => 
{
  return ( <p> {name} {number} <button onClick={() => deleteHandler(id, name)}>delete</button> </p> )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [nextID, setNextID]  = useState(0)

  const hook = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
        if(persons.length !== 0 )
        {
          setNextID(persons.at(-1).id + 1)
        }     
      })
  }
  
  useEffect(hook, [])

  const addNumber = (event) => {
    event.preventDefault()

    const numberObject = {
      name: newName,
      number: newNumber,
      id: nextID
    }

    let currentID = -1

    let duplicate = false
    persons.forEach(function(item, index, array) {
      if(item.name === numberObject.name) 
      {
        duplicate = true
        currentID = item.id
      }
    })

    if(duplicate)
    {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`))
      {
        personService
        .update(currentID, numberObject)
        .then(response => {
          setPersons(persons.map(person => person.id !== currentID ? person : response.data))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`Updated number for ${newName}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          
          if(error.response.status == 404)
          {
            setPersons(persons.filter(p => p.id !== currentID))     
            setErrorMessage(`Failed to update number for ${newName}. The entry has been deleted elsewhere.`)
          }
          else
          {
            setErrorMessage(`Failed to update number for ${newName}`)
          }
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
    }
    else
    {
      personService
      .create(numberObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(`Added ${newName}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })        
      .catch(error => {
        setErrorMessage(`Failed to add ${newName}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })

    }
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDelete = (id, name) => 
  {
    if(window.confirm(`Really delete ${name}?`))
    {
      personService.deleteEntry(id).then(response =>     personService
        .getAll()
        .then(response => {
          setPersons(response.data)
          setNotificationMessage(`Deleted ${name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        }))
        .catch(error => {
          
          if(error.response.status == 404)
          {
            setErrorMessage(`${name} already deleted`)
            setPersons(persons.filter(p => p.id !== id))     
          }
          else
          {
            setErrorMessage(`Failed to delete ${name}`)
          }
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter newFilter={newFilter} handleNewFilter={handleNewFilter} />
      <h2>Add a new</h2>
      <PersonsForm addNumber={addNumber} handleNewName={handleNewName} handleNewNumber={handleNewNumber} newName={newName} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deleteHandler={handleDelete} />
    </div>
  )

}

export default App