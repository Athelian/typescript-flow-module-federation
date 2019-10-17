// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { computeIcon, getFileExtension } from 'components/Form/DocumentsInput/helpers';
// import usePermission from 'hooks/usePermission';
// import usePartnerPermission from 'hooks/usePartnerPermission';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
// import {
//   ORDER_SET_DOCUMENTS,
//   ORDER_DOWNLOAD_DOCUMENTS,
//   ORDER_DOCUMENT_DELETE,
//   ORDER_DOCUMENT_CREATE,
//   ORDER_DOCUMENT_SET_MEMO,
//   ORDER_DOCUMENT_SET_STATUS,
//   ORDER_DOCUMENT_SET_TYPE,
// } from 'modules/permission/constants/order';
// import {
//   DOCUMENT_CREATE,
//   DOCUMENT_DELETE,
//   DOCUMENT_SET_MEMO,
//   DOCUMENT_SET_STATUS,
//   DOCUMENT_SET_TYPE,
//   DOCUMENT_UPDATE,
// } from 'modules/permission/constants/file';
import InputWrapper from '../InputWrapper';
import { DocumentsInputWrapperStyle, DocumentCountWrapperStyle, DocumentIconStyle } from './style';

type Props = {
  value: number | null,
  entityId: ?string,
  onChange: string => void,
  focus: boolean,
  readonly: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
};

const DocumentsInput = ({
  value,
  entityId,
  focus,
  readonly,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}: Props) => {
  // const { isOwner } = usePartnerPermission();
  // const { hasPermission } = usePermission(isOwner);
  // const canSetDocuments = hasPermission(ORDER_SET_DOCUMENTS);

  const [slideViewIsOpen, setSlideViewIsOpen] = React.useState(false);

  return (
    <>
      <InputWrapper focus={focus}>
        {({ ref }) => (
          // TODO: Manage props correctly and do slideview behavior
          <button
            ref={ref}
            tabIndex="-1"
            onClick={() => {
              if (!readonly) {
                // onFocus();
                setSlideViewIsOpen(true);
              }
            }}
            onChange={e => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            type="button"
            className={DocumentsInputWrapperStyle}
          >
            <div className={DocumentIconStyle('DOCUMENT')}>
              <Icon icon="DOCUMENT" />
            </div>

            <div className={DocumentCountWrapperStyle}>
              <DisplayWrapper>
                <span>
                  {value.length === 1 ? (
                    <FormattedMessage
                      id="modules.sheet.doc"
                      defaultMessage="{numOfDocuments} Doc"
                      values={{ numOfDocuments: <FormattedNumber value={value.length} /> }}
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.sheet.docs"
                      defaultMessage="{numOfDocuments} Docs"
                      values={{ numOfDocuments: <FormattedNumber value={value.length} /> }}
                    />
                  )}
                </span>
              </DisplayWrapper>
            </div>

            {value.map((document, index) => {
              const { icon, color } = computeIcon(getFileExtension(document?.name ?? ''));
              return (
                <div className={DocumentIconStyle(color)} key={document?.name ?? index}>
                  <Icon icon={icon} />
                </div>
              );
            })}
          </button>
        )}
      </InputWrapper>

      {entityId && (
        <Dialog
          isOpen={slideViewIsOpen}
          onRequestClose={() => {
            // onChange(inputRef?.current?.value ?? '');
            onBlur();
            setSlideViewIsOpen(false);
          }}
        >
          Documents section goes here
        </Dialog>
      )}
    </>
  );
};

export default DocumentsInput;
