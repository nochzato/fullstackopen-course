const Header = ({ name }) => <h2>{name}</h2>;

const Part = ({ part, exercises }) => (
  <p>
    {part} {exercises}
  </p>
);

const Content = ({ parts }) =>
  parts.map((part) => (
    <Part key={part.id} part={part.name} exercises={part.exercises} />
  ));

const Total = ({ parts }) => {
  const total = parts.reduce((p, c) => (p += c.exercises), 0);

  return <p>total of {total} exercises</p>;
};

const Course = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <div key={course.id}>
          <Header name={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      ))}
    </div>
  );
};

export default Course;
