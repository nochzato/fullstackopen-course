import { useState, useEffect } from "react";
import personsService from "./services/persons";

const Notification = ({ message, isError }) => {
  if (message === "") {
    return null;
  }

  if (isError) {
    const notificationsStyle = {
      color: "red",
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      fontSize: 20,
      background: "lightgrey",
    };

    return <div style={notificationsStyle}>{message}</div>;
  } else {
    const notificationsStyle = {
      color: "green",
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      fontSize: 20,
      background: "lightgrey",
    };

    return <div style={notificationsStyle}>{message}</div>;
  }
};

const Filter = ({ onChange }) => (
  <p>
    filter shown with
    <input onChange={onChange}></input>
  </p>
);

const PersonForm = ({
  newName,
  nameTracker,
  newNumber,
  numberTracker,
  addPerson,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={nameTracker} />
      </div>
      <div>
        number: <input value={newNumber} onChange={numberTracker} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, deletePerson }) =>
  persons.map((person) => (
    <p key={person.id}>
      {person.name} {person.number}
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </p>
  ));

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const nameTracker = (event) => {
    setNewName(event.target.value);
  };

  const numberTracker = (event) => {
    setNewNumber(event.target.value);
  };

  const filterTracker = (event) => {
    setNewFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      const person = persons.filter((person) => person.name === newName)[0];

      if (
        window.confirm(
          `${person.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const newPerson = { ...person, number: newNumber };

        personsService
          .updateObject(person.id, newPerson)
          .then((returnedPerson) =>
            setPersons(
              persons.map((person) =>
                person.id !== newPerson.id ? person : returnedPerson
              )
            )
          )
          .catch((error) => {
            setIsError(true);
            setMessage(
              `${newPerson.name} has already been removed from server`
            );

            setTimeout(() => {
              setMessage("");
              setIsError(false);
            }, 2500);
          });

        setMessage(`${newPerson.name} updated`);

        setTimeout(() => {
          setMessage("");
        }, 2500);
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personsService
        .createObject(newPerson)
        .then((returnedPerson) => setPersons(persons.concat(returnedPerson)));

      setMessage(`${newPerson.name} was added to the phonebook`);

      setTimeout(() => {
        setMessage("");
      }, 2500);
    }
  };

  const deletePerson = (id) => {
    if (
      window.confirm(
        `Delete ${persons.filter((person) => person.id === id)[0].name}?`
      )
    ) {
      personsService.deleteObject(id);
      setPersons(persons.filter((person) => person.id !== id));
    }
  };

  const filterPersons = () => {
    return persons.filter((person) =>
      person.name.toLowerCase().includes(newFilter)
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={filterTracker} />
      <Notification message={message} isError={isError} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        nameTracker={nameTracker}
        newNumber={newNumber}
        numberTracker={numberTracker}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filterPersons()} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
