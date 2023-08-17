import "./App.css";
import { KanbanBoard } from "./components/KanbanBoard";

function App() {
  return (
    <main className='h-screen flex flex-col justify-center items-center min-h-screen bg-cover bg-[center_center] bg-repeat bg-[image:var(--background-main)] p-24'>
      <div className='text-[0.85rem] max-w-[1100px] z-[2]'>
        <KanbanBoard />
      </div>
    </main>
  );
}

export default App;
