"use client";
import { useRef, useEffect, useState } from "react";

export function useCounter( params ) {

  let { from=0, to=0, interval = 1000, onEnd = () => { }, onTick = () => {} } = params || {};

  const [value, setValue] = useState();
  const [run, setRun] = useState();
  const kfrom = useRef(from || 0);
  const kto = useRef(to || 0);
  const currentValue = useRef(from || 0);
  const startCounter = useRef(false);
  const stopCounter  = useRef(false);
  const resetCounter = useRef(false);
  const pauseCounter = useRef(false);
  const isCounting   = useRef(false);
  const isPaused     = useRef(false);
  const isStopped    = useRef(false);
  const ended        = useRef(false);

  useEffect(() => {
    if (startCounter.current) {
      const timer = setInterval(() => {
        if (resetCounter.current) {
          resetCounter.current = false;
          startCounter.current = false;
          clearInterval(timer);
          return;
        }

        if (pauseCounter.current) {
          isCounting.current = false;
          isPaused.current = true;
          isStopped.current = false;
          ended.current = false;
          return;
        }

        if(    (kfrom.current > kto.current && currentValue.current <= kto.current)
            || (kfrom.current < kto.current && currentValue.current >= kto.current) ) {

          isCounting.current = false;
          isPaused.current   = false;
          isStopped.current  = true;
          ended.current      = true;
          startCounter.current = false;
          setRun(Math.random());
          onEnd();
          clearInterval(timer);
          return;

        }

        currentValue.current += kfrom.current > kto.current ? -1 : 1;
        isCounting.current = true;
        isPaused.current = false;
        isStopped.current = false;
        setValue(currentValue.current);
        onTick(currentValue.current);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [run]);

  function start(f, t) {
    kfrom.current = f || kfrom.current;
    kto.current = t || kto.current;
    currentValue.current = kfrom.current;
    startCounter.current = true;
    isCounting.current = true;
    isPaused.current = false;
    isStopped.current = false;
    ended.current = false;
    setValue(currentValue.current);
    setRun(Math.random());
  };

  const stop = () => {
    stopCounter.current = true;
    setRun(Math.random());
  };

  const reset = () => {
    resetCounter.current = true;
    setRun(Math.random());
  };

  return ({
    value: currentValue.current,
    isCounting: isCounting.current,
    isPaused: isPaused.current,
    isStopped: isStopped.current,
    ended: ended.current,
    start: (f, t)=>start(f, t),
    stop: () => stop(),
    reset: () => reset(),
  });
}
