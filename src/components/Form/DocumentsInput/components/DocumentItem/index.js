// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import { TextAreaInput, SearchSelectInput } from 'components/Form';
import Icon from 'components/Icon';
import Display from 'components/Display';
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

    const fileExtension = getFileExtension(value.path);
    const fileName = getFileName(value.path);
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
            <Display hideLabel>{type ? type.label : ''}</Display>
          ) : (
            <StringValue>
              {({ value: q, set, clear }) => (
                <SearchSelectInput
                  name={`${name}.type`}
                  value={value.type}
                  items={matchSorter(types, q, { keys: ['type', 'label'] })}
                  itemToValue={v => (v ? v.type : null)}
                  itemToString={v => (v ? v.label : '')}
                  hideLabel
                  required
                  readOnly={readOnly}
                  onChange={item => {
                    if (!item) clear();
                  }}
                  onBlur={onBlur}
                  onSearch={set}
                />
              )}
            </StringValue>
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
                window.open(`${process.env.ZENPORT_FS_URL || ''}/${value.path}`, '_blank');
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
