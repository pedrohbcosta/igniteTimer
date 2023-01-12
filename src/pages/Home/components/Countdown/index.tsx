import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../..";
import { CountdownContainer, Separetor } from "./styles";

export function Countdown() {
  const { 
    activeCycle, 
    activeCycleId, 
    amountSecondsPassed,
    markCurrentCycleAsFinished, 
    setSecondsPassed
} = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 //if active cycle is active, the cycle will be multiplier for 60. If not, will be zero.

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

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const SecondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate
        )

        if (SecondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(SecondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])

  return (
    <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separetor>:</Separetor>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
  )
}