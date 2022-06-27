import { useState } from "react";

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(7).fill(0));

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const nextAnecdote = () => {
    setSelected(getRandomInt(0, 7));
  };

  const addPoint = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
  };

  const getIndexOfMostVoted = () => points.indexOf(Math.max(...points));

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button text="next anecdote" onClick={nextAnecdote} />
      <Button text="vote" onClick={addPoint} />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[getIndexOfMostVoted()]}</p>
    </div>
  );
};

export default App;
