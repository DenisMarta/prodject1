import classNames from 'classnames';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Styles from './graph.scss';
// dna-container
import FullScreenModeIcon from 'dna-container/FullScreenModeIcon';
import Modal from 'dna-container/Modal';
import GraphTable from '../../components/GraphTable';
import TableForm from '../../components/tableForm/TableForm';
import SlidingModal from '../../components/slidingModal/SlidingModal';
import { setBox, setTables } from '../../redux/graphSlice';
import { getProjectDetails } from '../../redux/graph.services';

const Graph = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const {
        box,
        version,
        project,
    } = useSelector(state => state.graph);

    useEffect(() => {
        dispatch(getProjectDetails(id));
    }, [id, dispatch]);

    /* A callback function that is used to update the viewbox of the svg. */
    const resizeHandler = useCallback(() => {
        dispatch(setBox({
            x: box.x,
            y: box.y,
            w:
                box.w && box.clientW
                    ? box.w * (window.innerWidth / box.clientW)
                    : window.innerWidth,
            h:
                box.h && box.clientH
                    ? box.h * (window.innerHeight / box.clientH)
                    : window.innerHeight,
            clientW: window.innerWidth,
            clientH: window.innerHeight,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        resizeHandler();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    // const tableList = useMemo(() => Object.values(tableDict), [tableDict]);
    const svg = useRef();

    // ''|dragging|moving|linking
    const [mode, setMode] = useState('');
    // offset of svg origin
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [movingTable, setMovingTable] = useState();

    // const [editingLink, setEditingLink] = useState(null);
    const [tableSelectedId, setTableSelectId] = useState(null);

    /**
     * It sets the offset to the mouse position relative to the box, and sets the mode to 'draging'
     */
    const mouseDownHandler = e => {
        if (e.target.tagName === 'svg' && e.button !== 2) {
            setOffset({
                x: box.x + (e.clientX * box.w) / global.innerWidth,
                y: box.y + (e.clientY * box.h) / global.innerHeight,
            });
            setMode('draging');
        }
    };

    /**
     * When the user releases the mouse button, if the user was in linking mode, and the user is not
     * linking the same table to itself, then add a new link to the link dictionary
     */
    const mouseUpHandler = () => {
        setMode('');
        setMovingTable(null);
    };

    /**
     * It sets the moving table to the table that was clicked on, and sets the mode to moving
     * @param e - the event object
     * @param table - the table object that was clicked on
     */
    const tableMouseDownHandler = (e, table) => {
        if (e.button === 2 || version !== 'currentVersion') return;
        const { x: cursorX, y: cursorY } = getSVGCursor(e);

        setMovingTable({
            id: table.id,
            offsetX: cursorX - table.x,
            offsetY: cursorY - table.y,
        });

        setMode('moving');
        e.preventDefault();
        // e.stopPropagation();
    };

    /**
     * It takes a mouse event and returns the cursor position in SVG coordinates
     * @returns The cursor position in the SVG coordinate system.
     */
    const getSVGCursor = ({ clientX, clientY }) => {
        let point = svg.current.createSVGPoint();
        point.x = clientX;
        point.y = clientY;

        return point.matrixTransform(svg.current.getScreenCTM().inverse());
    };

    /**
     * > When the mouse is moving, if the mode is 'draging', then update the box state with the new x
     * and y values. If the mode is 'moving', then update the tableDict state with the new x and y
     * values. If the mode is 'linking', then update the linkStat state with the new endX and endY
     * values
     */
    const mouseMoveHandler = e => {
        if (!mode) return;
        if (mode === 'draging') {
            dispatch(setBox({
                w: box.w,
                h: box.h,
                x: offset.x - e.clientX * (box.w / global.innerWidth),
                y: offset.y - e.clientY * (box.h / global.innerHeight),
                clientH: box.clientH,
                clientW: box.clientW,
            }));
        }

        if (mode === 'moving') {
            const { x: cursorX, y: cursorY } = getSVGCursor(e);
            const projectTables = project.tables.map(table =>
                table.id === movingTable.id ? {...table, x: cursorX - movingTable.offsetX, y: cursorY - movingTable.offsetY} : table
            );
            dispatch(setTables([...projectTables]));
        }
    };

    const [toggleModal, setToggleModal] = useState(false);
    const [showInferenceModal, setShowInferenceModal] = useState(false);

    const inferenceContent = <>
        <p>Access data using any endpoints</p>
        <div className={classNames('input-field-group')}>
            <label className={classNames(Styles.inputLabel, 'input-label')}>
                Inference by
            </label>
            <div className={Styles.flexLayout}>
                <label className="checkbox">
                    <span className="wrapper">
                        <input type="checkbox" className="ff-only" />
                    </span>
                    <span className="label">REST</span>
                </label>
                <label className="checkbox">
                    <span className="wrapper">
                        <input type="checkbox" className="ff-only" />
                    </span>
                    <span className="label">GRAPHQL</span>
                </label>
                <label className="checkbox">
                    <span className="wrapper">
                        <input type="checkbox" className="ff-only" />
                    </span>
                    <span className="label">ODATA</span>
                </label>
                <label className="checkbox">
                    <span className="wrapper">
                        <input type="checkbox" className="ff-only" />
                    </span>
                    <span className="label">SQL</span>
                </label>
                <div>&nbsp;</div>
            </div>

            <label className={classNames(Styles.inputLabel, 'input-label')}>
                Coming Soon
            </label>
            <div className={classNames(Styles.flexLayout, Styles.disabled)}>
                <label className="checkbox">
                    <span className="wrapper">
                        <input type="checkbox" className="ff-only" disabled={true} />
                    </span>
                    <span className="label">DDX</span>
                </label>
                <label className="checkbox">
                    <span className="wrapper">
                        <input type="checkbox" className="ff-only" disabled={true} />
                    </span>
                    <span className="label">CDC</span>
                </label>
            </div>
            <button
                className={classNames('btn btn-primary')}
                type="button"
                onClick={() => { setShowInferenceModal(false) }}
            >
                Create Inference
            </button>
        </div>
    </>;    


    const [showCollabModal, setShowCollabModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState({});

    const handleShowCollabModal = (table) => {
        setSelectedTable(table);
        setShowCollabModal(true);
    }

    const collabModalContent = <>
        <p>{selectedTable.name}</p>
        <div className={Styles.dagCollContent}>
            <div className={Styles.dagCollContentList}>
                <div className={Styles.dagCollContentListAdd}>
                <AddUser getCollabarators={getCollabarators} dagId={dagItem.dagName} />
                </div>
                <div className={Styles.dagCollUsersList}>
                {dagItem.collaborators?.length > 0 ? (
                    <React.Fragment>
                    <div className={Styles.collUserTitle}>
                        <div className={Styles.collUserTitleCol}>User ID</div>
                        <div className={Styles.collUserTitleCol}>Name</div>
                        <div className={Styles.collUserTitleCol}>Permission</div>
                        <div className={Styles.collUserTitleCol}></div>
                    </div>
                    <div className={Styles.collUserContent}>
                        {dagItem.collaborators.map(
                        (item: IPipelineProjectDagsCollabarator, collIndex: any) => {
                            return (
                            <div
                                key={index + '-' + collIndex}
                                className={Styles.collUserContentRow}
                            >
                                <div className={Styles.collUserTitleCol}>{item.username}</div>
                                <div className={Styles.collUserTitleCol}>
                                {item.firstName + ' ' + item.lastName}
                                </div>
                                <div className={Styles.collUserTitleCol}>
                                <div
                                    className={classNames(
                                    'input-field-group include-error ' + Styles.inputGrp,
                                    )}
                                >
                                    <label className={'checkbox ' + Styles.checkBoxDisable}>
                                    <span className="wrapper">
                                        <input
                                        type="checkbox"
                                        className="ff-only"
                                        value="can_read"
                                        checked={true}
                                        />
                                    </span>
                                    <span className="label">Read</span>
                                    </label>
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                <div
                                    className={classNames(
                                    'input-field-group include-error ' + Styles.inputGrp,
                                    )}
                                >
                                    <label className={'checkbox ' + Styles.writeAccess}>
                                    <span className="wrapper">
                                        <input
                                        type="checkbox"
                                        className="ff-only"
                                        value="can_edit"
                                        checked={
                                            item.permissions !== null
                                            ? item.permissions.includes('can_edit')
                                            : false
                                        }
                                        onClick={onPermissionEdit(dagItem.dagName, collIndex)}
                                        />
                                    </span>
                                    <span className="label">Write</span>
                                    </label>
                                </div>
                                </div>
                                <div className={Styles.collUserTitleCol}>
                                <div
                                    className={Styles.deleteEntry}
                                    onClick={onCollabaratorDelete(dagItem.dagName, collIndex)}
                                >
                                    <i className="icon mbc-icon trash-outline" />
                                    Delete Entry
                                </div>
                                </div>
                            </div>
                            );
                        },
                        )}
                    </div>
                    </React.Fragment>
                ) : (
                    <div className={Styles.dagCollContentEmpoty}>
                    <h6> Collaborators Not Exist!</h6>
                    </div>
                )}
                </div>
            </div>
            </div>
    </>;
  
  return (
    <>
      <div className={classNames(Styles.mainPanel)}>
        <div className={Styles.nbheader}>
            <div className={Styles.headerdetails}>
              {/* <img src={Envs.DNA_BRAND_LOGO_URL} className={Styles.Logo} /> */}
              <div className={Styles.nbtitle}>
                <button tooltip-data="Go Back" className="btn btn-text back arrow" onClick={() => { history.back() }}></button>
                <h2>Datalake Project</h2>
              </div>
            </div>
            <div className={Styles.navigation}>
                <div className={Styles.headerright}>
                    <div>
                        <button
                            className={classNames('btn btn-primary', Styles.btnOutline)}
                            type="button"
                            onClick={() => { setShowInferenceModal(true) }}
                        >
                            <i className="icon mbc-icon plus" />
                            <span>Add Inference</span>
                        </button>
                    </div>
                    <div>
                        <button
                            className={classNames('btn btn-primary', Styles.btnOutline)}
                            type="button"
                            onClick={() => { setToggleModal(!toggleModal)}}
                        >
                            <i className="icon mbc-icon plus" />
                            <span>Add Table</span>
                        </button>
                    </div>
                  <div tooltip-data="Open New Tab" className={Styles.OpenNewTab}>
                    <i className="icon mbc-icon arrow small right" />
                    <span> &nbsp; </span>
                  </div>
                  <div>
                    <FullScreenModeIcon fsNeed={false} />
                  </div>
                </div>
            </div>
        </div>
        <div className={classNames(Styles.content)}>
          <div className="graph">
            <svg
              className="main"
              viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
              onMouseDown={mouseDownHandler}
              onMouseUp={mouseUpHandler}
              onMouseMove={mouseMoveHandler}
              // onWheel={wheelHandler}
              ref={svg}
            >
              {project?.tables?.length > 0 && project.tables.map(table => {
                return (
                    <>
                        <GraphTable
                            key={table.id}
                            table={table}
                            onTableMouseDown={tableMouseDownHandler}
                            tableSelectedId={tableSelectedId}
                            setTableSelectId={setTableSelectId}
                            onHandleCollabModal={handleShowCollabModal}
                        />
                    </>
                );
              })}
            </svg>
          </div>
        </div>
        
        <div style={{textAlign: 'right', marginTop: '20px'}}>
                <button className={classNames('btn btn-tertiary')}>Publish</button>
            </div>
      </div>
      
      { toggleModal && 
        <SlidingModal
            title={'Add Table'}
            toggle={toggleModal}
            setToggle={() => setToggleModal(!toggleModal)}
            content={<TableForm setToggle={() => setToggleModal(!toggleModal)}  />}
        />
    }

    {showCollabModal && (
            <Modal
                title={'Manage Collaborators for Table'}
                showAcceptButton={false}
                showCancelButton={false}
                modalWidth={'60%'}
                buttonAlignment="right"
                show={showCollabModal}
                content={collabModalContent}
                scrollableContent={false}
                onCancel={() => setShowCollabModal(false)}
                modalStyle={{
                    padding: '50px 35px 35px 35px',
                    minWidth: 'unset',
                    width: '60%',
                    maxWidth: '50vw'
                }}
            />
            )    
        }

    { showInferenceModal &&
        <Modal
            title={'Add Inference'}
            showAcceptButton={false}
            showCancelButton={false}
            modalWidth={'35%'}
            buttonAlignment="right"
            show={showInferenceModal}
            content={inferenceContent}
            scrollableContent={false}
            onCancel={() => {
                setShowInferenceModal(false);
            }}
        />
    }
    </>
  );
}

export default Graph;