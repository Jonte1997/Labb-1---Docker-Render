import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [view, setView] = useState('list');
  const [title, setTitle] = useState('Workout Logger');
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [workouts, setWorkouts] = useState(() => {
    try {
      const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
      return savedWorkouts.map((workout) => workout.sets ? workout : {
        id: workout.id,
        name: workout.exercise,
        date: new Date(workout.id).toISOString(),
        sets: [{ ...workout }]
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch('/api/config')
      .then((response) => response.json())
      .then((config) => setTitle(config.title))
      .catch(() => console.error('Kunde inte hämta titeln'));
  }, []);

  const selectedWorkout = workouts.find((workout) => workout.id === selectedId);

  function updateWorkouts(updatedWorkouts) {
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setWorkouts(updatedWorkouts);
  }

  function createWorkout(event) {
    event.preventDefault();
    if (!name.trim()) return;

    const workout = {
      id: crypto.randomUUID(),
      name: name.trim(),
      date: new Date().toISOString(),
      sets: []
    };
    updateWorkouts([...workouts, workout]);
    setName('');
    setSelectedId(workout.id);
    setMessage('');
    setView('detail');
  }

  function saveSet(event) {
    event.preventDefault();
    if (!exercise.trim() || weight === '' || Number(weight) < 0 ||
        !Number.isInteger(Number(repetitions)) || Number(repetitions) < 1) {
      setMessage('Fyll i en övning, en giltig vikt och minst en repetition.');
      return;
    }

    const newSet = {
      id: crypto.randomUUID(), exercise, weight: Number(weight), repetitions: Number(repetitions), description: description.trim()
    };
    const updatedWorkouts = workouts.map((workout) => workout.id === selectedId
      ? { ...workout, sets: [...workout.sets, newSet] }
      : workout);
    updateWorkouts(updatedWorkouts);
    setExercise('');
    setWeight('');
    setRepetitions('');
    setDescription('');
    setMessage('Setet har sparats.');
  }

  function deleteWorkout(id) {
    const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
    updateWorkouts(updatedWorkouts);
  }

  function deleteSet(id) {
    const updatedWorkouts = workouts.map((workout) => workout.id === selectedId
      ? { ...workout, sets: workout.sets.filter((set) => set.id !== id) }
      : workout);
    updateWorkouts(updatedWorkouts);
  }

  return (
    <main>
      <h1>{title}</h1>
      <nav aria-label="Navigering">
        <button type="button" onClick={() => setView('list')}>Mina träningspass</button>
      </nav>
      {view === 'detail' && selectedWorkout ? (
        <section>
          <h2>{selectedWorkout.name}</h2>
          <p>{new Date(selectedWorkout.date).toLocaleDateString('sv-SE')}</p>
          <h3>Registrerade set</h3>
          {selectedWorkout.sets.length === 0 ? <p>Inga set har lagts till än.</p> : (
            <ul>
              {selectedWorkout.sets.map((set) => (
                <li key={set.id}>
                  <span>
                    {set.exercise} – {set.weight} kg – {set.repetitions} repetitioner
                    {set.description && <p>{set.description}</p>}
                  </span>
                  <button type="button" onClick={() => deleteSet(set.id)}>Ta bort set</button>
                </li>
              ))}
            </ul>
          )}
          <h3>Lägg till set</h3>
          <form onSubmit={saveSet}>
            <label htmlFor="exercise">Övning</label>
            <select id="exercise" value={exercise} onChange={(event) => setExercise(event.target.value)} required>
              <option value="">Välj övning</option>
              <option>Bench Press</option>
              <option>Incline Bench Press</option>
              <option>Dumbbell Bench Press</option>
              <option>Incline Dumbbell Press</option>
              <option>Overhead Press</option>
              <option>Dumbbell Shoulder Press</option>
              <option>Lateral Raise</option>
              <option>Front Raise</option>
              <option>Chest Fly</option>
              <option>Triceps Pushdown</option>
              <option>Triceps Extension</option>
              <option>Biceps Curl</option>
              <option>Hammer Curl</option>
              <option>Deadlift</option>
              <option>Romanian Deadlift</option>
              <option>Squat</option>
              <option>Front Squat</option>
              <option>Leg Press</option>
              <option>Leg Extension</option>
              <option>Leg Curl</option>
              <option>Bulgarian Split Squat</option>
              <option>Calf Raise</option>
              <option>Hyperextension</option>
              <option>Barbell Row</option>
              <option>Dumbbell Row</option>
              <option>Seated Cable Row</option>
              <option>Lat Pulldown</option>
              <option>Pull Up</option>
              <option>Chin Up</option>
              <option>Face Pull</option>
            </select>
            <label htmlFor="weight">Vikt (kg)</label>
            <input id="weight" type="number" min="0" step="any" value={weight} onChange={(event) => setWeight(event.target.value)} required />
            <label htmlFor="repetitions">Repetitioner</label>
            <input id="repetitions" type="number" min="1" step="1" value={repetitions} onChange={(event) => setRepetitions(event.target.value)} required />
            <label htmlFor="description">Beskriv ditt set</label>
            <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
            <button type="submit">Spara set</button>
          </form>
          <p role="status">{message}</p>
        </section>
      ) : (
        <section>
          <h2>Mina träningspass</h2>
          <form onSubmit={createWorkout}>
            <label htmlFor="name">Namn på träningspass</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            <button type="submit">Skapa träningspass</button>
          </form>
          {workouts.length === 0 ? <p>Du har inga sparade träningspass.</p> : (
            <ul>
              {workouts.map((workout) => (
                <li key={workout.id}>
                  <button type="button" onClick={() => { setSelectedId(workout.id); setMessage(''); setView('detail'); }}>
                    {workout.name} – {new Date(workout.date).toLocaleDateString('sv-SE')}
                  </button>
                  <button type="button" onClick={() => deleteWorkout(workout.id)}>Ta bort träningspass</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
