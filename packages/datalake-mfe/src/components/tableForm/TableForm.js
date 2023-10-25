import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import Styles from './table-form.scss';
import SelectBox from 'dna-container/SelectBox';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const TableFormItem = (props) => {
  const { register } = useFormContext();
  /**
   * If the index of the current field is greater than 0, then swap the current field with the field
   * above it
   */
    const moveUp = () => {
      props.setFields(fields => {
          if (props.index > 0) {
              const _fields = [...fields];
              [_fields[props.index], _fields[props.index - 1]] = [
                  _fields[props.index - 1],
                  _fields[props.index],
              ];
              return _fields;
          }
          return fields;
      });
  };

  /**
   * It takes the current fields array, checks if the current index is less than the length of the
   * array, and if so, swaps the current index with the next index
   */
  const moveDown = () => {
      props.setFields(fields => {
          if (props.index < fields.length - 1) {
              const _fields = [...fields];
              [_fields[props.index], _fields[props.index + 1]] = [
                  _fields[props.index + 1],
                  _fields[props.index],
              ];
              return _fields;
          }
          return fields;
      });
  };

  useEffect(() => {
    SelectBox.defaultSetup();
  }, []);

  console.log('props');
  console.log(props);
  const { field } = props;
  const index = `A${props.index}`;

  return (
    <div className={Styles.columnsWrapper}>
      <div className={Styles.columnContainer}>
        <input type="hidden" id={`${index}.id`} defaultValue={field.id} {...register(`${index}.id`)} />
        <div className={Styles.flexLayout}>
          <div className={classNames('input-field-group include-error')}>
            <label className={classNames(Styles.inputLabel, 'input-label')}>
              Name <sup>*</sup>
            </label>
            <div>
              <input
                type="text"
                className={classNames('input-field')}
                id={`${index}.name`}
                {...register(`${index}.name`)}
                placeholder="Type here"
                autoComplete="off"
                maxLength={55}
                defaultValue={field.name}
              />
            </div>
          </div>
          <div className={Styles.configurationContainer}>
            <div className={classNames('input-field-group include-error')}>
              <label id="typeLabel" htmlFor={`${index}.type`} className="input-label">
                Type <sup>*</sup>
              </label>
              <div className="custom-select">
                <select id={`${index}.type`} {...register(`${index}.type`)}>
                  <option value={'BOOLEAN'}>BOOLEAN</option>
                  <option value={'TINYINT'}>TINYINT</option>
                  <option value={'SMALLINT'}>SMALLINT</option>
                  <option value={'INTEGER'}>INTEGER</option>
                  <option value={'BIGINT'}>BIGINT</option>
                  <option value={'REAL'}>REAL</option>
                  <option value={'DOUBLE'}>DOUBLE</option>
                  <option value={'DECIMAL'}>DECIMAL</option>
                  <option value={'VARCHAR'}>VARCHAR</option>
                  <option value={'CHAR'}>CHAR</option>
                  <option value={'VARBINARY'}>VARBINARY</option>
                  <option value={'JSON'}>JSON</option>
                  <option value={'DATE'}>DATE</option>
                  <option value={'TIME'}>TIME</option>
                  <option value={'TIMESTAMP'}>TIMESTAMP</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.flexLayout}>
          <div className={classNames('input-field-group include-error')}>
            <label className={classNames(Styles.inputLabel, 'input-label')}>
              Comment <sup>*</sup>
            </label>
            <div>
              <input
                type="text"
                className={classNames('input-field')}
                id="projectName"
                placeholder="Type here"
                autoComplete="off"
                maxLength={55}
              />
            </div>
          </div>
          <div className={classNames('input-field-group')}>
            <label className={classNames(Styles.inputLabel, 'input-label')}>
              Constraint
            </label>
            <div>
              <label className="checkbox">
                <span className="wrapper">
                  <input type="checkbox" className="ff-only" />
                </span>
                <span className="label">Not Null</span>
              </label>
            </div>
          </div>
        </div>
        <div className={Styles.flexLayout}>
          <div className={Styles.flexLayout}>
            <button className={classNames('btn btn-primary', Styles.btnActions)} onClick={moveUp}>↑ Move Up</button>
            <button className={classNames('btn btn-primary', Styles.btnActions)} onClick={moveDown}>↓ Move Down</button>
          </div>
          <div className={Styles.flexLayout}>
            <button className={classNames('btn btn-primary', Styles.btnActions)} onClick={() => {props.removeItem(props.field.id);}}>Remove field</button>
            <button className={classNames('btn btn-primary', Styles.btnActions)} onClick={() => props.addItem(props.index)}>Add field after</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TableFormBase = () => {
  const { register } = useFormContext();
  const { editingTable } = useSelector(state => state.graph);
  return (
    <>
      <div className={Styles.flexLayout}>
        <div className={classNames('input-field-group include-error')}>
          <label className={classNames(Styles.inputLabel, 'input-label')}>
            Table Name <sup>*</sup>
          </label>
          <div>
            <input
              type="text"
              className={classNames('input-field')}
              id="tableName"
              {...register('tableName')}
              placeholder="Type here"
              autoComplete="off"
              maxLength={55}
              defaultValue={editingTable?.name}
            />
          </div>
        </div>
        <div className={Styles.configurationContainer}>
          <div className={classNames('input-field-group include-error')}>
            <label id="formatLabel" htmlFor="tableFormat" className="input-label">
              Format <sup>*</sup>
            </label>
            <div className="custom-select">
              <select id="tableFormat" {...register('tableFormat')}>
                <option value={'PARQUET'}>PARQUET</option>
                <option value={'ORC'}>ORC</option> { /* only show for iceberg project type */ }
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames('input-field-group include-error')}>
        <label className={classNames(Styles.inputLabel, 'input-label')}>
          Table Comment <sup>*</sup>
        </label>
        <div>
          <input
            type="text"
            className={classNames('input-field')}
            id="tableComment"
            {...register('tableComment')}
            placeholder="Type here"
            autoComplete="off"
            maxLength={55}
            defaultValue={editingTable?.comment}
          />
        </div>
      </div>
    </>
  )
}

