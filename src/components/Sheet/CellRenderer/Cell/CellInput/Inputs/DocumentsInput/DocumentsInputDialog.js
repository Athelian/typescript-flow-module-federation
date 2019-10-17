// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import Dialog from 'components/Dialog';
import { FormContainer } from 'modules/form';
import { DocumentsInput as DocumentsSection } from 'components/Form';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
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
import DocumentsContainer from './container';

type Props = {
  value: number | null,
  onChange: string => void,
  onBlur: () => void,
  focus: boolean,
};

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const formContainer = new FormContainer();
const documentsContainer = new DocumentsContainer();

// const useOnMount = func => React.useEffect(func, []);

const DocumentsInput = ({ value, onChange, onBlur, focus }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(ORDER_SET_DOCUMENTS);

  const { state, setFieldValue, initDetailValues } = documentsContainer;

  const prevFocus = usePrevious(focus);

  React.useEffect(() => {
    if (!prevFocus && focus) {
      initDetailValues(value);
    } else if (prevFocus && !focus) {
      initDetailValues([]);
    }
  });

  return (
    <Provider inject={[formContainer, documentsContainer]}>
      <Dialog
        isOpen={focus}
        onRequestClose={() => {
          onChange(state.files);
          onBlur();
        }}
      >
        <DocumentsSection
          removable={canSetDocuments || hasPermission([ORDER_DOCUMENT_DELETE, DOCUMENT_DELETE])}
          uploadable={canSetDocuments || hasPermission([ORDER_DOCUMENT_CREATE, DOCUMENT_CREATE])}
          editable={{
            status:
              canSetDocuments ||
              hasPermission([DOCUMENT_SET_STATUS, ORDER_DOCUMENT_SET_STATUS, DOCUMENT_UPDATE]),
            type:
              canSetDocuments ||
              hasPermission([DOCUMENT_SET_TYPE, ORDER_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]),
            memo:
              canSetDocuments ||
              hasPermission([DOCUMENT_SET_MEMO, ORDER_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]),
          }}
          downloadable={hasPermission(ORDER_DOWNLOAD_DOCUMENTS)}
          files={state.files}
          onSave={setFieldValue}
          entity="Order"
        />
      </Dialog>
    </Provider>
  );
};

export default DocumentsInput;
