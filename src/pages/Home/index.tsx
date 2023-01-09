import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';

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

  const { register, handleSubmit, watch } = useForm()

  function handleCreateNewCycle(data: any) {
    console.log(data)
  }

  const task = watch('task')
  const isSubmitDesabled = !task

  return (
    <HomeContainer>
      <form onSubmit ={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            list="task-sugestions" 
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-sugestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
          </datalist>
          
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder='00' 
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true})}
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

        <StartCountdownButton 
          type='submit'
          disabled={isSubmitDesabled}
        >
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
