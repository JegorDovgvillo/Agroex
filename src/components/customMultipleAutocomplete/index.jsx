import { useState, useEffect } from 'react';
import _ from 'lodash';
import { Field } from 'formik';
import { TextField, Autocomplete } from '@mui/material';

import styles from '../customTextField/customTextField.module.scss';

const CustomMultipleAutocompleteField = ({
  options,
  label = '',
  setFieldValue,
  value,
  id,
  fieldType,
  placeholder = '',
  name,
  errors,
}) => {
  const initialTagTitles = _.map(value, 'title');
  const [currValue, setCurrValue] = useState(initialTagTitles || []);
  const [inputValue, setInputValue] = useState('');
  const [lastInputValue, setLastInputValue] = useState([]);
  const tagsTitle = options.map((tag) => tag.title);
  const isError = !!errors;

  const getTagStyles = (option) => {
    const selectedTag = _.find(options, { title: option });
    const selectedTagColors = selectedTag?.color;

    return {
      backgroundColor: selectedTagColors?.bgColorHex,
      color: selectedTagColors && selectedTagColors.textColorHex,
      border: selectedTagColors && '1px solid transparent',
    };
  };

  const handleDeleteTagButtonClick = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    setCurrValue(newValue);
  };

  const getRenderedTags = (value) =>
    value.map((option, index) => (
      <div
        className={styles.tag}
        key={`${option}${index}`}
        style={getTagStyles(option)}
      >
        {option}
        <button
          className={styles.tagRemoveButton}
          onClick={handleDeleteTagButtonClick}
        >
          &#10006;
        </button>
      </div>
    ));

  const handleBlur = () => {
    inputValue && setLastInputValue([inputValue]);
  };

  useEffect(() => {
    setCurrValue((currValue) => [...currValue, ...lastInputValue]);
    setInputValue('');
  }, [lastInputValue]);

  useEffect(() => {
    setFieldValue(name, [...currValue]);
  }, [currValue]);

  return (
    <div className={styles.wrapp}>
      <label>{label}</label>
      <Autocomplete
        name={name}
        freeSolo
        id={id}
        placeholder={placeholder}
        value={currValue}
        multiple
        onChange={(event, newValue) => {
          setCurrValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={tagsTitle}
        renderTags={getRenderedTags}
        renderInput={(params) => (
          <Field
            as={TextField}
            {...params}
            className={`${styles.input}} ${isError && styles.error} ${
              styles[fieldType]
            }`}
            name={name}
            value={inputValue}
            onBlur={handleBlur}
            error={isError}
            helperText={isError ? errors : null}
          />
        )}
      />
    </div>
  );
};

export default CustomMultipleAutocompleteField;
