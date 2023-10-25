import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
// import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
// styles
import Styles from './datalake-project-form.scss';
// import from DNA Container
import SelectBox from 'dna-container/SelectBox';
// App components
import Tags from 'dna-container/Tags';
// import Notification from '../../common/modules/uilab/js/src/notification';
// import ProgressIndicator from '../../common/modules/uilab/js/src/progress-indicator';
// Utils
import { regionalDateAndTimeConversionSolution } from '../../utilities/utils';
// Api
// import { datalakeApi } from '../../apis/datalake.api';
import { addProject } from '../../redux/projectsSlice';
import { getProjects } from '../../redux/projects.services';

const DatalakeProjectForm = ({project, edit, onSave}) => {
  // let history = useHistory();

  const dispatch = useDispatch();
  console.log('datalake-project');
  console.log(project);

  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentError, setDepartmentError] = useState('');

  const handleCreateProject = (values) => {
    // ProgressIndicator.show();
    const data = {
        id: uuidv4(),
        projectName: values.name,
        description: values.description,
        projectType: projectType,
        division: values.division,
        subDivision: values.subDivision,
        department: departments,
        status: values.status,
        classificationType: dataClassification,
        piiData: PII,
        createdOn: '2023-04-05T11:12:52.991+00:00',
        owner: {
          id: 'KHARTAA',
          firstName: 'Aniruddha',
          lastName: 'Khartade',
          mobile: '8975847136',
          email: 'aniruddha@gmail.com'
        },
        tables: []
    };
    dispatch(addProject(data));
    dispatch(getProjects());
    onSave();
    // datalakeApi.createForecastProject(data).then((res) => {
    //   ProgressIndicator.hide();
    //   history.push(`/project/${res.data.data.id}`);
    //   Notification.show('Forecasting Project successfully created');
    // }).catch(error => {
    //   ProgressIndicator.hide();
    //   Notification.show(
    //     error?.response?.data?.response?.errors?.[0]?.message || error?.response?.data?.response?.warnings?.[0]?.message || 'Error while creating forecast project',
    //     'alert',
    //   );
    // });
  };
  const handleEditProject = () => {
    console.log('handle edit project');
  };

  useEffect(() => {
    SelectBox.defaultSetup();
  }, []);
  
  const [dataClassification, setDataClassification] = useState(edit && project?.data?.classificationType !== null ? project?.data?.classificationType : '');
  const [dataClassificationError] = useState('');
  const [PII, setPII] = useState(edit && project?.data?.piiData !== null ? project?.data?.piiData : false);
  const [projectType, setProjectType] = useState(edit && project?.data?.projectType !== null ? project?.data?.projectType : 'Iceberg');

  const handleDataClassification = (e) => {
    setDataClassification(e.target.value);
  };

  const handlePII = (e) => {
    setPII(e.target.value === 'true' ? true : false);
  };

  const handleProjectType = (e) => {
    setProjectType(e.target.value);
  }

  const statuses = [
    {
      id: 1,
      name: 'Active'
    }, 
    {
      id: 2,
      name: 'In development'
    }, 
    {
      id: 3,
      name: 'Sundowned'
    }
  ];
  
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);

  return (
    <>
      <FormProvider {...methods}>
        <div className={Styles.content}>
          <div className={Styles.formGroup}>
            {
              !edit &&
              <div>
                <div className={Styles.flexLayout}>
                  <div className={classNames('input-field-group include-error', errors?.name ? 'error' : '')}>
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      Name of Project <sup>*</sup>
                    </label>
                    <div>
                      <input
                        type="text"
                        className={classNames('input-field', Styles.projectNameField)}
                        id="projectName"
                        placeholder="Type here"
                        autoComplete="off"
                        maxLength={55}
                        {...register('name', { required: '*Missing entry', pattern: /^[a-z0-9-.]+$/ })}
                      />
                      <span className={classNames('error-message')}>{errors?.name?.message}{errors.name?.type === 'pattern' && 'Project names can consist only of lowercase letters, numbers, dots ( . ), and hyphens ( - ).'}</span>
                    </div>
                  </div>
                  <div className={classNames('input-field-group include-error')}>
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      Project Type <sup>*</sup>
                    </label>
                    <div className={Styles.pIIField}>
                      <label className={classNames('radio')}>
                        <span className="wrapper">
                          <input
                            type="radio"
                            className="ff-only"
                            value={true}
                            name="pii"
                            onChange={handleProjectType}
                            checked={PII === true}
                          />
                        </span>
                        <span className="label">Iceberg</span>
                      </label>
                      <label className={classNames('radio')}>
                        <span className="wrapper">
                          <input
                            type="radio"
                            className="ff-only"
                            value={false}
                            name="pii"
                            onChange={handleProjectType}
                            checked={PII === false}
                          />
                        </span>
                        <span className="label">Delta Lake</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className={classNames('input-field-group include-error area', errors.description ? 'error' : '')}>
                  <label id="description" className="input-label" htmlFor="description">
                    Description <sup>*</sup>
                  </label>
                  <textarea
                    id="description"
                    className="input-field-area"
                    type="text"
                    {...register('description', { required: '*Missing entry' })}
                    rows={50}
                  />
                  <span className={classNames('error-message')}>{errors?.description?.message}</span>
                </div>

                <div className={Styles.flexLayout}>
                  <div
                    className={classNames(
                      'input-field-group include-error')}
                  >
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      Division <sup>*</sup>
                    </label>
                    <div className={classNames('custom-select')}>
                    <select
                          id="divisionField"
                          required={true}
                          required-error={'*Missing entry'}
                          // onChange={handleDivision} 
                          // value={matomoDivision}
                      >
                          <option id="divisionOption" value={0}>
                            Choose
                          </option>
                          {divisions?.map((obj) => {
                            return (
                            <option id={obj.name + obj.id} key={obj.id} value={obj.id}>
                              {obj.name}
                            </option>
                            )
                          })}
                        </select>
                    </div>
                    {/* <span className={classNames('error-message', matomoDivisionError?.length ? '' : 'hide')}>
                      {matomoDivisionError}
                    </span> */}
                  </div>
                  <div
                    className={classNames(
                      'input-field-group include-error',
                      // matomoSubDivisionError?.length ? 'error' : '',
                    )}
                  >
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      Sub Division 
                    </label>
                    <div className={classNames('custom-select')}>
                      
                      <select id="subDivisionField" 
                      // onChange={handleSubDivision} 
                      // value={matomoSubDivision}
                      required={false}
                      >
                          {subDivisions?.some((item) => item.id === '0' && item.name === 'None') ? (
                            <option id="subDivisionDefault" value={0}>
                              None
                            </option>
                          ) : (
                            <>
                              <option id="subDivisionDefault" value={0}>
                                Choose
                              </option>
                              {subDivisions?.map((obj) => (
                                <option id={obj.name + obj.id} key={obj.id} value={obj.id}>
                                  {obj.name}
                                </option>
                              ))}
                            </>
                          )}
                      </select>
                      
                    </div>
                    {/* <span className={classNames('error-message', matomoSubDivisionError?.length ? '' : 'hide')}>
                      {matomoSubDivisionError}
                    </span> */}
                  </div>
                </div>

                <div className={Styles.flexLayout}>
                  <div
                    className={classNames(
                      Styles.bucketNameInputField,
                      'input-field-group include-error',
                    )}
                  >
                    <div>
                      <div className={Styles.departmentTags}>
                      
                          <Tags
                          title={'E2-Department'}
                          max={1}
                          chips={departmentName}
                          tags={departments}
                          setTags={(selectedTags) => {
                          let dept = selectedTags?.map((item) => item.toUpperCase());
                            setDepartmentName(dept);
                            setDepartmentError('');
                          }}
                          isMandatory={true}
                          showMissingEntryError={departmentError}
                          />
                          
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      'input-field-group include-error',
                    )}
                  >
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      Status <sup>*</sup>
                    </label>
                    <div className={classNames('custom-select')}>
                      <select id="reportStatusField" 
                      // onChange={onChangeStatus} 
                      // value={statusValue}
                      required={true}
                      >
                        {statuses?.length
                        ?           
                        <>
                          <option id="reportStatusOption" value={0}>
                              Choose
                          </option>
                          {statuses?.map((obj) => (
                              <option id={obj.name + obj.id} key={obj.id} value={obj.name}>
                                  {obj.name}
                              </option>
                          ))}
                        </>
                          : null}
                      </select>
                    </div>
                    {/* <span className={classNames('error-message', statusError?.length ? '' : 'hide')}>
                      {statusError}
                    </span> */}
                  </div>
                </div>

                <div className={Styles.flexLayout}>
                  <div
                    className={classNames(
                      'input-field-group include-error',
                      dataClassificationError?.length ? 'error' : '',
                    )}
                  >
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      Data Classification <sup>*</sup>
                    </label>
                    <div className={classNames('custom-select')}>
                      <select id="classificationField" 
                      onChange={handleDataClassification} 
                      value={dataClassification}
                      required={true}
                      >
                        
                            <option id="classificationOption" value={0}>Choose</option>
                            <option value={'Confidential'}>Confidential</option>
                            <option value={'Internal'}>Internal</option>
                            <option value={'Public'}>Public</option>
                            <option value={'Secret'}>Secret</option>
        
                      </select>
                    </div>
                    <span className={classNames('error-message', dataClassificationError?.length ? '' : 'hide')}>
                      {dataClassificationError}
                    </span>
                  </div>
                  <div className={classNames('input-field-group include-error')}>
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      PII (Personally Identifiable Information) <sup>*</sup>
                    </label>
                    <div className={Styles.pIIField}>
                      <label className={classNames('radio')}>
                        <span className="wrapper">
                          <input
                            type="radio"
                            className="ff-only"
                            value={true}
                            name="pii"
                            onChange={handlePII}
                            checked={PII === true}
                          />
                        </span>
                        <span className="label">Yes</span>
                      </label>
                      <label className={classNames('radio')}>
                        <span className="wrapper">
                          <input
                            type="radio"
                            className="ff-only"
                            value={false}
                            name="pii"
                            onChange={handlePII}
                            checked={PII === false}
                          />
                        </span>
                        <span className="label">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              edit &&
              <>
                <div className={Styles.projectWrapper}>
                  <div className={classNames(Styles.flexLayout, Styles.threeColumn)}>
                    <div id="productDescription">
                      <label className="input-label summary">Project Name</label>
                      <br />                    
                      {project?.data?.projectName}
                    </div>
                    <div id="tags">
                      <label className="input-label summary">Created on</label>
                      <br />
                      {project?.data?.createdOn !== undefined && regionalDateAndTimeConversionSolution(project?.data?.createdOn)}
                    </div>
                    <div id="isExistingSolution">
                      <label className="input-label summary">Owner</label>
                      <br />
                      {project?.data?.owner?.firstName} {project?.data?.owner?.lastName}
                    </div>
                  </div>
                </div>
                <div className={Styles.flexLayout}>
                  <div
                    className={classNames(
                      'input-field-group include-error',
                      dataClassificationError?.length ? 'error' : '',
                    )}
                  >
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      Data Classification <sup>*</sup>
                    </label>
                    <div className={classNames('custom-select')}>
                      <select id="classificationField" 
                      onChange={handleDataClassification} 
                      value={dataClassification}
                      required={true}
                      >
                        
                            <option id="classificationOption" value={0}>Choose</option>
                            <option value={'Confidential'}>Confidential</option>
                            <option value={'Internal'}>Internal</option>
                            <option value={'Public'}>Public</option>
                            <option value={'Secret'}>Secret</option>
        
                      </select>
                    </div>
                    <span className={classNames('error-message', dataClassificationError?.length ? '' : 'hide')}>
                      {dataClassificationError}
                    </span>
                  </div>
                  <div className={classNames('input-field-group include-error')}>
                    <label className={classNames(Styles.inputLabel, 'input-label')}>
                      PII (Personally Identifiable Information) <sup>*</sup>
                    </label>
                    <div className={Styles.pIIField}>
                      <label className={classNames('radio')}>
                        <span className="wrapper">
                          <input
                            type="radio"
                            className="ff-only"
                            value={true}
                            name="pii"
                            onChange={handlePII}
                            checked={PII === true}
                          />
                        </span>
                        <span className="label">Yes</span>
                      </label>
                      <label className={classNames('radio')}>
                        <span className="wrapper">
                          <input
                            type="radio"
                            className="ff-only"
                            value={false}
                            name="pii"
                            onChange={handlePII}
                            checked={PII === false}
                          />
                        </span>
                        <span className="label">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            }
            <div className={Styles.btnContainer}>
              <button
                className="btn btn-tertiary"
                type="button"
                onClick={handleSubmit((values) => {
                  edit ? handleEditProject() : handleCreateProject(values);
                })}
              >
                {edit ? 'Save Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      </FormProvider>
    </>
  );
}

export default DatalakeProjectForm;