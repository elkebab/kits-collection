import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  TextField,
  makeStyles,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  DialogActions,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as Yup from "yup";

import { createKit, updateKit } from "../api";

const MAX_IMG_SIZE = 800 * 800;

const useStyles = makeStyles({
  field: {
    marginTop: "0.8rem",
  },
  error: {
    color: "red",
  },
});

const newKitValues = {
  country: "",
  club: "",
  version: "",
  longSleeve: false,
  year: "",
  playerName: "",
  playerNumber: "",
  signed: false,
  manufacturer: "",
  imageUrl: "",
  owner: localStorage.getItem("owner") || "",
  description: "",
};

const errorMsg = {
  required: "Påkrevd",
  invalid: "Ugyldig format",
  kitNumber: "Må være mellom 1 og 99",
};

const validationSchema = Yup.object().shape({
  country: Yup.string().required(errorMsg.required),
  club: Yup.string(),
  version: Yup.string().required(errorMsg.required),
  longSleeve: Yup.bool(),
  year: Yup.string()
    .test("format", "Ugyldig format", value => {
      // Check that year is on format YYYY or YYYY/YYYY
      const years = value && value.split("/");
      return (
        years &&
        years.length <= 2 &&
        !years.some(year => year.length !== 4 || isNaN(parseInt(year)))
      );
    })
    .required(errorMsg.required),
  playerName: Yup.string(),
  playerNumber: Yup.number()
    .min(1, errorMsg.kitNumber)
    .max(99, errorMsg.kitNumber),
  signed: Yup.bool(),
  manufacturer: Yup.string().required(errorMsg.required),
  imageUrl: Yup.string().url(errorMsg.invalid),
  owner: Yup.string().required(errorMsg.required),
  description: Yup.string(),
});

