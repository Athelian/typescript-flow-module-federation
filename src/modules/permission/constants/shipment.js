// @flow
export const SHIPMENT_LIST = 'shipment.shipments.list';
export const SHIPMENT_ORDER_LIST = 'shipment.orders.list'; // deprecated
export const SHIPMENT_FORM = 'shipment.shipments.form';
export const SHIPMENT_CREATE = 'shipment.shipments.create';
export const SHIPMENT_UPDATE = 'shipment.shipments.update';
export const SHIPMENT_SET = 'shipment.shipments.set';
/** @deprecated */
export const SHIPMENT_DOWNLOAD_DOCUMENTS = 'shipment.shipments.download';
export const SHIPMENT_DOCUMENT_GET = 'shipment.files.get';
export const SHIPMENT_DOCUMENT_DOWNLOAD = 'shipment.files.download';
export const SHIPMENT_DOCUMENT_UPDATE = 'shipment.files.update';
export const SHIPMENT_DOCUMENT_DELETE = 'shipment.files.delete';
export const SHIPMENT_DOCUMENT_GET_TYPE_BL = 'shipment.files.getByTypeBL';
export const SHIPMENT_DOCUMENT_GET_TYPE_INVOICE = 'shipment.files.getByTypeInvoice';
export const SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST = 'shipment.files.getByTypePackingList';
export const SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION =
  'shipment.files.getByTypeImportDeclaration';
export const SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION =
  'shipment.files.getByTypeInspectionApplication';
export const SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT =
  'shipment.files.getByTypeWarehouseArrivalReport';
export const SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT =
  'shipment.files.getByTypeWarehouseInspectionReport';
export const SHIPMENT_DOCUMENT_GET_TYPE_MISCELLANEOUS = 'shipment.files.getByTypeMiscellaneous';
export const SHIPMENT_DOCUMENT_CREATE = 'shipment.files.create';
export const SHIPMENT_DOCUMENT_FORM = 'shipment.files.form';
export const SHIPMENT_DOCUMENT_SET_NAME = 'shipment.files.setName';
export const SHIPMENT_DOCUMENT_SET_TAGS = 'shipment.files.setTags';
export const SHIPMENT_DOCUMENT_SET_TYPE = 'shipment.files.setType';
export const SHIPMENT_DOCUMENT_SET_ENTITY = 'shipment.files.setEntity';
export const SHIPMENT_DOCUMENT_SET_MEMO = 'shipment.files.setMemo';

export const SHIPMENT_DOCUMENT_SET = 'shipment.files.set';
export const SHIPMENT_DOCUMENT_SET_BL = 'shipment.files.setByTypeBL';
export const SHIPMENT_DOCUMENT_SET_INVOICE = 'shipment.files.setByTypeInvoice';
export const SHIPMENT_DOCUMENT_SET_PACKING_LIST = 'shipment.files.setByTypePackingList';
export const SHIPMENT_DOCUMENT_SET_IMPORT_DECLARATION = 'shipment.files.setByTypeImportDeclaration';
export const SHIPMENT_DOCUMENT_SET_INSPECTION_APPLICATION =
  'shipment.files.setByTypeInspectionApplication';
export const SHIPMENT_DOCUMENT_SET_WAREHOUSE_ARRIVAL =
  'shipment.files.setByTypeWarehouseArrivalReport';
export const SHIPMENT_DOCUMENT_SET_WAREHOUSE_INSPECTION =
  'shipment.files.setByTypeWarehouseInspectionReport';
export const SHIPMENT_DOCUMENT_SET_MISCELLANEOUS = 'shipment.files.setByTypeMiscellaneous';

export const SHIPMENT_SET_FOLLOWERS = 'shipment.shipments.setFollowers';
export const SHIPMENT_SET_ARCHIVED = 'shipment.shipments.setArchived';
export const SHIPMENT_SET_IMPORTER = 'shipment.shipments.setImporter';
export const SHIPMENT_SET_EXPORTER = 'shipment.shipments.setExporter';
export const SHIPMENT_SET_TOTAL_PACKAGE_QUANTITY =
  'shipment.shipments.setTotalPackageQuantityOverride';
