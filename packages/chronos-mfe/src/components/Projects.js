import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import Styles from './Projects.style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';

// import from DNA Container
import Pagination from 'dna-container/Pagination';
import Modal from 'dna-container/Modal';
import AddTeamMemberModal from 'dna-container/AddTeamMemberModal';
import TeamMemberListItem from 'dna-container/TeamMemberListItem';

import { chronosApi } from '../apis/chronos.api';
import { setProjects } from './redux/projectsSlice';
import { GetProjects } from './redux/projects.services';
import ProjectsCardItem from './ProjectCardItem';
import { IconAvatarNew } from './shared/icons/iconAvatarNew/IconAvatarNew';
import FirstRun from './shared/firstRun/FirstRun';
import Notification from '../common/modules/uilab/js/src/notification';
import ProgressIndicator from '../common/modules/uilab/js/src/progress-indicator';
import Breadcrumb from './shared/breadcrumb/Breadcrumb';
import { Envs } from '../Utility/envs';

const ForeCastingProjects = ({ user, history }) => {
  const [createProject, setCreateProject] = useState(false);
  const [editProject, setEditProject] = useState(false);

  const [generateApiKey, setGenerateApiKey] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editTeamMember, setEditTeamMember] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState();
  const [editTeamMemberIndex, setEditTeamMemberIndex] = useState(0);

  const methods = useForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const dispatch = useDispatch();
  const {
    projects,
  } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(GetProjects());
  }, [dispatch]);

  
  // Pagination 
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentPageOffset, setCurrentPageOffset] = useState(0);
  const [maxItemsPerPage, setMaxItemsPerPage] = useState(15);

  const [forecastProjects, setForecastProjects] = useState([...projects]);

  /* getResults */
  const getResults = async (action) => {
    const showProgressIndicator = ['pagination'].includes(action);
    console.log(action);

    showProgressIndicator && ProgressIndicator.show();

    let results = [];

    await chronosApi.getAllForecastProjects()
      .then((res) => {
        if (res.data.records) {
          results = [...res.data.records];
        }
      })
      .catch((err) => {
        Notification.show(
          err?.response?.data?.errors?.[0]?.message || 'Error while fetching forecast projects',
          'alert',
        );
        setForecastProjects([]);
      });

    setForecastProjects(
      results.slice(
        currentPageOffset > results.length ? 0 : currentPageOffset,
        currentPageOffset + maxItemsPerPage < results.length ? currentPageOffset + maxItemsPerPage : results.length,
      ),
    );
    setTotalNumberOfPages(Math.ceil(results.length / maxItemsPerPage) === 0 ? 1 : Math.ceil(results.length / maxItemsPerPage));
    setCurrentPageNumber(
      currentPageNumber > Math.ceil(results.length / maxItemsPerPage)
        ? Math.ceil(results.length / maxItemsPerPage) > 0
          ? Math.ceil(results.length / maxItemsPerPage)
          : 1
        : currentPageNumber,
    );
    showProgressIndicator && ProgressIndicator.hide();
  };

  useEffect(() => {
    getResults('pagination');
  }, [maxItemsPerPage, currentPageOffset, currentPageNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPaginationPreviousClick = () => {
    const currentPageNum = currentPageNumber - 1;
    const currentPageOffset = (currentPageNum - 1) * maxItemsPerPage;
    setCurrentPageNumber(currentPageNum);
    setCurrentPageOffset(currentPageOffset);
  };
  const onPaginationNextClick = () => {
    const currentPageOffset = currentPageNumber * maxItemsPerPage;
    setCurrentPageNumber(currentPageNumber + 1);
    setCurrentPageOffset(currentPageOffset);
  };
  const onViewByPageNum = (pageNum) => {
    setCurrentPageNumber(1);
    setCurrentPageOffset(0);
    setMaxItemsPerPage(pageNum);
  };

  const handleCreateProject = (values) => {
    ProgressIndicator.show();
    const data = {
        "apiKey": "123823",
        // "collaborators": teamMembers.map(teamMember => {delete teamMember.userType; delete teamMember.shortId; return teamMember}),
        "collaborators": teamMembers,
        "name": values.name,
        "permission": {
          "read": true,
          "write": true
        }
    };
    chronosApi.createForecastProject(data).then((res) => {
      ProgressIndicator.hide();
      history.push(`/project/${res.data.data.id}`);
      setCreateProject(false);
      reset({ name: '' });
      setTeamMembers([]);
      Notification.show('Forecasting Project successfully created');
    }).catch(error => {
      ProgressIndicator.hide();
      Notification.show(
        error?.response?.data?.response?.errors?.[0]?.message || error?.response?.data?.response?.warnings?.[0]?.message || 'Error while creating forecast project',
        'alert',
      );
    });
  };
  const handleEditProject = (values) => {
    values.permission = values.permission.reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    const copyProjects = [...projects];
    const findIndex = copyProjects.findIndex((item) => item.id === values.id);
    copyProjects[findIndex] = values;
    dispatch(setProjects(copyProjects));
    setEditProject(false);
    reset({ name: '' });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('123823').then(() => {
      Notification.show('Copied to Clipboard');
    });
  };

  const addTeamMemberModalRef = React.createRef();
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const showAddTeamMemberModalView = () => {
    setShowAddTeamMemberModal(true);
  }
  const onAddTeamMemberModalCancel = () => {
    setShowAddTeamMemberModal(false);
  }
  const updateTeamMemberList = (teamMember) => {
    onAddTeamMemberModalCancel();
    const teamMemberTemp = {...teamMember, id: teamMember.shortId, permissions: { 'read': true, 'write': true }};
    delete teamMemberTemp.teamMemberPosition;
    let teamMembersTemp = [...teamMembers];
    if(editTeamMember) {
      teamMembersTemp.splice(editTeamMemberIndex, 1);
      teamMembersTemp.splice(editTeamMemberIndex, 0, teamMemberTemp);
    } else {
      teamMembersTemp.push(teamMemberTemp);
    }
    setTeamMembers(teamMembersTemp);
  }
  const validateMembersList = (teamMemberObj) => {
    let duplicateMember = false;
    duplicateMember = teamMembers?.filter((member) => member.shortId === teamMemberObj.shortId)?.length ? true : false;
    return duplicateMember;
  };
  const onTeamMemberEdit = (index) => {
    setEditTeamMember(true);
    setShowAddTeamMemberModal(true);
    const teamMemberTemp = teamMembers[index];
    setSelectedTeamMember(teamMemberTemp);
    setEditTeamMemberIndex(index);
  };

  const onTeamMemberDelete = (index) => {
    const teamMembersTemp = [...teamMembers];
    teamMembersTemp.splice(index, 1);
    setTeamMembers(teamMembersTemp);
  };

  const onTeamMemberMoveUp = (index) => {
    const teamMembersTemp = [...teamMembers];
    const teamMember = teamMembersTemp.splice(index, 1)[0];
    teamMembersTemp.splice(index - 1, 0, teamMember);
    setTeamMembers(teamMembersTemp);
  };

  const onTeamMemberMoveDown = (index) => {
    const teamMembersTemp = [...teamMembers];
    const teamMember = teamMembersTemp.splice(index, 1)[0];
    teamMembersTemp.splice(index + 1, 0, teamMember);
    setTeamMembers(teamMembersTemp);
  };

  const teamMembersList = teamMembers?.map((member, index) => {
    return (
      <TeamMemberListItem
        key={index}
        itemIndex={index}
        teamMember={member}
        hidePosition={true}
        showInfoStacked={true}
        showMoveUp={index !== 0}
        showMoveDown={index + 1 !== teamMembers?.length}
        onMoveUp={onTeamMemberMoveUp}
        onMoveDown={onTeamMemberMoveDown}
        onEdit={onTeamMemberEdit}
        onDelete={onTeamMemberDelete}
      />
    );
  });

  const addProjectContent = (
    <FormProvider {...methods}>
      <div className={Styles.content}>
        <div className={Styles.formGroup}>
          <div className={Styles.flexLayout}>
            <div>
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
                    {...register('name', { required: '*Missing entry', pattern: /^[a-z0-9-.]+$/ })}
                  />
                  <span className={classNames('error-message')}>{errors?.name?.message}{errors.name?.type === 'pattern' && 'Project names can consist only of lowercase letters, numbers, dots ( . ), and hyphens ( - ).'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.collabContainer}>
            <h3 className={Styles.modalSubTitle}>Add Collaborators</h3>
            <div className={Styles.collabAvatar}>
              <div className={Styles.teamListWrapper}>
                <div className={Styles.addTeamMemberWrapper}>
                  <IconAvatarNew className={Styles.avatarIcon} />
                  <button id="AddTeamMemberBtn" 
                    onClick={showAddTeamMemberModalView}
                    >
                    <i className="icon mbc-icon plus" />
                    <span>Add team member</span>
                  </button>
                </div>
                {
                  teamMembers?.length > 0 &&
                    <div className={Styles.membersList}>
                      {teamMembersList}
                    </div>
                }
              </div>
            </div>
            <div className={Styles.apiKeySection + ' ' + Styles.hide}>
              <h3 className={Styles.modalSubTitle}>Generate API Key</h3>
              {
                generateApiKey &&
                <div className={Styles.apiKey}>
                  <p className={Styles.label}>API Key</p>
                  <button className={Styles.generateApiKeyBtn} onClick={() => setGenerateApiKey(false)}>
                    Generate API Key
                  </button>
                  {
                    Envs.ENABLE_CHRONOS_ONEAPI &&
                      <p className={Styles.oneApiLink}>or go to <a href={Envs.CHRONOS_ONEAPI_URL}>oneAPI</a></p>
                  }
                </div>
              }
              {
                !generateApiKey &&
                  <div className={Styles.apiKey}>
                    <p className={Styles.label}>API Key</p>
                    <div className={Styles.appIdParentDiv}>
                      <div className={Styles.refreshedKey}>
                        { showApiKey ? (
                          <p>123823</p>
                        ) : (
                          <React.Fragment>
                            &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                          </React.Fragment>
                        )}
                      </div>
                      <div className={Styles.refreshedKeyIcon}>
                        {showApiKey ? (
                          <React.Fragment>
                            <i
                              className={Styles.showAppId + ' icon mbc-icon visibility-hide'}
                              onClick={() => { setShowApiKey(!showApiKey) }}
                              tooltip-data="Hide"
                            />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <i
                              className={Styles.showAppId + ' icon mbc-icon visibility-show ' + Styles.visiblityshow}
                              onClick={() => { setShowApiKey(!showApiKey) }}
                              tooltip-data="Show"
                            />
                          </React.Fragment>
                        )}
                        <i
                          className={Styles.cpyStyle + ' icon mbc-icon copy'}
                          onClick={copyApiKey}
                          tooltip-data="Copy"
                        />
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
          <div className={Styles.btnContainer}>
            <button
              className="btn btn-tertiary"
              type="button"
              onClick={handleSubmit((values) => {
                createProject ? handleCreateProject(values) : handleEditProject(values);
              })}
            >
              {createProject ? 'Create Project' : editProject && 'Save Project'}
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );

  return (
    <>
      <div className={classNames(Styles.mainPanel)}>
        <div className={classNames(Styles.wrapper)}>
          {forecastProjects?.length === 0 ? (
            <FirstRun openCreateProjectModal={() => setCreateProject(true)} user={user} />
          ) : (
            <>
              <Breadcrumb>
                <li>Chronos Forecasting</li>
              </Breadcrumb>

              <div className={classNames(Styles.caption)}>
                <h3>My Forecasting Projects</h3>
                <div className={classNames(Styles.listHeader)}>
                  {forecastProjects?.length ? (
                    <React.Fragment>
                      <button
                        className={forecastProjects?.length === null ? Styles.btnHide : 'btn btn-primary'}
                        type="button"
                        onClick={() => setCreateProject(true)}
                      >
                        <i className="icon mbc-icon plus" />
                        <span>Create Forecasting Project</span>
                      </button>
                    </React.Fragment>
                  ) : null}
                </div>
              </div>

              <div className={Styles.allProjectContent}>
                <div className={Styles.newProjectCard} onClick={() => setCreateProject(true)}>
                  <div className={Styles.addicon}> &nbsp; </div>
                  <label className={Styles.addlabel}>Create new project</label>
                </div>
                {forecastProjects?.map((project, index) => {
                  return (
                    <ProjectsCardItem
                      key={index}
                      project={project}
                      onEdit={(val) => {
                        setEditProject(true);
                        reset(val);
                      }}
                    />
                  );
                })}
              </div>

              {forecastProjects?.length > 0 ? (
                <Pagination
                  totalPages={totalNumberOfPages}
                  pageNumber={currentPageNumber}
                  onPreviousClick={onPaginationPreviousClick}
                  onNextClick={onPaginationNextClick}
                  onViewByNumbers={onViewByPageNum}
                  displayByPage={true}
                />
              ) : null}
          </>
          )}
        </div>
      </div>
      { (createProject || editProject) &&
        <Modal
          title={createProject ? 'Create new Forecasting Project' : editProject && 'Edit Forecasting Project'}
          showAcceptButton={false}
          showCancelButton={false}
          modalWidth={'60%'}
          buttonAlignment="right"
          show={createProject || editProject}
          content={addProjectContent}
          scrollableContent={false}
          onCancel={() => {
            setCreateProject(false);
            setEditProject(false);
            reset({ name: '' });
            setTeamMembers([]);
          }}
          modalStyle={{
            padding: '50px 35px 35px 35px',
            minWidth: 'unset',
            width: '60%',
            maxWidth: '50vw'
          }}
        />
      }
      {showAddTeamMemberModal && (
        <AddTeamMemberModal
          ref={addTeamMemberModalRef}
          modalTitleText={'Collaborator'}
          showOnlyInteral={true}
          hideTeamPosition={true}
          editMode={editTeamMember}
          showAddTeamMemberModal={showAddTeamMemberModal}
          teamMember={selectedTeamMember}
          onUpdateTeamMemberList={updateTeamMemberList}
          onAddTeamMemberModalCancel={onAddTeamMemberModalCancel}
          validateMemebersList={validateMembersList}
        />
      )}
    </>
  );
};
export default ForeCastingProjects;
