import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import Pagination from '../pagination/Pagination';
import Styles from './DataComplianceNetworkList.scss';
import { ISortField } from '../allSolutions/AllSolutions';
import { IChangeLogData, IDataComplianceRequest, IEntity, IRole, ITag, IUserInfo } from '../../../globals/types';
import RowItem from './rowItem/RowItem';
import ConfirmModal from '../../../components/formElements/modal/confirmModal/ConfirmModal';
import InfoModal from '../../../components/formElements/modal/infoModal/InfoModal';
import TextBox from '../shared/textBox/TextBox';
import Tooltip from '../../../assets/modules/uilab/js/src/tooltip';
import Notification from '../../../assets/modules/uilab/js/src/notification';
import Spinner from '../shared/spinner/Spinner';
import { SESSION_STORAGE_KEYS, USER_ROLE } from '../../../globals/constants';
// @ts-ignore
import ProgressIndicator from '../../../assets/modules/uilab/js/src/progress-indicator';
import TypeAheadBox from '../shared/typeAheadBox/TypeAheadBox';
import Tags from '../../../components/formElements/tags/Tags';
import { DataComplianceApiClient } from '../../../services/DataComplianceApiClient';
import { validateEmail } from '../../../utils/Validation';
import { debounce } from 'lodash';
// import { regionalDateAndTimeConversionSolution } from '../../../services/utils';

const MOCK = [
  {
    changeDate: '02/02/2022',
    modifiedBy: {
      firstName: 'DEMO',
      lastName: 'USER',
      userType: 'admin',
    },
    fieldChanged: 'something',
    oldValue: 'lorem ipsum',
    newValue: 'lorem ipsum',
    changeDescription: 'lorem ipsum',
  },
  {
    changeDate: '04/04/2022',
    modifiedBy: {
      firstName: 'DEMO',
      lastName: 'USER',
      userType: 'admin',
    },
    fieldChanged: 'something',
    oldValue: 'lorem ipsum',
    newValue: 'lorem ipsum',
    changeDescription: 'lorem ipsum',
  }
];

export interface IEntityItem {
  id?: string;
  entityId: string;
  entityName: string;
}

export interface IDataComplianceNetworkListProps {
  user: IUserInfo;
}

const classNames = cn.bind(Styles);

