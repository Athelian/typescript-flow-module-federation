// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormField } from 'modules/form';
import { SelectInput, DefaultSelect, DefaultOptions, Display } from 'components/Form';
import { TextAreaInputFactory } from 'modules/form/factories';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import type { Document, FileType } from 'components/Form/DocumentsInput/type.js.flow';
import { computeIcon, getFileExtension, getFileName } from './helpers';
import {
  DocumentWrapperStyle,
  DocumentCardStyle,
  FileExtensionIconStyle,
  BottomWrapperStyle,
  FileNameWrapperStyle,
  FileNameStyle,
  DownloadButtonStyle,
  DeleteButtonStyle,
  MemoWrapperStyle,
  OpenMemoButtonStyle,
} from './style';

type OptionalProps = {
  onChange: (string, any) => void,
  onBlur: (string, boolean) => void,
  onRemove: Function,
  readOnly: boolean,
  downloadDisabled: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: Document,
  types: Array<FileType>,
};

type State = {
  isExpanded: boolean,
};

const defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  onRemove: () => {},
  readOnly: false,
  downloadDisabled: false,
};

class DocumentItem extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  state = {
    isExpanded: false,
  };

  toggleMemo = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  render() {
    const {
      name,
      value,
      onChange,
      onBlur,
      onRemove,
      types,
      readOnly,
      downloadDisabled,
    } = this.props;
    const { isExpanded } = this.state;

    const fileExtension = getFileExtension(value.name);
    const fileName = getFileName(value.name);
    const fileIcon = computeIcon(fileExtension);

    const type = types.find(t => t.type === value.type);

    return (
      <div className={DocumentWrapperStyle(isExpanded)}>
        {!readOnly && (
          <button type="button" className={DeleteButtonStyle} onClick={onRemove}>
            <Icon icon="REMOVE" />
          </button>
        )}
        <div className={DocumentCardStyle}>
          {readOnly ? (
            <Display height="30px" align="left">
              {type ? type.label : ''}
            </Display>
          ) : (
            <SelectInput
              name={`${name}.type`}
              value={value.type}
              onBlur={onBlur}
              onChange={({ type: newType }) => onChange(`${name}.type`, newType)}
              readOnly={readOnly}
              items={types}
              itemToValue={v => (v ? v.type : null)}
              itemToString={v => (v ? v.label : '')}
              renderSelect={({ ...rest }) => (
                <DefaultSelect {...rest} required align="left" width="120px" />
              )}
              renderOptions={({ ...rest }) => (
                <DefaultOptions {...rest} align="left" width="120px" />
              )}
            />
          )}
          <div className={FileExtensionIconStyle(fileIcon.color)}>
            <Icon icon={fileIcon.icon} />
          </div>
          <div className={BottomWrapperStyle}>
            <div className={FileNameWrapperStyle}>
              <div className={FileNameStyle}>{fileName}</div>
              {`.${fileExtension}`}
            </div>
            {downloadDisabled ? (
              <Tooltip
                message={
                  <FormattedMessage
                    id="components.documentInput.cantDownload"
                    defaultMessage="You do not have the rights to download this document"
                  />
                }
              >
                <div className={DownloadButtonStyle(true)}>
                  <Icon icon="DOWNLOAD" />
                </div>
              </Tooltip>
            ) : (
              <button
                type="button"
                className={DownloadButtonStyle(false)}
                onClick={() => {
                  window.open(value.path, '_blank');
                }}
              >
                <Icon icon="DOWNLOAD" />
              </button>
            )}
          </div>
        </div>
        <div className={MemoWrapperStyle(isExpanded)}>
          <FormField name={`${name}.memo`} initValue={value.memo} setFieldValue={onChange}>
            {({ name: fieldName, ...inputHandlers }) => (
              <TextAreaInputFactory
                name={fieldName}
                {...inputHandlers}
                isNew={false}
                originalValue={value.memo}
                editable={!readOnly}
                inputWidth="590px"
                inputHeight="120px"
              />
            )}
          </FormField>
        </div>
        <button
          type="button"
          onClick={() => this.toggleMemo()}
          className={OpenMemoButtonStyle(isExpanded, !!value.memo)}
        >
          <Icon icon={isExpanded ? 'CHEVRON_DOWN' : 'MEMO'} />
        </button>
      </div>
    );
  }
}

export default DocumentItem;
