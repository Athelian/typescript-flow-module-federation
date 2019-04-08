// @flow
import * as React from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import { upload } from 'utils/fs';
import { isEquals } from 'utils/fp';
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
    id: string,
    name: string,
    path: string,
    type: string,
    status: string,
    memo: ?string,
  }>,
  prevFiles: Array<{
    id: string,
    name: string,
    path: string,
    type: string,
    status: string,
    memo: ?string,
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

  state = {
    filesState: [],
    prevFiles: [],
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (
      !isEquals(
        props.values.map(({ id, type, name, path, status, memo }) => ({
          id,
          type,
          name,
          path,
          status,
          memo,
        })),
        state.prevFiles
      )
    ) {
      return {
        prevFiles: (props.values.map(({ id, type, name, path, status, memo }) => ({
          id,
          type,
          name,
          path,
          status,
          memo,
        })): Array<any>),
        filesState: (props.values.map(item => ({
          ...item,
          progress: 100,
          uploading: false,
        })): Array<any>),
      };
    }
    return null;
  }

  handleChange = (
    event: SyntheticInputEvent<HTMLInputElement> | Array<File>,
    onUpload: (Array<Object>) => any
  ) => {
    let newFiles = [];
    if (Array.isArray(event)) {
      newFiles = event;
    } else {
      event.preventDefault();
      newFiles = Array.from(event.target.files);
    }
    const { types } = this.props;
    const { filesState } = this.state;

    const basePosition = filesState.length;
    this.setState(
      prevState => ({
        filesState: [
          ...prevState.filesState,
          ...newFiles.map(({ name, type }) => ({
            name,
            type,
            id: uuid(),
            path: '',
            status: 'Draft',
            memo: '',
            uploading: true,
            progress: 0,
          })),
        ],
      }),
      () => {
        Promise.all(
          newFiles.map((file, index) =>
            upload(file, (progressStatus: ProgressEvent) => {
              const { lengthComputable, loaded, total } = progressStatus;
              if (lengthComputable) {
                const { filesState: newFilesState } = this.state;
                newFilesState[index + basePosition].progress = Math.round((loaded / total) * 100);
                this.setState({ filesState: newFilesState });
              }
            })
          )
        )
          .then(uploadResult => {
            onUpload(
              uploadResult.map(({ id, name, path }) => ({
                id,
                name,
                path,
                type: types[0].type,
                status: 'Draft',
                memo: null,
                uploading: false,
                progress: 100,
              }))
            );
          })
          .catch(error => {
            logger.error(error);
            const { values } = this.props;
            this.setState({
              prevFiles: (values.map(({ id, type, name, path, status, memo }) => ({
                id,
                type,
                name,
                path,
                status,
                memo,
              })): Array<any>),
              filesState: (values.map(item => ({
                ...item,
                progress: 100,
                uploading: false,
              })): Array<any>),
            });
          });
      }
    );
  };

  render() {
    const { name, values, onChange, onBlur, types, editable, downloadable } = this.props;
    const { filesState } = this.state;
    if (editable) {
      return (
        <Dropzone
          onDrop={acceptedFiles => {
            this.handleChange(acceptedFiles, newFiles => {
              onChange(name, [...values, ...newFiles]);
            });
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <p>Drag & drop some files here, or click to select files</p>
              <div className={DocumentListStyle}>
                {filesState &&
                  filesState.map((document, index) => {
                    const documentName = `${name}[${index}]`;

                    return (
                      <DocumentItem
                        name={documentName}
                        key={document.id}
                        value={document}
                        types={types}
                        onChange={onChange}
                        onBlur={onBlur}
                        onRemove={() => {
                          onChange(name, values.filter(d => d.id !== document.id));
                        }}
                        editable
                        downloadable={downloadable}
                        uploading={filesState.length > 0 ? filesState[index].uploading : false}
                        progress={filesState.length > 0 ? filesState[index].progress : 0}
                      />
                    );
                  })}

                <label className={AddDocumentStyle}>
                  <Icon icon="ADD" />
                  <input
                    {...getInputProps()}
                    type="file"
                    accept="*"
                    hidden
                    multiple
                    onChange={e => {
                      this.handleChange(e, newFiles => {
                        onChange(name, [...values, ...newFiles]);
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </Dropzone>
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
