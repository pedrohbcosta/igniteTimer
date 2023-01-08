import { Play } from 'phosphor-react';
import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountInput, 
  Separetor, 
  StartCountdownButton,
  TaskInput
} from './styles';

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            placeholder='Dê um nome para o seu projeto'
          />
          
          <span>durante</span>
          
          <label htmlFor="minutesAmount"></label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder='00' 
          />

          <span>Minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separetor>:</Separetor>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
