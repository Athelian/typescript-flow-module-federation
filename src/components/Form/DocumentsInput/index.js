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

type Props = {
  name: string,
  values: Array<Document>,
  readOnly: boolean,
  onChange: (string, any) => void,
  onBlur: (string, boolean) => void,
  onUpload?: ({ uploading: boolean, progress: number }) => void,
  types: Array<FileType>,
};

type State = {
  uploading: boolean,
  progress: number,
};

class DocumentsInput extends React.Component<Props, State> {
  static defaultProps = {
    values: [],
    readOnly: false,
    onChange: () => {},
    onBlur: () => {},
    onUpload: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      uploading: false,
      progress: 0,
    };
  }

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

    const file = input.files[0];
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

        onUpload({
          id,
          name,
          path,
          type: types.length > 0 ? types[0].type : 'File',
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
    const { name, values, readOnly, onChange, onBlur, types } = this.props;
    const { uploading, progress } = this.state;

    if (readOnly) {
      return values && values.length > 0 ? (
        <div className={DocumentListStyle}>
          {values.map(document => (
            <DocumentItem name="" key={document.id} value={document} types={types} readOnly />
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
