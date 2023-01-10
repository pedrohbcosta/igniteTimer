import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

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
  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    MinutesAmountInput: zod
      .number()
      .min(5, 'O ciclo precisa ser de no minimo 5 minutos')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
  });

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(newCycleFormValidationSchema),
  })

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
