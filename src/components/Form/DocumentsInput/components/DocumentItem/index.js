// @flow
import * as React from 'react';
import {
  TextAreaInput,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
  Display,
} from 'components/Form';
import Icon from 'components/Icon';
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

type Props = {
  name: string,
  value: Document,
  readOnly?: boolean,
  onChange?: (string, any) => void,
  onBlur?: (string, boolean) => void,
  onRemove?: Function,
  types: Array<FileType>,
};

type State = {
  isExpanded: boolean,
};

class DocumentItem extends React.Component<Props, State> {
  static defaultProps = {
    readOnly: false,
    onChange: () => {},
    onBlur: () => {},
    onRemove: () => {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

  toggleMemo = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  render() {
    const { name, value, readOnly, onChange, onBlur, onRemove, types } = this.props;
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
            <Display>{type ? type.label : ''}</Display>
          ) : (
            <SelectInput
              name={`${name}.type`}
              value={value.type}
              onBlur={onBlur}
              readOnly={readOnly}
              items={types}
              itemToValue={v => (v ? v.type : null)}
              itemToString={v => (v ? v.label : '')}
              renderSelect={({ ...rest }) => (
                <DefaultSelect {...rest} required hideLabel align="left" width="200px" />
              )}
              renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" />}
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
            <button
              type="button"
              className={DownloadButtonStyle}
              onClick={() => {
                window.open(value.path, '_blank');
              }}
            >
              <Icon icon="DOWNLOAD" />
            </button>
          </div>
        </div>
        <div className={MemoWrapperStyle(isExpanded)}>
          <TextAreaInput
            value={value.memo || ''}
            name={`${name}.memo`}
            onChange={e => {
              if (onChange) {
                onChange(`${name}.memo`, e.target.value);
              }
            }}
            onBlur={() => {
              if (onBlur) {
                onBlur(`${name}.memo`, true);
              }
            }}
          />
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
