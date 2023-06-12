import { useCallback, useMemo } from 'react';

import { SelectChangeEvent, Stack } from '@mui/material';

import {
  selectApiMaxTokens,
  selectApiModel,
  selectApiTemperature,
  selectApiTopK,
  selectApiTopP,
} from '@/redux/apiSettings/apiSettings.selectors';
import {
  setMaxTokens,
  setModel,
  setTemperature,
  setTopK,
  setTopP,
} from '@/redux/apiSettings/apiSettings.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SelectComponent } from '@/ui/SelectComponent';
import { SliderComponent } from '@/ui/SliderComponent';

import { modelSelectItems } from './apiSettings.constants';

import styles from './ApiSettings.module.scss';

export const ApiSettings = () => {
  const dispatch = useAppDispatch();
  const temperature = useAppSelector(selectApiTemperature);
  const model = useAppSelector(selectApiModel);
  const maxTokens = useAppSelector(selectApiMaxTokens);
  const topK = useAppSelector(selectApiTopK);
  const topP = useAppSelector(selectApiTopP);

  const onTemperatureChange = useCallback(
    (value: number) => {
      dispatch(setTemperature(value));
    },
    [dispatch],
  );

  const onMaxTokensChange = useCallback(
    (value: number) => {
      dispatch(setMaxTokens(value));
    },
    [dispatch],
  );

  const onTopPChange = useCallback(
    (value: number) => {
      let newValue = value;

      if (value === 0) {
        newValue = -1;
      }

      dispatch(setTopP(newValue));
    },
    [dispatch],
  );

  const onTopKChange = useCallback(
    (value: number) => {
      let newValue = value;

      if (value === 0) {
        newValue = -1;
      }

      dispatch(setTopK(newValue));
    },
    [dispatch],
  );

  const onModelChange = (event: SelectChangeEvent<unknown>) => {
    const newModel = event.target.value as string;

    dispatch(setModel(newModel));
  };

  const isModelWithMaxToken = useMemo(() => model.includes('100k'), [model]);

  return (
    <Stack gap="10px" useFlexGap className={styles.wrapper}>
      <h3 className={styles.title}>Settings</h3>
      <SelectComponent
        label="Model"
        onChange={onModelChange}
        selectItems={modelSelectItems}
        value={model}
      />
      <SliderComponent
        label="Max tokens"
        value={maxTokens}
        handleChange={onMaxTokensChange}
        max={isModelWithMaxToken ? 100000 : 8000}
        min={1}
        step={1}
      />
      <SliderComponent
        label="Temperature"
        value={temperature}
        handleChange={onTemperatureChange}
        max={1}
        min={0}
        step={0.1}
      />
      <SliderComponent
        label="Top K"
        value={topK}
        handleChange={onTopKChange}
        max={10}
        min={0}
        step={1}
      />
      <SliderComponent
        label="Top P"
        value={topP}
        handleChange={onTopPChange}
        max={1}
        min={0}
        step={0.1}
      />
    </Stack>
  );
};
