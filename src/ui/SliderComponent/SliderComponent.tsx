import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';

import { Stack } from '@mui/material';
import Slider, { SliderProps } from '@mui/material/Slider';

import styles from './SliderComponent.module.scss';

type SliderComponentProps = SliderProps & {
  label: string;
  handleChange: (value: number) => void;
  max: number;
  min: number;
  step: number;
};

export const SliderComponent = memo((props: SliderComponentProps) => {
  const { handleChange, ...otherProps } = props;
  const [input, setInput] = useState(props.value as number | string);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      return;
    }
    setInput(props.value as number);
  }, [props.value, isFocused]);

  useEffect(() => {
    const value = Number(input);

    if (Number.isNaN(value)) {
      return;
    }

    if (value >= props.max) {
      return handleChange(props.max);
    }

    if (value <= props.min) {
      return handleChange(props.min);
    }

    handleChange(value);
  }, [input, handleChange, props.max, props.min]);

  const onSliderChange = useCallback(
    (_: Event, value: number | number[]) => {
      handleChange(value as number);
    },
    [handleChange],
  );

  const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }, []);

  const onBlur = useCallback(() => {
    setInput(props.value as number);
    setIsFocused(false);
  }, [props.value]);

  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      <Stack justifyContent="space-between" flexDirection="row" mb="10px">
        <h4 className={styles.label}>{props.label}</h4>
        <input
          className={styles.input}
          value={input}
          onChange={onInputChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </Stack>
      <Slider
        {...otherProps}
        classes={{ rail: styles.rail }}
        onChange={onSliderChange}
      />
    </div>
  );
});

SliderComponent.displayName = 'SliderComponent';
