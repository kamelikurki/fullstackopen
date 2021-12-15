import React, { useState } from 'react'

const StatisticLine  = ({label, value, unit}) => {

  return (<><td>{label}</td><td>{value}</td><td>{unit}</td></>)

}


const Statistics = (props) => {

  const good = props.good
  const neutral = props.neutral
  const bad  = props.bad 

  const total = bad+neutral+good
  let average = 0
  let positive  = 0
  if (total !== 0) 
  {
    average = (bad *-1 + good*1)/total
    positive  = (good) / total * 100  
  }

  if(total === 0)
  {
    return (
      <>
      <h1>
        Statistics
      </h1>
        No feeback given   
      </>
  )
  }
  else
  {
    return(
      <>
        <h1>
          Statistics
        </h1>
        <table>
          <tbody>
            <tr><StatisticLine  label="Goods:" value={props.good}/></tr>
            <tr><StatisticLine  label="Neutrals:" value={neutral}/></tr>
            <tr><StatisticLine  label="Bads:" value={bad}/></tr>
            <tr><StatisticLine  label="Total:" value={total} /></tr>
            <tr><StatisticLine  label="Average:" value={average} /></tr>
            <tr><StatisticLine  label="Positive:" value={positive} unit="%"/></tr>
          </tbody>
        </table>
      </>
    )
  }


}
const Button = ({text, onClick}) => {

  return(
      <button onClick={() => onClick(4)}>
        {text}
      </button>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodOne = () => (setGood(good+1))
  const justOne = () => (setNeutral(neutral+1))
  const badOne = () => (setBad(bad+1)) 

  return (
    <div>
      <h1>
        Give feedback
      </h1>
      <p>
        <Button text="good" onClick={goodOne}/>
        <Button text="neutral" onClick={justOne}/>
        <Button text="bad" onClick={badOne}/>
      </p>

      <Statistics good={good} bad={bad} neutral={neutral}/>

    </div>
  )
}

export default App
