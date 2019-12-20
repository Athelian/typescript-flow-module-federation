// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import DocumentFormSideView from 'modules/document/index.formSlideView';
import { useAuthorizedViewer } from 'contexts/Viewer';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { getByPathWithDefault } from 'utils/fp';
import { OrderFilesContainer } from 'modules/order/form/containers';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import {
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
} from 'modules/permission/constants/file';
import { DocumentsInput, SectionHeader } from 'components/Form';
import { orderFormFilesQuery } from './query';

type Props = {
  isLoading: boolean,
  entityId: string,
};

function DocumentsSection({ isLoading, entityId }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { organization } = useAuthorizedViewer();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const canSetDocuments = hasPermission(ORDER_SET_DOCUMENTS);

  return (
    <Subscribe to={[OrderFilesContainer]}>
      {({ state: { files, ownedBy: entityOwnedBy }, initDetailValues, setFieldValue }) => (
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
              <>
                <SectionHeader
                  icon="DOCUMENT"
                  title={
                    <>
                      <FormattedMessage id="modules.Orders.documents" defaultMessage="DOCUMENTS" />{' '}
                      ({files.length})
                    </>
                  }
                />
                <DocumentsInput
                  removable={
                    canSetDocuments || hasPermission([ORDER_DOCUMENT_DELETE, DOCUMENT_DELETE])
                  }
                  uploadable={
                    canSetDocuments || hasPermission([ORDER_DOCUMENT_CREATE, DOCUMENT_CREATE])
                  }
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
                  files={files}
                  onSave={updateFiles => setFieldValue('files', updateFiles)}
                  onSelect={file =>
                    setSelectedFile({
                      ...file,
                      ownedBy: file.ownedBy || organization,
                      entity: { ...file.entity, ownedBy: file.entity?.ownedBy ?? entityOwnedBy },
                    })
                  }
                  entity="Order"
                />
                <SlideView
                  isOpen={!!selectedFile}
                  onRequestClose={() => setSelectedFile(null)}
                  shouldConfirm={() => {
                    const button = document.getElementById('document_form_save_button');
                    return button;
                  }}
                >
                  {selectedFile && (
                    <DocumentFormSideView
                      file={selectedFile}
                      onSave={updatedFile => {
                        setFieldValue(
                          'files',
                          files.map(file => (file.id === updatedFile.id ? updatedFile : file))
                        );
                        setSelectedFile(null);
                      }}
                    />
                  )}
                </SlideView>
              </>
            );
          }}
        </QueryPlaceHolder>
      )}
    </Subscribe>
  );
}

export default DocumentsSection;
