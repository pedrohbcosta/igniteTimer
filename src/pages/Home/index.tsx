import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns'

import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountInput, 
  Separetor, 
  StartCountdownButton,
  TaskInput
} from './styles';


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
      .number()
      .min(5, 'O ciclo precisa ser de no minimo 5 minutos')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
  });

  type NewCiclyFormData = zod.infer<typeof newCycleFormValidationSchema>

  interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
  }

export function Home() {
  const [ cycles, setCycles ] = useState<Cycle[]>([])
  const [ activeCycleId, setActiveCycleId ] = useState<string | null>(null)
  const [ amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  
  const { register, handleSubmit, watch, reset } = useForm<NewCiclyFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  useEffect(() => {
    if (activeCycle) {
      setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
    }
  }, [activeCycle])

  function handleCreateNewCycle(data: NewCiclyFormData) {
    const id = String(new Date().getTime());
    
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)

    reset()
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 //if active cycle is active, the cycle will be multiplier for 60. If not, will be zero.
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 //if active cycle is active, we`ll use the total of seconds above less the seconds already passed. If not, will be zero.

  const minutesAmount = Math.floor(currentSeconds / 60) //we round down the broken minutes
  const secondsAmount = currentSeconds % 60 //we get how many seconds are left in the division above

  const minutes = String(minutesAmount).padStart(2, '0') //we convert minutesAmount to String and use .padStart to say that we want 2 characters and when we have only one, we want to fill with zero.
  const seconds = String(secondsAmount).padStart(2, '0')

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
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separetor>:</Separetor>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
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
