// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { getByPathWithDefault } from 'utils/fp';
import { OrderFilesContainer } from 'modules/order/form/containers';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import {
  ORDER_UPDATE,
  ORDER_SET_DOCUMENTS,
  ORDER_DOWNLOAD_DOCUMENTS,
  ORDER_DOCUMENT_DELETE,
  ORDER_DOCUMENT_CREATE,
  ORDER_DOCUMENT_SET_MEMO,
  ORDER_DOCUMENT_SET_STATUS,
  ORDER_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/order';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_MEMO,
  DOCUMENT_SET_STATUS,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';
import { DocumentsUpload } from 'components/Form';
import { orderFormFilesQuery } from './query';

type Props = {
  isLoading: boolean,
  entityId: string,
};

function DocumentsSection({ isLoading, entityId }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(ORDER_SET_DOCUMENTS);

  return (
    <Subscribe to={[OrderFilesContainer]}>
      {({ state: { files }, initDetailValues, setFieldValue }) => (
        <QueryPlaceHolder
          PlaceHolder={() => <ListCardPlaceHolder height={540} />}
          query={orderFormFilesQuery}
          entityId={entityId}
          isLoading={isLoading}
          onCompleted={result => {
            initDetailValues(getByPathWithDefault([], 'order.files', result));
          }}
        >
          {() => {
            return (
              <DocumentsUpload
                removable={
                  canSetDocuments || hasPermission([ORDER_DOCUMENT_DELETE, DOCUMENT_DELETE])
                }
                uploadable={
                  canSetDocuments || hasPermission([ORDER_DOCUMENT_CREATE, DOCUMENT_CREATE])
                }
                addable={canSetDocuments || hasPermission([ORDER_UPDATE])}
                editable={{
                  status:
                    canSetDocuments ||
                    hasPermission([
                      DOCUMENT_SET_STATUS,
                      ORDER_DOCUMENT_SET_STATUS,
                      DOCUMENT_UPDATE,
                    ]),
                  type:
                    canSetDocuments ||
                    hasPermission([DOCUMENT_SET_TYPE, ORDER_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]),
                  memo:
                    canSetDocuments ||
                    hasPermission([DOCUMENT_SET_MEMO, ORDER_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]),
                }}
                downloadable={hasPermission(ORDER_DOWNLOAD_DOCUMENTS)}
                viewForm={hasPermission(DOCUMENT_FORM)}
                files={files}
                onSave={updateFiles => setFieldValue('files', updateFiles)}
                entity="Order"
              />
            );
          }}
        </QueryPlaceHolder>
      )}
    </Subscribe>
  );
}

export default DocumentsSection;
