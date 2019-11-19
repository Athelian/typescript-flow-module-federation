// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FilePayload } from 'generated/graphql';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { computeIcon, getFileExtension } from 'components/Form/DocumentsInput/helpers';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import DocumentsInputDialog from './DocumentsInputDialog';
import { DocumentsInputWrapperStyle, DocumentCountWrapperStyle, DocumentIconStyle } from './style';

type Props = {
  ...InputProps<Array<FilePayload>>,
  entityType: string,
};

const DocumentsInputImpl = ({
  value,
  focus,
  readonly,
  onChange,
  forceFocus,
  forceBlur,
  entityType,
}: Props) => {
  const [filesValue, setFilesValue] = React.useState(value);

  React.useEffect(() => setFilesValue(value), [value]);

  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div onBlur={handleBlur}>
      <button
        disabled={readonly}
        onClick={forceFocus}
        type="button"
        className={DocumentsInputWrapperStyle}
      >
        <div className={DocumentIconStyle('DOCUMENT')}>
          <Icon icon="DOCUMENT" />
        </div>

        <div className={DocumentCountWrapperStyle}>
          <div className={CellDisplayWrapperStyle}>
            <span className={DisplayContentStyle}>
              {(filesValue || []).length === 1 ? (
                <FormattedMessage
                  id="modules.sheet.doc"
                  defaultMessage="{numOfDocuments} Doc"
                  values={{ numOfDocuments: <FormattedNumber value={(filesValue || []).length} /> }}
                />
              ) : (
                <FormattedMessage
                  id="modules.sheet.docs"
                  defaultMessage="{numOfDocuments} Docs"
                  values={{ numOfDocuments: <FormattedNumber value={(filesValue || []).length} /> }}
                />
              )}
            </span>
          </div>
        </div>

        {(filesValue || []).map((document, index) => {
          const { icon, color } = computeIcon(getFileExtension(document?.name ?? ''));
          return (
            <div className={DocumentIconStyle(color)} key={`${document?.name}-${index + 0}`}>
              <Icon icon={icon} />
            </div>
          );
        })}
      </button>

      <DocumentsInputDialog
        value={filesValue || []}
        onChange={setFilesValue}
        onClose={() => {
          onChange(filesValue, true);
          forceBlur();
        }}
        open={focus}
        entityType={entityType}
      />
    </div>
  );
};

const DocumentsInput = (entityType: string) => (props: InputProps<Array<FilePayload>>) => (
  <DocumentsInputImpl {...props} entityType={entityType} />
);

export default {
  Order: DocumentsInput('Order'),
  OrderItem: DocumentsInput('OrderItem'),
  Shipment: DocumentsInput('Shipment'),
  Milestone: DocumentsInput('Milestone'),
};
