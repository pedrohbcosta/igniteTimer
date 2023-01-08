import { Play } from 'phosphor-react';
import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  Separetor 
} from './styles';

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <input id="task" />

          <label htmlFor="minutesAmount"></label>
          <input type="number" id="minutesAmount" />

          <span>Minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separetor>:</Separetor>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <button>
          <Play size={24} />
          Começar
        </button>
      </form>
    </HomeContainer>
  )
}
