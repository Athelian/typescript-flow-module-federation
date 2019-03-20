// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { upload } from 'utils/fs';
import logger from 'utils/logger';
import DocumentItem from './components/DocumentItem';
import type { Document, FileType } from './type.js.flow';
import { DocumentListStyle, AddDocumentStyle, NoDocumentsStyle } from './style';
import messages from './messages';

type OptionalProps = {
  values: Array<Document>,
  name: string,
  onChange: (string, any) => void,
  onBlur: (string, boolean) => void,
  types: Array<FileType>,
  editable: boolean,
  downloadable: boolean,
};

type Props = OptionalProps;

type State = {
  filesState: Array<{
    uploading: boolean,
    progress: number,
  }>,
};

const defaultProps = {
  values: [],
  name: '',
  onChange: () => {},
  onBlur: () => {},
  types: [],
  editable: true,
  downloadable: true,
};

class DocumentsInput extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      filesState: [...props.values.map(() => ({ uploading: false, progress: 100 }))],
    };
  }

  handleChange = (event: Event, onUpload: Function) => {
    event.preventDefault();

    const { types } = this.props;
    const { filesState } = this.state;

    const newFiles = Array.from(event.target.files);

    this.setState({
      filesState: [...filesState, ...newFiles.map(() => ({ uploading: true, progress: 0 }))]
    }, () => {
      const { filesState: newFilesState } = this.state;

      newFiles.forEach((newFile, index) => {
        upload(
          newFile,
          ({ id, name, path }) => {
            const clonedFilesState = [...newFilesState];
            clonedFilesState[index].uploading = false;
            clonedFilesState[index].done = true;
  
            this.setState({ filesState: [...clonedFilesState] });
  
            onUpload({
              id,
              name,
              path,
              type: types[0].type,
              memo: null,
            });
          },
          logger.error,
          ({ lengthComputable, loaded, total }: ProgressEvent) => {
            if (lengthComputable) {
              const clonedFilesState = [...newFilesState];
              clonedFilesState[index].progress = Math.round((loaded / total) * 100);
              
              this.setState({ filesState: [...clonedFilesState] });
            }
          }
        );
      });
    });
  };

  render() {
    const { name, values, onChange, onBlur, types, editable, downloadable } = this.props;
    const { filesState } = this.state;

    if (editable) {
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
                  editable
                  downloadable={downloadable}
                  uploading={filesState[index].uploading}
                  progress={filesState[index].progress}
                />
              );
            })}

          <label className={AddDocumentStyle}>
            <Icon icon="ADD" />
            <input
              type="file"
              accept="*"
              // disabled={uploading}
              hidden
              multiple
              onChange={e => {
                this.handleChange(e, newFile => {
                  onChange(name, [...values, newFile]);
                });
              }}
            />
          </label>
        </div>
      );
    }

    return values && values.length > 0 ? (
      <div className={DocumentListStyle}>
        {values.map(document => (
          <DocumentItem
            name={document.id}
            key={document.id}
            value={document}
            types={types}
            editable={false}
            downloadable={downloadable}
          />
        ))}
      </div>
    ) : (
      <div className={NoDocumentsStyle}>
        <FormattedMessage {...messages.noDocuments} />
      </div>
    );
  }
}

export default DocumentsInput;
