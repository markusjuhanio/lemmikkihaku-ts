import React, { useEffect, useState } from 'react';
import { Box, Paper, Autocomplete, Grid, TextField, InputAdornment, Button, Fade, Typography, Switch, IconButton } from '@mui/material';
import { Close, Female, KeyboardArrowDown, KeyboardArrowUp, LocationOn, LooksOne, Loyalty, Pets } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import Separator from '../../../Separator';
import { PROVINCES, CITIES, SPECIES, RACES } from '../../../../data';
import { Age, FilterOption, FilterType, Gender } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setSearchProps } from '../../../../reducers/searchPropsReducer';
import { setMoreFilters } from '../../../../reducers/moreFiltersReducer';
import { isBoolean, isString } from '../../../../utils';

const Filters = () => {
  const searchProps = useAppSelector(state => state.searchProps);
  const moreFiltersVisible = useAppSelector(state => state.moreFilters.visible);
  const dispatch = useAppDispatch();

  const [text, setText] = useState<string | undefined>();

  useEffect(() => {
    setText(searchProps.filters.find(s => s.filterType === FilterType.Text)?.filterValue);
  }, [searchProps]);

  const getCitiesAndProvinces = (): FilterOption[] => {
    const list: FilterOption[] = [];
    for (const province of PROVINCES) {
      list.push({
        filterValue: province,
        filterType: FilterType.Province
      });
    }

    Object.values(CITIES).forEach(city => {
      for (const c of city) {
        list.push({
          filterValue: c,
          filterType: FilterType.City
        });
      }
    });

    return list.sort((a, b) => a.filterValue.localeCompare(b.filterValue));
  };

  const getRacesAndSpecies = (): FilterOption[] => {
    const list: FilterOption[] = [];

    for (const specie of SPECIES) {
      list.push({
        filterValue: specie,
        filterType: FilterType.Specie
      });
    }

    Object.values(RACES).forEach(race => {
      for (const r of race) {
        list.push({
          filterValue: r,
          filterType: FilterType.Race
        });
      }
    });

    return list.sort((a, b) => a.filterValue.localeCompare(b.filterValue));
  };

  const handleValueChange = (value: FilterOption | string | boolean | null, types: FilterType[]): void => {
    let filters: FilterOption[] = searchProps.filters;
    const type: FilterType = types[0];

    types.forEach(type => {
      filters = filters.filter(f => f.filterType !== type);
    });

    if (value) {
      filters.push(isString(value) || isBoolean(value) ? { filterType: type, filterValue: value.toString() } : value);
    }

    if (type === FilterType.Text) {
      if (isString(value)) {
        setText(value);
      } else {
        setText('');
      }
    }

    dispatch(setSearchProps({
      ...searchProps, filters: filters
    }));
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Paper>
            <Autocomplete
              key={searchProps.filters.find(s => s.filterType === FilterType.City || s.filterType === FilterType.Province)?.filterValue}
              isOptionEqualToValue={((option, value) => option === value)}
              disablePortal
              value={searchProps.filters.find(s => s.filterType === FilterType.City || s.filterType === FilterType.Province)}
              onChange={(event: React.SyntheticEvent<Element, Event>, newValue: FilterOption | null) => handleValueChange(newValue, [FilterType.City, FilterType.Province])}
              getOptionLabel={(option: FilterOption) => option.filterValue}
              groupBy={(option: FilterOption) => option.filterValue.charAt(0)}
              options={getCitiesAndProvinces()}
              noOptionsText='Ei valintoja.'
              renderInput={(params) => <TextField sx={{ p: 2 }} variant='standard'
                {...params}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color='secondary' />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  fullWidth: true
                }}
                placeholder='Sijainti esim. Uusimaa tai Helsinki'
              />}
            />
          </Paper>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Paper>
            <Autocomplete
              key={searchProps.filters.find(s => s.filterType === FilterType.Race || s.filterType === FilterType.Specie)?.filterValue}
              isOptionEqualToValue={((option, value) => option === value)}
              disablePortal
              value={searchProps.filters.find(s => s.filterType === FilterType.Race || s.filterType === FilterType.Specie)}
              onChange={(event: React.SyntheticEvent<Element, Event>, newValue: FilterOption | null) => handleValueChange(newValue, [FilterType.Race, FilterType.Specie])}
              getOptionLabel={(option: FilterOption) => option.filterValue}
              groupBy={(option: FilterOption) => option.filterValue.charAt(0)}
              options={getRacesAndSpecies()}
              noOptionsText='Ei valintoja.'
              renderInput={(params) => <TextField sx={{ p: 2 }} variant='standard'
                {...params}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Pets color='secondary' />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  fullWidth: true
                }}
                placeholder='Laji tai rotu esim. Kissat tai Bengali'
              />}
            />
          </Paper>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Separator
            button={
              <Button
                variant='outlined'
                onClick={() => dispatch(setMoreFilters({ visible: !moreFiltersVisible }))}
                color='secondary'
                size='small'
                endIcon={moreFiltersVisible
                  ? <KeyboardArrowUp />
                  : <KeyboardArrowDown />}>
                {moreFiltersVisible
                  ? 'Vähemmän hakuehtoja'
                  : 'Lisää hakuehtoja'}
              </Button>
            }
          />
        </Grid>
      </Grid>
      {moreFiltersVisible && (
        <Fade in={true}>
          <Grid container spacing={2} sx={{ mt: '0px' }}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Paper>
                <TextField fullWidth sx={{ p: 2 }} variant='standard'
                  value={text}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleValueChange(event.target.value, [FilterType.Text])}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color='secondary' />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      text && text.length > 0 && (
                        <InputAdornment position="start">
                          <IconButton onClick={() => handleValueChange(null, [FilterType.Text])}>
                            <Close color='secondary' />
                          </IconButton>
                        </InputAdornment>
                      )
                    ),
                    disableUnderline: true,
                    fullWidth: true
                  }}
                  placeholder='Kirjoita hakusana esim. pentuja'
                />
              </Paper>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={6}>
              <Paper>
                <Autocomplete
                  key={searchProps.filters.find(s => s.filterType === FilterType.Age)?.filterValue}
                  disablePortal
                  getOptionLabel={(option: string) => option}
                  options={Object.values(Age)}
                  noOptionsText='Ei valintoja.'
                  value={searchProps.filters.find(s => s.filterType === FilterType.Age)?.filterValue}
                  onChange={(event: React.SyntheticEvent<Element, Event>, newValue: string | null) => handleValueChange(newValue, [FilterType.Age])}
                  renderInput={(params) => <TextField sx={{ p: 2 }} variant='standard'
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LooksOne color='secondary' />
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                      fullWidth: true
                    }}
                    placeholder='Ikä'
                  />}
                />
              </Paper>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={6}>
              <Paper>
                <Autocomplete
                  key={searchProps.filters.find(s => s.filterType === FilterType.Gender)?.filterValue}
                  disablePortal
                  value={searchProps.filters.find(s => s.filterType === FilterType.Gender)?.filterValue}
                  options={Object.values(Gender)}
                  noOptionsText='Ei valintoja.'
                  getOptionLabel={(option: string) => option}
                  onChange={(event: React.SyntheticEvent<Element, Event>, newValue: string | null) => handleValueChange(newValue, [FilterType.Gender])}
                  renderInput={(params) => <TextField sx={{ p: 2 }} variant='standard'
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Female color='secondary' />
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                      fullWidth: true
                    }}
                    placeholder='Sukupuoli'
                  />}
                />
              </Paper>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={12}>
              <Paper>
                <Box sx={{
                  p: 2,
                  maxHeight: 65,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Loyalty color='secondary' />
                  <Typography sx={{ opacity: 0.5, ml: '5px' }}>
                    Rekisteröity
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Switch checked={Boolean(searchProps.filters.find(s => s.filterType === FilterType.Registered)?.filterValue)} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => handleValueChange(checked, [FilterType.Registered])} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      )}
    </Box >
  );
};

export default Filters;