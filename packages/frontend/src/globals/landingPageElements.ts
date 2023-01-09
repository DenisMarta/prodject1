import { Envs } from 'globals/Envs';

const enableMalwareScanService = Envs.ENABLE_MALWARE_SCAN_SERVICE;
const enableDataPipelineService = Envs.ENABLE_DATA_PIPELINE_SERVICE;
const enableMyModelRegistryService = Envs.ENABLE_MY_MODEL_REGISTRY_SERVICE;
const enableMLPipelineService = Envs.ENABLE_ML_PIPELINE_SERVICE;
const enableStorageService = Envs.ENABLE_STORAGE_SERVICE;
const mLPipelineUrl = enableMLPipelineService ? Envs.ML_PIPELINE_URL : '#/comingsoon';
const enableChronosForecastingService = Envs.ENABLE_CHRONOS_FORECASTING_SERVICE;
const enableSapAnalyticsCloud = Envs.ENABLE_SAP_ANALYTICS_CLOUD;
const sapAnalyticsUrl = Envs.SAP_ANALYTICS_CLOUD_URL;
const enableCodeSpace = Envs.ENABLE_CODE_SPACE;
const enableJupiyterNoteWorkspace = Envs.ENABLE_JUPYTER_WORKSPACE;
const enableDataikuWorkspace = Envs.ENABLE_DATAIKU_WORKSPACE;

export const DataLayerElements = [
  {
    name: 'Data Model',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: true,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'KPI Wiki',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '',
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: true,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'CarLA Economic Model',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: true,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'Corporate Data Catalogue',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: true,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'SAP Connection Book',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: true,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'Smart Data Governance',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: true,
    isSmallCard: false,
    isMediumCard: true,
  },
];

export const DataGovernanceElements = [
  {
    name: 'DGO Social Intranet',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: Envs.DATA_GOVERNANCE_INFO_LINK,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
    svgIcon: 'datagovernancesocialintranet',
  },
  {
    name: 'Minimum Information',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/data/datasharing/create',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
    svgIcon: 'a22minimuminformation',
  },
  {
    name: 'LCO/LCR Contacts',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/data/datacompliancenetworklist',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
  },
];

export const ToolsLandingPageElements = [
  {
    name: 'Malware Scan',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/malwarescanservice',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableMalwareScanService,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'Data Pipeline',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/pipeline',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableDataPipelineService,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'ML Pipeline',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: mLPipelineUrl,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: !enableMLPipelineService,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'My Storage',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/storage',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableStorageService,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'My Model Registry',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/modelregistry',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableMyModelRegistryService,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'Chronos Forecasting',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/chronos',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableChronosForecastingService,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'Jupyter Notebook',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/notebook',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableJupiyterNoteWorkspace,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'Dataiku',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/mydataiku',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableDataikuWorkspace,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'SAP Analytics Cloud',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: sapAnalyticsUrl,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: !enableSapAnalyticsCloud,
    isSmallCard: false,
    isMediumCard: true,
  },
  {
    name: 'My Code Space (Beta)',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/codespaces',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: !enableCodeSpace,
    isSmallCard: false,
    isMediumCard: true,
  },
];

export const TranparencyLandingPageElements = [
  {
    name: 'Portfolio',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/portfolio',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
    svgIcon: 'portfolio',
  },
  {
    name: 'Solutions',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/allsolutions',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
    svgIcon: 'solutionoverview',
  },
  {
    name: 'Reports',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/allreports',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
    svgIcon: 'reports',
  },
  {
    name: 'Data Sharing',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/data/datasharing',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
    svgIcon: 'datasharing',
  },
];

export const DataLandingPageElements = [
  {
    name: 'Data Products',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/data/dataproducts',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIcon: 'dataproductoverview',
  },
  {
    name: 'Data Layer',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/data/datalayer',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIcon: 'datamodel',
  },
  {
    name: 'Data Governance',
    description:
      'Data is one of the most valuable assets in our company, therefore we treat our data as a product! We offer you a growing selection of intuitive to use and well documented data products - check it out!',
    tags: ['Self Service', 'FOSS'],
    url: '/data/datagovernance',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIcon: 'datagovernance',
  },
];

export const TrainingsLandingPageElements = [
  {
    name: 'Udemy',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: ['Self Service', 'FOSS'],
    url: Envs.UDEMY_URL,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataProducts',
  },
  {
    name: 'LinkedIn Learning',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: ['Self Service', 'FOSS'],
    url: Envs.LINKEDIN_LEARNING_URL,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataLayer',
  },
  {
    name: 'Dataiku',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: ['Self Service', 'FOSS'],
    url: Envs.DATAIKU_TRAINING_APP_URL,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataLayer',
  },
  {
    name: 'PowerBI',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: ['Self Service', 'FOSS'],
    url: Envs.POWERBI_TRAINING_URL,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataLayer',
  },
  {
    name: 'SAC',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: ['Self Service', 'FOSS'],
    url: Envs.SAC_TRAINING_URL,
    isExternalLink: true,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: true,
  },
];

export const CarlaLandingPageElements = [
  {
    name: 'Architecture',
    description:
      'Amet consetetur lorem ipsum dolor sit amet.',
    tags: ['Self Service', 'FOSS'],
    url: '/',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataProducts',
  },
  {
    name: 'Solutions',
    description:
      'Amet consetetur lorem ipsum dolor sit amet.',
    tags: ['Self Service', 'FOSS'],
    url: '/',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataLayer',
  },
  {
    name: 'Data',
    description:
      'Amet consetetur lorem ipsum dolor sit amet.',
    tags: ['Self Service', 'FOSS'],
    url: '/',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataLayer',
  },
  {
    name: 'Transactional Data',
    description:
      'Amet consetetur lorem ipsum dolor sit amet.',
    tags: ['Self Service', 'FOSS'],
    url: '/',
    isExternalLink: false,
    isTextAlignLeft: false,
    isDisabled: false,
    isSmallCard: false,
    isMediumCard: false,
    svgIconId: 'IconDataLayer',
  },
];