// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { computeIcon, getFileExtension } from 'components/Form/DocumentsInput/helpers';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import InputWrapper from '../InputWrapper';
import { DocumentsInputWrapperStyle, DocumentCountWrapperStyle, DocumentIconStyle } from './style';

type Props = {
  value: number | null,
  onChange: string => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const DocumentsInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: Props) => (
  <InputWrapper focus={focus} preselect>
    {({ ref }) => (
      // TODO: Manage props correctly and do slideview behavior
      <button
        ref={ref}
        tabIndex="-1"
        readOnly={readonly}
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

        {value.map(document => {
          const { icon, color } = computeIcon(getFileExtension(document?.name ?? ''));
          return (
            <div className={DocumentIconStyle(color)}>
              <Icon icon={icon} />
            </div>
          );
        })}
      </button>
    )}
  </InputWrapper>
);

export default DocumentsInput;
