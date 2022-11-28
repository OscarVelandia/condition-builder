import { Counter } from '@features/conditions';
import { PokemonInformation } from '@features/pokemonInformation';
import styles from './App.module.scss';

export function App() {
  return (
    <div className={styles.container}>
      <main>
        <Counter />
        <PokemonInformation />
      </main>
    </div>
  );
}
