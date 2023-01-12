import { HandPalm, Play } from 'phosphor-react';
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
  StopCountdownButton,
  TaskInput
} from './styles';


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
      .number()
      .min(1, 'O ciclo precisa ser de no minimo 5 minutos')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
  });

  type NewCiclyFormData = zod.infer<typeof newCycleFormValidationSchema>

  interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
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
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 //if active cycle is active, the cycle will be multiplier for 60. If not, will be zero.

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const SecondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate
        )

        if (SecondsDifference >= totalSeconds) {
          setCycles((state) => state.map(cycle => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            })
          )
          
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(SecondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

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
    setAmountSecondsPassed(0)

    reset()
  }

  function handleInterruptCycle() {
    setCycles((state)=> state.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      })
    )
    setActiveCycleId(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 //if active cycle is active, we`ll use the total of seconds above less the seconds already passed. If not, will be zero.

  const minutesAmount = Math.floor(currentSeconds / 60) //we round down the broken minutes
  const secondsAmount = currentSeconds % 60 //we get how many seconds are left in the division above

  const minutes = String(minutesAmount).padStart(2, '0') //we convert minutesAmount to String and use .padStart to say that we want 2 characters and when we have only one, we want to fill with zero.
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes} : ${seconds}`
    }
  }, [minutes, seconds, activeCycle])

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
            disabled={!!activeCycle}
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
            min={1}
            max={60}
            disabled={!!activeCycle}
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

        { activeCycle ? (
          <StopCountdownButton 
          onClick={handleInterruptCycle}
          type='button'>
          <HandPalm size={24} />
          Interromper
        </StopCountdownButton>
        ) : (
          <StartCountdownButton 
          type='submit'
          disabled={isSubmitDesabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )}

        
      </form>
    </HomeContainer>
  )
}
