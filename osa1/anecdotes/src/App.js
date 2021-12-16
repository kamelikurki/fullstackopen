import React, { useState } from 'react'



const Anecdote = ({title, dote, voteCount}) =>
{
  return(
  <div>
    <h1>
      {title}
    </h1>
    <p>
      {dote}
    </p>
    <p>
    has {voteCount} votes
    </p>

  </div>
  )
}


const App = () => {

  const getRandomInt = (max) => Math.floor(Math.random() * max)
  

  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const selectNewAnecdote = () => 
  {
    const newValue = getRandomInt(anecdotes.length)
    setSelected(newValue)
  }
   
  const giveVote = () => 
  {
    const copy  = [...voted]
    copy[selected] += 1
    setVoted(copy)
  }

  const [selected, setSelected] = useState(0)
  const [voted, setVoted] = useState(Array(anecdotes.length).fill(0))

  const mostVoteIdx = voted.indexOf(Math.max(...voted));

  return (
    <div>
      <Anecdote title="Anecdote of the day" dote={anecdotes[selected]} voteCount={voted[selected]} />
      <p>
        <button onClick = {() => giveVote()}>
          Vote!
        </button>
        <button onClick = {() => selectNewAnecdote()}>
          Next anecdote
        </button>
      </p>
      <Anecdote title="Anecdote with most votes" dote={anecdotes[mostVoteIdx]} voteCount={voted[mostVoteIdx]} />
    </div>
  )
}

export default App