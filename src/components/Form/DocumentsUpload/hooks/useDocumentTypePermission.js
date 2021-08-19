// @flow
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';

import {
  SHIPMENT_DOCUMENT_SET_BL,
  SHIPMENT_DOCUMENT_SET_INVOICE,
  SHIPMENT_DOCUMENT_SET_PACKING_LIST,
  SHIPMENT_DOCUMENT_SET_IMPORT_DECLARATION,
  SHIPMENT_DOCUMENT_SET_INSPECTION_APPLICATION,
  SHIPMENT_DOCUMENT_SET_WAREHOUSE_ARRIVAL,
  SHIPMENT_DOCUMENT_SET_WAREHOUSE_INSPECTION,
  SHIPMENT_DOCUMENT_SET_MISCELLANEOUS,
  SHIPMENT_DOCUMENT_GET_TYPE_BL,
  SHIPMENT_DOCUMENT_GET_TYPE_INVOICE,
  SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST,
  SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
  SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT,
  SHIPMENT_DOCUMENT_GET_TYPE_MISCELLANEOUS,
} from 'modules/permission/constants/shipment';

interface Props {
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider' | 'Milestone';
}

/**
 * for retrieving the permissions of a document type of an entity
 */
const useDocumentTypePermission = ({ entity }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  if (entity !== 'Shipment') {
    return {};
  }

  return {
    ShipmentBl: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_BL]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_BL]),
    },
    ShipmentInvoice: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_INVOICE]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_INVOICE]),
    },
    ShipmentPackingList: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_PACKING_LIST]),
    },
    ShipmentImportDeclaration: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_IMPORT_DECLARATION]),
    },
    ShipmentInspectionApplication: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_INSPECTION_APPLICATION]),
    },
    ShipmentWarehouseArrivalReport: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_WAREHOUSE_ARRIVAL]),
    },
    ShipmentWarehouseInspectionReport: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_WAREHOUSE_INSPECTION]),
    },
    // this is miscellaneous type
    Document: {
      canGet: hasPermission([SHIPMENT_DOCUMENT_GET_TYPE_MISCELLANEOUS]),
      canSet: hasPermission([SHIPMENT_DOCUMENT_SET_MISCELLANEOUS]),
    },
  };
};

export default useDocumentTypePermission;
