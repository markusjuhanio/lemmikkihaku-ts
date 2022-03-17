import { Box, TextField, Grid, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl, Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CITIES, PROVINCES, RACES } from '../../../../data';
import { useAppDispatch } from '../../../../hooks';
import { setNewListing } from '../../../../reducers/newListingReducer';
import { Category, Specie, Age, Gender, ListingType, ListingEntry } from '../../../../types';

interface DetailsProps {
  newListing: ListingEntry
}

const Details = (props: DetailsProps) => {
  const { newListing } = props;

  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>(newListing.title);
  const [category, setCategory] = useState<Category | string>(newListing.category);
  const [specie, setSpecie] = useState<Specie | string>(newListing.specie);
  const [race, setRace] = useState<string>(newListing.race);
  const [registrationNumber, setRegistrationNumber] = useState<string>(newListing.registrationNumber);
  const [age, setAge] = useState<Age | string>(newListing.age);
  const [gender, setGender] = useState<Gender | string>(newListing.gender);
  const [province, setProvince] = useState<string>(newListing.province);
  const [city, setCity] = useState<string>(newListing.city);
  const [price, setPrice] = useState<number | string>(newListing.price);
  const [shortDescription, setShortDescription] = useState<string>(newListing.shortDescription);
  const [fullDescription, setFullDescription] = useState<string>(newListing.fullDescription);

  useEffect(() => {
    handleSave();
  }, [title, category, specie, race, registrationNumber, age, gender, province, city, price, shortDescription, fullDescription]);

  const handleSave = (): void => {
    dispatch(setNewListing({
      ...newListing,
      title: title,
      category: category as Category,
      specie: specie as Specie,
      race: race,
      registrationNumber: registrationNumber,
      age: age as Age,
      gender: gender as Gender,
      province: province,
      city: city,
      price: price,
      shortDescription: shortDescription,
      fullDescription: fullDescription,
      type: ListingType.Animal
    }));
  };

  const getRacesBySpecie = (): string[] => {
    switch (specie as Specie) {
    case Specie.Birds:
      return RACES.birds;
    case Specie.Cats:
      return RACES.cats;
    case Specie.Dogs:
      return RACES.dogs;
    case Specie.Fishes:
      return RACES.fishes;
    case Specie.Grawers:
      return RACES.gnawers;
    case Specie.Others:
      return RACES.others;
    case Specie.Reptiles:
      return RACES.reptiles;
    default:
      return [];
    }
  };

  const getCitiesByProvince = (): string[] => {
    switch (province) {
    case 'Ahvenanmaa':
      return CITIES.ahvenanmaa;
    case 'Etelä-Karjala':
      return CITIES.etela_karjala;
    case 'Etelä-Pohjanmaa':
      return CITIES.etela_pohjanmaa;
    case 'Etelä-Savo':
      return CITIES.etela_savo;
    case 'Kainuu':
      return CITIES.kainuu;
    case 'Kanta-Häme':
      return CITIES.kanta_hame;
    case 'Keski-Pohjanmaa':
      return CITIES.keski_pohjanmaa;
    case 'Keski-Suomi':
      return CITIES.keskisuomi;
    case 'Kymenlaakso':
      return CITIES.kymenlaakso;
    case 'Lappi':
      return CITIES.lappi;
    case 'Päijät-Häme':
      return CITIES.paijat_hame;
    case 'Pirkanmaa':
      return CITIES.pirkanmaa;
    case 'Pohjanmaa':
      return CITIES.pohjanmaa;
    case 'Pohjois-Karjala':
      return CITIES.pohjois_karjala;
    case 'Pohjois-Pohjanmaa':
      return CITIES.pohjois_pohjanmaa;
    case 'Pohjois-Savo':
      return CITIES.pohjois_savo;
    case 'Satakunta':
      return CITIES.satakunta;
    case 'Uusimaa':
      return CITIES.uusimaa;
    case 'Varsinais-Suomi':
      return CITIES.varsinais_suomi;
    default:
      return [];
    }
  };

  const handleSpecieChange = (value: string | null): void => {
    setSpecie(value === null ? '' : value);
    setRace('');
  };

  const handleProvinceChange = (value: string | null): void => {
    setProvince(value === null ? '' : value);
    setCity('');
  };

  const handleCategoryChange = (value: string): void => {
    setCategory(value);
    if (value === Category.Give) {
      setPrice(-1);
    } else {
      setPrice('');
    }
  };

  const handlePriceChange = (value: string): void => {
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
      setPrice(value);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            value={title}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setTitle(event.target.value)}
            fullWidth
            helperText='Maksimipituus 40 merkkiä.'
            label='Otsikko *'
            inputProps={{
              maxLength: 40
            }}
          />
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <FormControl>
            <FormLabel>Kategoria *</FormLabel>
            <RadioGroup value={category} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleCategoryChange(event.target.value)} row>
              {Object.values(Category).map((category, i) =>
                category !== Category.All && (
                  <FormControlLabel
                    key={i}
                    value={category}
                    control={<Radio />}
                    label={category}
                  />
                )
              )}
            </RadioGroup>
          </FormControl>
        </Grid>

        {category != Category.Buy && (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              value={registrationNumber}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setRegistrationNumber(event.target.value)}
              fullWidth
              helperText='Valinnainen.'
              label='Lemmikin rekisteritunnus'
              inputProps={{
                maxLength: 50
              }}
            />
          </Grid>
        )}

        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Autocomplete
            noOptionsText='Ei valintoja.'
            value={specie}
            onChange={(_event: React.SyntheticEvent<Element, Event>, value: string | null) => handleSpecieChange(value)}
            options={Object.values(Specie)}
            renderInput={(params) => <TextField {...params} label="Laji *" />}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Autocomplete
            noOptionsText='Ei valintoja.'
            value={race}
            onChange={(_event: React.SyntheticEvent<Element, Event>, value: string | null) => setRace(value === null ? '' : value)}
            options={getRacesBySpecie().sort((a: string, b: string) => a.localeCompare(b))}
            renderInput={(params) => <TextField {...params} label="Rotu *" />}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Autocomplete
            value={age}
            onChange={(_event: React.SyntheticEvent<Element, Event>, value: string | null) => setAge(value === null ? '' : value)}
            noOptionsText='Ei valintoja.'
            options={Object.values(Age)}
            renderInput={(params) => <TextField {...params} label="Ikä *" />}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Autocomplete
            value={gender}
            onChange={(_event: React.SyntheticEvent<Element, Event>, value: string | null) => setGender(value === null ? '' : value)}
            noOptionsText='Ei valintoja.'
            options={Object.values(Gender)}
            renderInput={(params) => <TextField {...params} label="Sukupuoli *" />}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Autocomplete
            value={province}
            onChange={(_event: React.SyntheticEvent<Element, Event>, value: string | null) => handleProvinceChange(value)}
            noOptionsText='Ei valintoja.'
            options={PROVINCES.map(province => province).sort((a: string, b: string) => a.localeCompare(b))}
            renderInput={(params) => <TextField {...params} label="Maakunta *" />}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Autocomplete
            value={city}
            onChange={(_event: React.SyntheticEvent<Element, Event>, value: string | null) => setCity(value === null ? '' : value)}
            noOptionsText='Ei valintoja.'
            options={getCitiesByProvince().sort((a: string, b: string) => a.localeCompare(b))}
            renderInput={(params) => <TextField {...params} label="Kaupunki *" />}
          />
        </Grid>
        <Grid sx={{ display: category && category !== Category.Give ? 'block' : 'none' }} item lg={12} md={12} sm={12} xs={12}>
          <TextField
            value={price}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handlePriceChange(event.target.value)}
            fullWidth
            label={category === Category.Buy ? 'Hintatarjous *' : 'Hinta *'}
            inputProps={{
              maxLength: 5
            }}
          />
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            value={shortDescription}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setShortDescription(event.target.value)}
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            helperText='Maksimipituus 200 merkkiä.'
            label='Lyhyt kuvaus *'
            inputProps={{
              maxLength: 200
            }}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            value={fullDescription}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setFullDescription(event.target.value)}
            fullWidth
            multiline
            minRows={7}
            maxRows={15}
            helperText='Maksimipituus 2500 merkkiä.'
            inputProps={{
              maxLength: 2500
            }}
            label='Koko kuvaus *'
          />
        </Grid>
      </Grid>

    </Box>
  );
};

export default Details;