function NewKitForm({ extractedValues, closeModal, selectedKit }) {
  const classes = useStyles();

  const initialValues = selectedKit ? selectedKit : newKitValues;

  const submitKit = async values => {
    const kit = {
      ...values,
      playerNumber: `${values.playerNumber}`,
    };

    // Update kit if it has an ID. Create new kit otherwise.
    const response = kit.id ? await updateKit(kit) : await createKit(kit);
    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={submitKit}
    >
      {({ setFieldValue }) => (
        <Form className={classes.form}>
          <Field name="owner" type="text">
            {({ field }) => (
              <>
                <Autocomplete
                  options={extractedValues.allOwners}
                  freeSolo
                  defaultValue={field.value}
                  onChange={(_, value) => {
                    setFieldValue(field.name, value);
                    if (value) {
                      localStorage.setItem("owner", value);
                    } else {
                      localStorage.removeItem("owner");
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      type="text"
                      label="Eier"
                      fullWidth
                      required
                      {...params}
                      {...field}
                    />
                  )}
                />

                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </>
            )}
          </Field>

          <Field name="country">
            {({ field }) => (
              <div className={classes.field}>
                <Autocomplete
                  options={extractedValues.allCountries}
                  freeSolo
                  onChange={(_, value) => setFieldValue(field.name, value)}
                  defaultValue={field.value}
                  renderInput={params => (
                    <TextField
                      type="text"
                      label="Land"
                      fullWidth
                      required
                      {...params}
                      {...field}
                    />
                  )}
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </div>
            )}
          </Field>

          <Field name="club">
            {({ field }) => (
              <div className={classes.field}>
                <Autocomplete
                  options={extractedValues.allClubs}
                  freeSolo
                  onChange={(_, value) => setFieldValue(field.name, value)}
                  defaultValue={field.value}
                  renderInput={params => (
                    <TextField
                      type="text"
                      label="Lag"
                      fullWidth
                      {...field}
                      {...params}
                    />
                  )}
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </div>
            )}
          </Field>

          <Field name="version">
            {({ field }) => (
              <div className={classes.field}>
                <Autocomplete
                  options={extractedValues.allVersions}
                  freeSolo
                  onChange={(_, value) => setFieldValue(field.name, value)}
                  defaultValue={field.value}
                  renderInput={params => (
                    <TextField
                      type="text"
                      label="Versjon"
                      required
                      fullWidth
                      {...params}
                      {...field}
                    />
                  )}
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </div>
            )}
          </Field>

          <Field name="year">
            {({ field }) => (
              <div className={classes.field}>
                <TextField
                  type="text"
                  label="År"
                  required
                  {...field}
                  helperText='Eksempel: "2015" eller "2017/2018"'
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </div>
            )}
          </Field>

          <Field name="manufacturer">
            {({ field }) => (
              <div className={classes.field}>
                <Autocomplete
                  options={extractedValues.allManufacturers}
                  freeSolo
                  onChange={(_, value) => setFieldValue(field.name, value)}
                  defaultValue={field.value}
                  renderInput={params => (
                    <TextField
                      type="text"
                      label="Leverandør"
                      fullWidth
                      required
                      {...field}
                      {...params}
                    />
                  )}
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </div>
            )}
          </Field>

          <Field name="playerName">
            {({ field }) => (
              <div className={classes.field}>
                <TextField
                  type="text"
                  label="Spillernavn"
                  fullWidth
                  {...field}
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </div>
            )}
          </Field>

          <Field name="playerNumber">
            {({ field }) => (
              <div className={classes.field}>
                <TextField
                  type="number"
                  label="Spillernummer"
                  inputProps={{
                    min: "1",
                    max: "99",
                  }}
                  {...field}
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
              </div>
            )}
          </Field>

          <Field name="signed">
            {({ field: { name, value }, form: { setFieldValue } }) => (
              <div className={classes.field}>
                <FormLabel component="legend">Signert</FormLabel>
                <RadioGroup
                  row
                  value={value ? "true" : "false"}
                  onChange={event =>
                    setFieldValue(name, event.target.value === "true")
                  }
                >
                  <FormControlLabel
                    control={<Radio color="primary" value="false" />}
                    label="Nei"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={<Radio color="primary" value="true" />}
                    label="Ja"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </div>
            )}
          </Field>

          <Field name="longSleeve">
            {({ field: { name, value }, form: { setFieldValue } }) => (
              <div className={classes.field}>
                <FormLabel component="legend">Ermer</FormLabel>
                <RadioGroup
                  value={value ? "true" : "false"}
                  onChange={event =>
                    setFieldValue(name, event.target.value === "true")
                  }
                  row
                >
                  <FormControlLabel
                    control={<Radio color="primary" value="false" />}
                    label="Kort"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={<Radio color="primary" value="true" />}
                    label="Lang"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </div>
            )}
          </Field>

          <Field name="description">
            {({ field }) => (
              <TextField
                type="text"
                label="Beskrivelse"
                fullWidth
                multiline
                {...field}
              />
            )}
          </Field>

          <Field name="imageUrl">
            {({ field, form: { setFieldError }, meta: { error } }) => (
              <div className={classes.field}>
                <TextField
                  type="text"
                  label="Bilde-URL"
                  fullWidth
                  multiline
                  {...field}
                />
                <ErrorMessage
                  name={field.name}
                  className={classes.error}
                  component="div"
                />
                {field.value && !error && (
                  <img
                    className={classes.error}
                    src={field.value}
                    onError={() =>
                      setFieldError(
                        field.name,
                        "Kunne ikke laste bilde fra denne URL-en :'("
                      )
                    }
                    onLoad={({ target: { width, height } }) => {
                      if (width * height > MAX_IMG_SIZE) {
                        setFieldError(field.name, "Bildet er for stort :(");
                      } else {
                        setFieldError(field.name, null);
                      }
                    }}
                    alt=" "
                  />
                )}
              </div>
            )}
          </Field>
          <DialogActions className={classes.field}>
            <Button onClick={closeModal}>Avbryt</Button>
            <Button type="submit" variant="contained" color="primary">
              Lagre
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
}

export default NewKitForm;