export const SHIPMENT_SET_TOTAL_VOLUME = 'shipment.shipments.setTotalVolumeOverride';
export const SHIPMENT_SET_TOTAL_WEIGHT = 'shipment.shipments.setTotalWeightOverride';
export const SHIPMENT_SET_FORWARDERS = 'shipment.shipments.setForwarders';
export const SHIPMENT_SET_IN_CHARGE = 'shipment.shipments.setInCharges';
export const SHIPMENT_SET_TAGS = 'shipment.shipments.setTags';
export const SHIPMENT_SET_CUSTOM_FIELDS = 'shipment.shipments.setCustomFields';
export const SHIPMENT_SET_CUSTOM_FIELDS_MASK = 'shipment.shipments.setCustomFieldsMask';
export const SHIPMENT_SET_NO = 'shipment.shipments.setNo';
export const SHIPMENT_SET_BL_NO = 'shipment.shipments.setBlNo';
export const SHIPMENT_SET_BL_DATE = 'shipment.shipments.setBlDate';
export const SHIPMENT_SET_BOOKING_NO = 'shipment.shipments.setBookingNo';
export const SHIPMENT_SET_BOOKED = 'shipment.shipments.setBooked';
export const SHIPMENT_SET_BOOKING_DATE = 'shipment.shipments.setBookingDate';
export const SHIPMENT_SET_INVOICE_NO = 'shipment.shipments.setInvoiceNo';
export const SHIPMENT_SET_CONTRACT_NO = 'shipment.shipments.setContractNo';
export const SHIPMENT_SET_TRANSPORT_TYPE = 'shipment.shipments.setTransportType';
export const SHIPMENT_SET_LOAD_TYPE = 'shipment.shipments.setLoadType';
export const SHIPMENT_SET_INCOTERM = 'shipment.shipments.setIncoterm';
export const SHIPMENT_SET_CARRIER = 'shipment.shipments.setCarrier';
export const SHIPMENT_SET_MEMO = 'shipment.shipments.setMemo';
export const SHIPMENT_SET_PORT = 'shipment.shipments.setPort';
export const SHIPMENT_SET_TIMELINE_DATE = 'shipment.shipments.setTimelineDate';
export const SHIPMENT_SET_REVISE_TIMELINE_DATE = 'shipment.shipments.reviseTimelineDate';
export const SHIPMENT_APPROVE_TIMELINE_DATE = 'shipment.shipments.approveTimelineDate';
export const SHIPMENT_ASSIGN_TIMELINE_DATE = 'shipment.shipments.assignTimelineDate';
export const SHIPMENT_SET_WAREHOUSE = 'shipment.shipments.setWarehouse';
export const SHIPMENT_BATCH_LIST = 'shipment.batches.list';
export const SHIPMENT_ADD_BATCH = 'shipment.batches.add';
export const SHIPMENT_REMOVE_BATCH = 'shipment.batches.remove';
export const SHIPMENT_BATCH_LIST_IN_CONTAINER = 'shipment.containerBatches.list';
export const SHIPMENT_CONTAINER_LIST = 'shipment.containers.list';
export const SHIPMENT_SET_VOYAGE_NO = 'shipment.shipments.setVoyageNo';
export const SHIPMENT_SET_VESSEL_CODE = 'shipment.shipments.setVesselCode';
export const SHIPMENT_SET_VESSEL_NAME = 'shipment.shipments.setVesselName';
export const SHIPMENT_SET_VOYAGES = 'shipment.shipments.setVoyages';
export const SHIPMENT_SET_TASKS = 'shipment.shipments.setTasks';
export const SHIPMENT_SET_TASK_TEMPLATE = 'shipment.shipments.setTaskTemplate';
export const SHIPMENT_SET_MILESTONE = 'shipment.shipments.setMilestone';
export const SHIPMENT_TASK_LIST = 'shipment.tasks.list';
export const SHIPMENT_TASK_FORM = 'shipment.tasks.form';
export const SHIPMENT_TASK_CREATE = 'shipment.tasks.create';
export const SHIPMENT_TASK_UPDATE = 'shipment.tasks.update';
export const SHIPMENT_TASK_DELETE = 'shipment.tasks.delete';
export const SHIPMENT_TASK_SET_APPROVABLE = 'shipment.tasks.setApprovable';
export const SHIPMENT_TASK_SET_APPROVED = 'shipment.tasks.setApproved';
export const SHIPMENT_TASK_SET_APPROVERS = 'shipment.tasks.setApprovers';
export const SHIPMENT_TASK_SET_ASSIGNEES = 'shipment.tasks.setAssignees';
export const SHIPMENT_TASK_SET_COMPLETED = 'shipment.tasks.setCompleted';
export const SHIPMENT_TASK_SET_DESCRIPTION = 'shipment.tasks.setDescription';
export const SHIPMENT_TASK_SET_DUE_DATE = 'shipment.tasks.setDueDate';
export const SHIPMENT_TASK_SET_DUE_DATE_BINDING = 'shipment.tasks.setDueDateBinding';
export const SHIPMENT_TASK_SET_ENTITY = 'shipment.tasks.setEntity';
export const SHIPMENT_TASK_SET_IN_PROGRESS = 'shipment.tasks.setInProgress';
export const SHIPMENT_TASK_SET_SKIPPED = 'shipment.tasks.setSkipped';
export const SHIPMENT_TASK_SET_MEMO = 'shipment.tasks.setMemo';
export const SHIPMENT_TASK_SET_NAME = 'shipment.tasks.setName';
export const SHIPMENT_TASK_SET_REJECTED = 'shipment.tasks.setRejected';
export const SHIPMENT_TASK_SET_START_DATE = 'shipment.tasks.setStartDate';
export const SHIPMENT_TASK_SET_START_DATE_BINDING = 'shipment.tasks.setStartDateBinding';
export const SHIPMENT_TASK_SET_TAGS = 'shipment.tasks.setTags';
export const SHIPMENT_TASK_SET_TEMPLATE = 'shipment.tasks.setTaskTemplate';
export const SHIPMENT_TASK_SET_MILESTONE = 'shipment.tasks.setMilestone';
