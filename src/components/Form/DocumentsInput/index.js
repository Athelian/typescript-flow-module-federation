// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { upload } from 'utils/fs';
import logger from 'utils/logger';
import DocumentItem from './components/DocumentItem';
import type { Document, FileType } from './type.js.flow';
import { DocumentListStyle, AddDocumentStyle, ProgressStyle, NoDocumentsStyle } from './style';
import messages from './messages';

type OptionalProps = {
  values: Array<Document>,
  name: string,
  onChange: (string, any) => void,
  onBlur: (string, boolean) => void,
  onUpload?: ({ uploading: boolean, progress: number }) => void,
  types: Array<FileType>,
  readOnly: boolean,
  downloadDisabled: boolean,
};

type Props = OptionalProps;

type State = {
  uploading: boolean,
  progress: number,
};

const defaultProps = {
  values: [],
  name: '',
  onChange: () => {},
  onBlur: () => {},
  onUpload: () => {},
  types: [],
  readOnly: false,
  downloadDisabled: false,
};

class DocumentsInput extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  state = {
    uploading: false,
    progress: 0,
  };

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { onUpload } = this.props;
    if (!onUpload) {
      return;
    }

    const { uploading: prevUploading, progress: prevProgress } = prevState;
    const { uploading, progress } = this.state;

    if (prevProgress === progress && prevUploading === uploading) {
      return;
    }

    onUpload({
      uploading,
      progress,
    });
  }

  handleChange = (event: Event, onUpload: Function) => {
    event.preventDefault();

    const { types } = this.props;

    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const {
      files: [file],
    } = input;
    if (!file) {
      return;
    }

    this.setState({
      uploading: true,
    });

    upload(
      file,
      ({ id, name, path }) => {
        this.setState({
          progress: 0,
          uploading: false,
        });

        const [{ type = 'File' }] = types;
        onUpload({
          id,
          name,
          path,
          type,
          memo: null,
        });
      },
      logger.error,
      ({ lengthComputable, loaded, total }: ProgressEvent) => {
        if (lengthComputable) {
          this.setState({
            progress: Math.round((loaded / total) * 100),
          });
        }
      }
    );
  };

  render() {
    const { name, values, onChange, onBlur, types, readOnly, downloadDisabled } = this.props;
    const { uploading, progress } = this.state;

    if (readOnly) {
      return values && values.length > 0 ? (
        <div className={DocumentListStyle}>
          {values.map(document => (
            <DocumentItem
              name={document.id}
              key={document.id}
              value={document}
              types={types}
              readOnly
              downloadDisabled={downloadDisabled}
            />
          ))}
        </div>
      ) : (
        <div className={NoDocumentsStyle}>
          <FormattedMessage {...messages.noDocuments} />
        </div>
      );
    }

    return (
      <div className={DocumentListStyle}>
        {values &&
          values.map((document, index) => {
            const documentName = `${name}[${index}]`;

            return (
              <DocumentItem
                name={documentName}
                key={documentName}
                value={document}
                types={types}
                onChange={onChange}
                onBlur={onBlur}
                onRemove={() => {
                  onChange(name, values.filter(d => d.id !== document.id));
                }}
                downloadDisabled={downloadDisabled}
              />
            );
          })}
        {uploading ? (
          <div className={ProgressStyle}>{`${progress}%`}</div>
        ) : (
          <label className={AddDocumentStyle}>
            <Icon icon="ADD" />
            <input
              type="file"
              accept="*"
              disabled={uploading}
              hidden
              onChange={e => {
                this.handleChange(e, newFile => {
                  onChange(name, [...values, newFile]);
                });
              }}
            />
          </label>
        )}
      </div>
    );
  }
}

export default DocumentsInput;
