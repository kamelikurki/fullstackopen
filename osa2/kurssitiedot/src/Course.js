import React from 'react';

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Total = ({ course }) => {
  const total = course.parts.reduce((a, b) => (a + b.exercises), 0)
  return (
    <p><b>Total of {total} exercises</b></p>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}


const Content = ({ course }) => {
  // <Part part={party} 
  let output = course.parts.map(party => <Part part={party} key={party.id} />)
  return (
    <div>
      {output}
    </div>
  )
}

export default Course