const DataComplianceNetworkList:React.FC<IDataComplianceNetworkListProps> = (props:IDataComplianceNetworkListProps) => {

  const isAdmin = props.user.roles.find((role: IRole) => role.id === USER_ROLE.ADMIN) !== undefined;

  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState<ISortField>({
    name: 'entityId',
    currentSortType: 'desc',
    nextSortType: 'asc',
  });

  /* Pagination */
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentPageOffset, setCurrentPageOffset] = useState(0);
  const [maxItemsPerPage, setMaxItemsPerPage] = useState(parseInt(sessionStorage.getItem(SESSION_STORAGE_KEYS.PAGINATION_MAX_ITEMS_PER_PAGE), 10) || 15);
  
  const [searchTerm, setSearchTerm] = useState('');

  const [dataComplianceNetworkList, setDataComplianceNetworkList] = useState([]);

  const [showDeleteEntityConfirmModal, setShowDeleteEntityConfirmModal] = useState(false);
  const [updateConfirmModalOverlay, setUpdateConfirmModalOverlay] = useState(false);

  const [updateMode, setUpdateMode] = useState(false);
  const [showEntityFormModal, setShowEntityFormModal] = useState(false);

  const [entityList, setEntityList] = useState<IEntityItem[]>([]);

  const [showChangeLog, setShowChangeLog] = useState(false);
  const [changeLogs, setChangeLogs] = useState<IChangeLogData[]>([]);
  
  const [entity, setEntity] = useState<IEntity>({
    id: '',
    entityId: '',
    entityName: '',
    localComplianceOfficer: [],
    localComplianceResponsible: [],
    dataProtectionCoordinator: [],
    localComplianceSpecialist: [],
    createdDate: '',
    createdBy: {
      id: '',
      firstName: '',
      lastName: '',
      eMail: '',
      mobileNumber: '',
      department: '',
    },
    lastModifiedDate: '',
    modifiedBy: {
      id: '',
      firstName: '',
      lastName: '',
      eMail: '',
      mobileNumber: '',
      department: '',
    },
  });
  
  const dummyTags:ITag[] = [];

  /* error states */
  const [entityIdError, setEntityIdError] = useState('');
  const [entityNameError, setEntityNameError] = useState('');
  const [entityError, setEntityError] = useState(false);
  const [localComplianceOfficerError, setLocalComplianceOfficerError] = useState(false);
  const [localComplianceResponsibleError, setLocalComplianceResponsibleError] = useState(false);
  const [dataProtectionCoordinatorError, setDataProtectionCoordinatorError] = useState(false);
  const [localComplianceSpecialistError, setLocalComplianceSpecialistError] = useState(false);

  const [entitySearch, setEntitySearch] = useState(true);

  /* Email Validation */
  const setLocalComplianceOfficer = (arr: string[]) => {
    setLocalComplianceOfficerError(false);
    arr.map(item => {
      if(validateEmail(item)) {
        return item;
      } else {
        setLocalComplianceOfficerError(true);
      }
    });
    setEntity({...entity, localComplianceOfficer: arr});
  };
  const setLocalComplianceResponsible = (arr: string[]) => {
    setLocalComplianceResponsibleError(false);
    arr.map(item => {
      if(validateEmail(item)) {
        return item;
      } else {
        setLocalComplianceResponsibleError(true);
      }
    });
    setEntity({...entity, localComplianceResponsible: arr});
  };
  const setDataProtectionCoordinator = (arr: string[]) => {
    setDataProtectionCoordinatorError(false);
    arr.map(item => {
      if(validateEmail(item)) {
        return item;
      } else {
        setDataProtectionCoordinatorError(true);
      }
    });
    setEntity({...entity, dataProtectionCoordinator: arr});
  };
  const setLocalComplianceSpecialist = (arr: string[]) => {
    setLocalComplianceSpecialistError(false);
    arr.map(item => {
      if(validateEmail(item)) {
        return item;
      } else {
        setLocalComplianceSpecialistError(true);
      }
    });
    setEntity({...entity, localComplianceSpecialist: arr});
  };

  useEffect(() => {
    Tooltip.defaultSetup();
    setLoading(true)
    setData();
    DataComplianceApiClient.getEntityList(0, 0, 'entityId', 'asc')
    .then((res:any) => {
      setEntityList(res.records);
    })
    .catch((err:any) => {
      console.log(err);
    });

    setChangeLogs(MOCK);
  }, []);

  const setData = async() => {
    await getResults('');
  }

  /* getResults */
  const getResults = async(action: string) => {
    const showProgressIndicator = ['add', 'update', 'delete'].includes(action);
    const showContentLoader = ['reset', 'categoryChange', 'search', 'pagination'].includes(action);

    showProgressIndicator && ProgressIndicator.show();
    showContentLoader && setLoading(true);

    let results: any[] = [];
    
    await DataComplianceApiClient.getDataComplianceNetworkList(0, 0, 'entityId', 'asc')
      .then((res:any) => {
        if(res.records) {
          results = [...res.records];
        }
      })
      .catch((err:any) => {
        Notification.show(err.message, 'alert');
        setDataComplianceNetworkList([]);
      });

    if(searchTerm) {
      results = results.filter((result) => {
        const localComplianceOfficers = result.localComplianceOfficer.toString();
        const localComplianceResponsibles = result.localComplianceResponsible.toString();
        const dataProtectionCoordinators = result.dataProtectionCoordinator.toString();
        const localComplianceSpecialists = result.localComplianceSpecialist.toString();
        return result.entityName.toLowerCase().includes(searchTerm) || result.entityId.toLowerCase().includes(searchTerm) ||
                localComplianceOfficers.includes(searchTerm) || localComplianceResponsibles.includes(searchTerm) || dataProtectionCoordinators.includes(searchTerm)
                || localComplianceSpecialists.includes(searchTerm);
      });
    }

    if(sortBy) {
      if (sortBy.name === 'entityId') {
        results = results.sort((a: any, b: any) => {
          if (sortBy.currentSortType === 'asc') {
            return a.entityId.toLowerCase() === b.entityId.toLowerCase() ? 0 : -1;
          } else {
            return a.entityId.toLowerCase() === b.entityId.toLowerCase() ? -1 : 0;
          }
        });
      } else if (sortBy.name === 'entityName') {
        results = results.sort((a: any, b: any) => {
          if (sortBy.currentSortType === 'asc') {
            return a.entityName.toLowerCase() === b.entityName.toLowerCase() ? 0 : -1;
          } else {
            return a.entityName.toLowerCase() === b.entityName.toLowerCase() ? -1 : 0;
          }
        });
      }
    }

    setDataComplianceNetworkList(
      results.slice(
        currentPageOffset > results.length ? 0 : currentPageOffset,
        currentPageOffset + maxItemsPerPage < results.length
          ? currentPageOffset + maxItemsPerPage
          : results.length
      )
    );
    setTotalNumberOfPages(Math.ceil(results.length / maxItemsPerPage));
    setCurrentPageNumber(
      currentPageNumber > Math.ceil(results.length / maxItemsPerPage)
        ? Math.ceil(results.length / maxItemsPerPage) > 0
          ? Math.ceil(results.length / maxItemsPerPage)
          : 1
        : currentPageNumber
    );
    showProgressIndicator && ProgressIndicator.hide();
    showContentLoader && setLoading(false);
  }
  
  /* Sort */
  const sortEntities = (propName: string, sortOrder: string) => {
    const tempSortBy: ISortField = {
      name: propName,
      currentSortType: sortOrder,
      nextSortType: sortBy.currentSortType,
    };
    setSortBy(tempSortBy);
  };
  useEffect(() => {
    getResults('sort');
  }, [sortBy]);
  
  useEffect(() => {
    getResults('pagination');
  }, [maxItemsPerPage, currentPageOffset, currentPageNumber]);
  
  /* Search */
  useEffect(() => {
    getResults('search');
  }, [searchTerm]);
  const onSearchTextChange = debounce((e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const searchText = input.value.toLowerCase();
    setSearchTerm(searchText);
  }, 500);

  /* Pagination */
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
  const onViewByPageNum = (pageNum: number) => {
    setCurrentPageNumber(1);
    setCurrentPageOffset(0);
    setMaxItemsPerPage(pageNum);
  };

  /* Modal handling */
  const showDeleteConfirmModal = (entity: any) => {
    setEntity({
      ...entity,
      id: entity.id,
      entityName: entity.entityName,
    });
    setShowDeleteEntityConfirmModal(true);
  };
  const showUpdateConfirmModal = (entity: any) => {
    setShowEntityFormModal(true);
    setUpdateMode(true);
    setEntitySearch(true);
    setEntity({
      ...entity,
      id: entity.id,
      entityId: entity.entityId,
      entityName: entity.entityName,
      localComplianceOfficer: entity.localComplianceOfficer,
      localComplianceResponsible: entity.localComplianceResponsible,
      dataProtectionCoordinator: entity.dataProtectionCoordinator,
      localComplianceSpecialist: entity.localComplianceSpecialist,
      createdDate: entity.createdDate,
      createdBy: entity.createdBy
    });

    setEntityIdError(null);
    setEntityNameError(null);
  };
  const onCancelDeleteChanges = () => {
    setShowDeleteEntityConfirmModal(false);
  };
  const onAcceptDeleteChanges = () => {
    setShowDeleteEntityConfirmModal(false);
    ProgressIndicator.show();
    const newArr = dataComplianceNetworkList.filter(object => {
      return object.id !== entity.id;
    });
    DataComplianceApiClient.deleteDataComplianceNetworkList(entity.id)
      .then((response:any) => {
        setDataComplianceNetworkList(newArr);
        ProgressIndicator.hide();
        Notification.show('Legal entity deleted successfully.');
      })
      .catch((error:any) => {
        ProgressIndicator.hide();
        Notification.show(error.message, 'alert');
      });
    setShowEntityFormModal(false);
  };
  const onShowEntityFormModalCancel = () => {
    setShowEntityFormModal(false);
  };
  const onEntityFormModalOpen = () => {
    resetEntity();
    setShowEntityFormModal(true);
    setUpdateMode(false);
  };
  const updateConfirmModalOverlayCancel = () => {
    setUpdateConfirmModalOverlay(false);
  };
  const updateConfirmModalOverlayUpdate = () => {
    let formValid = true;
    let errorMessage = 'Please fill Entity ID and Entity Name';

    if(entitySearch) {
      if(entity.entityId.length === 0 && entity.entityName.length === 0) {
        errorMessage = 'Please select entity';
        formValid = false;
        setEntityError(true);
      }
    } else {
      if(entity.entityId.length > 0) {
        setEntityIdError(null);
      } else {
        setEntityIdError('*Missing entry');
        formValid = false;
      }
      if(entity.entityName.length > 0) {
        setEntityNameError(null);
      } else {
        setEntityNameError('*Missing entry');
        formValid = false;
      }
    }

    if(localComplianceOfficerError || localComplianceResponsibleError || dataProtectionCoordinatorError || localComplianceSpecialistError) {
      formValid = false;
      errorMessage = 'Please enter emails in correct format';
    }
    if(formValid) {
      setUpdateConfirmModalOverlay(true); 
    } else {
      Notification.show(errorMessage, 'alert');
    }
  };
  const onEntitySelect = (entity:any) => {
    setEntity((prev) => ({...prev, entityId: entity.entityId, entityName: entity.entityName}));
  }
  const resetEntity = () => {
    setEntity({
      ...entity,
      entityId: '',
      entityName: '',
      localComplianceOfficer: [] as string[],
      localComplianceResponsible: [] as string[],
      dataProtectionCoordinator: [] as string[],
      localComplianceSpecialist: [] as string[],
    });

    setEntityError(false);
    setEntityIdError(null);
    setEntityNameError(null);

    setEntitySearch(true);
  }
  const onEntityAdd = () => {
    let formValid = true;
    let errorMessage = 'Please fill Entity ID and Entity Name';
    if(entitySearch) {
      if(entity.entityId.length === 0 && entity.entityName.length === 0) {
        errorMessage = 'Please select entity';
        formValid = false;
        setEntityError(true);
      }
    } else {
      if(entity.entityId.length > 0) {
        setEntityIdError(null);
      } else {
        setEntityIdError('*Missing entry');
        formValid = false;
      }
      if(entity.entityName.length > 0) {
        setEntityNameError(null);
      } else {
        setEntityNameError('*Missing entry');
        formValid = false;
      }
    }
    if(localComplianceOfficerError || localComplianceResponsibleError || dataProtectionCoordinatorError || localComplianceSpecialistError) {
      formValid = false;
      errorMessage = 'Please enter emails in correct format';
    }
    if(formValid) {
      ProgressIndicator.show();
      setUpdateConfirmModalOverlay(false);
      const data: IDataComplianceRequest = {
        data: {
          dataProtectionCoordinator: entity.dataProtectionCoordinator,
          entityId: entity.entityId,
          entityName: entity.entityName,
          localComplianceOfficer: entity.localComplianceOfficer,
          localComplianceResponsible: entity.localComplianceResponsible,
          localComplianceSpecialist: entity.localComplianceSpecialist
        }
      }
      DataComplianceApiClient.saveDataComplianceNetworkList(data)
        .then((response:any) => {
          getResults('add');
          ProgressIndicator.hide();
          Notification.show('Legal entity saved successfully.');
          resetEntity();
          setShowEntityFormModal(false);
        })
        .catch((error:any) => {
          ProgressIndicator.hide();
          Notification.show(error.message, 'alert');
        });
    } else {
      Notification.show(errorMessage, 'alert');
      ProgressIndicator.hide();
    }
  };
  const onEntityUpdate = () => {
    setUpdateConfirmModalOverlay(false);
    ProgressIndicator.show();
    const newState = dataComplianceNetworkList.map(obj => {
      if (obj.id === entity.id) {
        return {
          ...obj, 
          id: entity.id,
          entityId: entity.entityId, 
          entityName: entity.entityName,
          localComplianceOfficer: entity.localComplianceOfficer,
          localComplianceResponsible: entity.localComplianceResponsible,
          dataProtectionCoordinator: entity.dataProtectionCoordinator,
          localComplianceSpecialist: entity.localComplianceSpecialist 
        };
      }
      return obj;
    });
    const data: IDataComplianceRequest = {
      data: {
        id: entity.id,
        dataProtectionCoordinator: entity.dataProtectionCoordinator,
        createdDate: entity.createdDate,
        createdBy: entity.createdBy,
        entityId: entity.entityId,
        entityName: entity.entityName,
        localComplianceOfficer: entity.localComplianceOfficer,
        localComplianceResponsible: entity.localComplianceResponsible,
        localComplianceSpecialist: entity.localComplianceSpecialist
      }
    }
    DataComplianceApiClient.updateDataComplianceNetworkList(data)
      .then((response:any) => {
        Notification.show('Legal entity updated successfully.');
        setDataComplianceNetworkList(newState);
        ProgressIndicator.hide();
        resetEntity();
        setShowEntityFormModal(false);
      })
      .catch((error:any) => {
        ProgressIndicator.hide();
        Notification.show(error.message, 'alert');
      });
  };
  const onChangeEntityId = (e: React.FormEvent<HTMLInputElement>) => {
    setEntity({...entity, entityId: e.currentTarget.value});
    if(e.currentTarget.value.length > 0) {
      setEntityIdError(null);
    } else {
      setEntityIdError('*Missing entry');
    }
  };
  const onChangeEntityName = (e: React.FormEvent<HTMLInputElement>) => {
    setEntity({...entity, entityName: e.currentTarget.value});
    if(e.currentTarget.value.length > 0) {
      setEntityNameError(null);
    } else {
      setEntityNameError('*Missing entry');
    }
  };

  /* jsx */
  const deleteModalContent: React.ReactNode = (
    <div id="contentparentdiv" className={Styles.modalContentWrapper}>
      <div className={Styles.modalTitle}>Delete Entity</div>
      <div className={Styles.modalContent}>
        <p>The entity &laquo;{entity.entityName ? entity.entityName : ''}&raquo; will be removed
        permanently.</p>
      </div>
    </div>
  );
  const entityFormModalContent = (
    <div id="addOrUpdateFormWrapper" className={Styles.infoPopup}>
      <div className={classNames(Styles.modalContent, Styles.formWrapperMain)}>
        <button className={Styles.btnSwitch} onClick={() => setEntitySearch(!entitySearch)}>{ entitySearch ? 'Add New Entity' : 'Back to Search' }</button>
        { entitySearch ? 
            <>
              <TypeAheadBox
                label={'Entity'}
                placeholder={"Search Entity ID or Entity Name"}
                list={entityList}
                defaultValue={(updateMode && entity.entityId.length > 0 && entity.entityName.length > 0) ? entity.entityId + ' - ' + entity.entityName : ''}
                onItemSelect={onEntitySelect}
                required={true}
                entityError={entityError}
              />
            </> : 
            <>
              <TextBox
                type="text"
                controlId={'entity-id'}
                label={'Entity ID'}
                placeholder={"Type here"}
                value={entity.entityId}
                errorText={entityIdError}
                required={true}
                maxLength={200}
                onChange={onChangeEntityId}
              />
              <TextBox
                type="text"
                controlId={'entity-name'}
                label={'Entity Name'}
                placeholder={"Type here"}
                value={entity.entityName}
                errorText={entityNameError}
                required={true}
                maxLength={200}
                onChange={onChangeEntityName}
              />
           </>
        }
        <div className={Styles.tagControl}>
          <Tags
            title={'Local Compliance Officer (LCO)'}
            max={100}
            chips={entity.localComplianceOfficer}
            setTags={setLocalComplianceOfficer}
            tags={dummyTags}
            isMandatory={false}
            showMissingEntryError={false}
          />
          { localComplianceOfficerError && <span className={classNames("error-message", Styles.tagError)}>Please enter valid email address.</span> }
        </div>
        <div className={Styles.tagControl}>
          <Tags
            title={'Local Compliance Responsible (LCR)'}
            max={100}
            chips={entity.localComplianceResponsible}
            setTags={setLocalComplianceResponsible}
            tags={dummyTags}
            isMandatory={false}
            showMissingEntryError={false}
          />
          { localComplianceResponsibleError && <span className={classNames("error-message", Styles.tagError)}>Please enter valid email address.</span> }
        </div>
        <div className={Styles.tagControl}>
          <Tags
            title={'Data Protection Coordinator (DPC)'}
            max={100}
            chips={entity.dataProtectionCoordinator}
            setTags={setDataProtectionCoordinator}
            tags={dummyTags}
            isMandatory={false}
            showMissingEntryError={false}
          />
          { dataProtectionCoordinatorError && <span className={classNames("error-message", Styles.tagError)}>Please enter valid email address.</span> }
        </div>
        <div className={Styles.tagControl}>
          <Tags
            title={'Local Compliance Support / Specialist (LCS)'}
            max={100}
            chips={entity.localComplianceSpecialist}
            setTags={setLocalComplianceSpecialist}
            tags={dummyTags}
            isMandatory={false}
            showMissingEntryError={false}
          />
          { localComplianceSpecialistError && <span className={classNames("error-message", Styles.tagError)}>Please enter valid email address.</span> }
        </div>
        <div className={Styles.addBtn}>
          <button
            onClick={updateMode ? updateConfirmModalOverlayUpdate : onEntityAdd}
            className={Styles.actionBtn + ' btn btn-tertiary'}
            type="button"
          >
            {updateMode ? <span>Update</span> : <span>Add</span>}
          </button>
        </div>
      </div>
      {updateConfirmModalOverlay && (
        <div className={Styles.updateModelOverlayContent}>
          <p>
            Do you want to proceed with updating &lt;&lt;{entity.entityName ? entity.entityName : ''}&gt;&gt;?
          </p>
          <div>
            <button
              className={Styles.actionBtn + ' btn btn-default'}
              type="button"
              onClick={updateConfirmModalOverlayCancel}
            >
              Cancel
            </button>{' '}
            &nbsp;
            <button className={Styles.actionBtn + ' btn btn-tertiary'} type="button" onClick={onEntityUpdate}>
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={Styles.mainPanel}>
      <div className={Styles.caption}>
        <h3>Data Compliance Network List</h3>
      </div>
      <div className={Styles.wrapper}>
        <div className={Styles.searchPanel}>
          <div className={`input-field-group search-field ${loading ? 'disabled' : ''}`}>
            <label id="searchLabel" className="input-label" htmlFor="searchInput">
              Search Entries
            </label>
            <input
              type="text"
              className="input-field search"
              required={false}
              id="searchInput"
              maxLength={200}
              placeholder="Type here"
              autoComplete="off"
              onChange={onSearchTextChange}
              disabled={loading}
            />
          </div>
          {
            isAdmin &&
              <div
                className={classNames(
                  Styles.addItemButton,
                  loading ? Styles.disabledAddItemBtn : '',
                )}
              >
                <button onClick={onEntityFormModalOpen}>
                  <i className="icon mbc-icon plus" />
                  <span>Add New Entity</span>
                </button>
              </div>
          }
          <div className={Styles.addItemButton}>
            <button onClick={() => setShowChangeLog(prev => !prev)}>
              <i className="icon mbc-icon link" />
              <span>{showChangeLog ? 'Hide Change Log' : 'See Change Log'}</span>
            </button>
          </div>
        </div>
        { loading && <Spinner /> }
        { !loading && dataComplianceNetworkList.length === 0 && <div className={Styles.tagIsEmpty}>There is no list available</div> }
        { !loading && !showChangeLog && dataComplianceNetworkList.length > 0 && 
          <div className={Styles.tablePanel}>
            <table className="ul-table">
              <thead>
                <tr className="header-row">
                  <th onClick={() => sortEntities('entityId', sortBy.nextSortType)}>
                    <label
                      className={
                        'sortable-column-header ' +
                        (sortBy.name === 'entityId' ? sortBy.currentSortType : '')
                      }
                    >
                      <i className="icon sort" />
                      Entity ID
                    </label>
                  </th>
                  <th onClick={() => sortEntities('entityName', sortBy.nextSortType)}>
                    <label
                      className={
                        'sortable-column-header ' +
                        (sortBy.name === 'entityName' ? sortBy.currentSortType : '')
                      }
                    >
                      <i className="icon sort" />
                      Entity Name
                    </label>
                  </th>
                  <th>
                    <label>
                        <i className={classNames("icon mbc-icon info iconsmd", Styles.infoIcon)} tooltip-data="- First point of contact for data compliance question
                      - Reporting line to IL/C" />
                        Local Compliance Officer (LCO)
                    </label>
                  </th>
                  <th>
                    <label>
                        <i className={classNames("icon mbc-icon info iconsmd", Styles.infoIcon)} tooltip-data="- First point of contact for data compliance question
                        - Employee of the respective Group entity" />
                        Local Compliance Responsible (LCR)
                    </label>
                  </th>
                  <th>
                    <label>
                        <i className={classNames("icon mbc-icon info iconsmd", Styles.infoIcon)} tooltip-data="(old role, sucessive to be 
                          replaced by LCO/LCR)" />
                        Data Protection Coordinator (DPC)
                    </label>
                  </th>
                  <th>
                    <label>
                        <i className={classNames("icon mbc-icon info iconsmd", Styles.infoIcon)} tooltip-data="- In case of reporting line to LCO, Local Compliance Specialist.
                        - In all other cases Local Compliance Support" />
                        Local Compliance Support / Specialist (LCS)
                    </label>
                  </th>
                  {
                    isAdmin &&
                      <th className={Styles.actionLinksTD}>
                        <label>Action</label>
                      </th>
                  }
                </tr>
              </thead>
              <tbody>
                {
                  dataComplianceNetworkList.map((result) => {
                    return (
                      <RowItem
                        item={result}
                        key={result.id}
                        isAdmin={isAdmin}
                        showDeleteConfirmModal={showDeleteConfirmModal}
                        showUpdateConfirmModal={showUpdateConfirmModal}
                      />
                    );
                  })
                }
              </tbody>
            </table>
            {dataComplianceNetworkList.length &&
              <Pagination
                totalPages={totalNumberOfPages}
                pageNumber={currentPageNumber}
                onPreviousClick={onPaginationPreviousClick}
                onNextClick={onPaginationNextClick}
                onViewByNumbers={onViewByPageNum}
                displayByPage={true}
              />
            }
          </div>
        }
        { !loading && showChangeLog &&
          <div className={Styles.changeLogContainer}>
            <div className={Styles.tablePanel}>
              <table className="ul-table solutions">
                <thead>
                  <tr className="header-row">
                    <th>
                      <label>
                          Change Date
                      </label>
                    </th>
                    <th>
                      <label>
                          Modified By
                      </label>
                    </th>
                    <th>
                      <label>
                          Change Description
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {changeLogs
                    ? changeLogs.map((data: IChangeLogData, index: number) => {
                        return (
                          <tr key={index} className="data-row">
                            <td className="wrap-text">
                              {/* {regionalDateAndTimeConversionSolution(data.changeDate)} */}
                              {data.changeDate}
                            </td>
                            <td className="wrap-text">
                              {data.modifiedBy.firstName}&nbsp;{data.modifiedBy.lastName}
                            </td>
                            <td className="wrap-text">{data.changeDescription}</td>
                          </tr>
                        );
                      })
                    : ''}
                </tbody>
              </table>
            </div>
          </div>
        }
        <ConfirmModal
          title="Delete Entity"
          acceptButtonTitle="Delete"
          cancelButtonTitle="Cancel"
          showAcceptButton={true}
          showCancelButton={true}
          show={showDeleteEntityConfirmModal}
          content={deleteModalContent}
          onCancel={onCancelDeleteChanges}
          onAccept={onAcceptDeleteChanges}
        />
        {
          showEntityFormModal &&
            <InfoModal
              title={updateMode ? 'Update Entity' : 'Add New Entity'}
              modalWidth={'35vw'}
              show={showEntityFormModal}
              content={entityFormModalContent}
              onCancel={onShowEntityFormModalCancel}
            />
        }
      </div>
    </div>
  );
}

export default DataComplianceNetworkList;