const TableForm = ({setToggle}) => {
  const methods = useForm();

  useEffect(() => {
    SelectBox.defaultSetup();
  }, []);

  const [fields, setFields] = useState([]);
  const { editingTable } = useSelector(state => state.graph);

  useEffect(() => {
      if (editingTable.fields) {
          console.log('oye');
          console.log(editingTable);
          setFields(editingTable.fields);
      } else {
        addItem(0);
        SelectBox.defaultSetup();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTable]);

  const onSubmit = (data) => {
    console.log('table form data');
    console.log(data);
  }

  useEffect(() => {
    console.log('fields');
    console.log(fields);
  }, [fields]);

  const addItem = index => {
    const newState = [...fields];
    newState.splice(index + 1, 0, {
        id: uuidv4(),
        name: 'new item' + newState.length,
        type: '',
        unique: false,
    });
    setFields(newState);
  };

  const removeItem = id => {
      setFields(state => {
          const fields = state.filter(item => item.id !== id);
          return fields.length ? fields : [];
      });
  };

  return (
    <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)} className={Styles.form}>
          <div className={Styles.formContent}>
            <TableFormBase />
            {fields.length > 0 && 
              fields.map((field, index) => (
                <TableFormItem
                    field={field}
                    key={field.id}
                    index={index}
                    addItem={addItem}
                    removeItem={removeItem}
                    setFields={setFields}
                />
            ))}
          </div>
          <div className="drawer-footer">
            <button className="btn btn-primary" onClick={setToggle}>Cancel</button>
            <button className="btn btn-tertiary" type="submit">Save</button>
          </div>
        </form>
    </FormProvider>
  )
}

export default TableForm;