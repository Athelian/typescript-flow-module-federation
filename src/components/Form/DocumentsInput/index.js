// @flow
import * as React from 'react';
import { FieldArray } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import DocumentItem from './components/DocumentItem';
import type { Document, FileType } from './type.js.flow';
import { uploadDocument } from './actions';
import { DocumentListStyle, AddDocumentStyle, ProgressStyle, NoDocumentsStyle } from './style';
import messages from './messages';

type Props = {
  name: string,
  folder: string,
  value?: Array<Document>,
  readOnly?: boolean,
  onChange?: (string, any) => void,
  onBlur?: (string, boolean) => void,
  onUpload?: ({ uploading: boolean, progress: number }) => void,
  types: Array<FileType>,
};

type State = {
  uploading: boolean,
  progress: number,
};

class DocumentsInput extends React.Component<Props, State> {
  static defaultProps = {
    value: [],
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

  handleChange = (event: Event, onPush: Function) => {
    event.preventDefault();

    const { folder, types } = this.props;

    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const file = input.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      uploadDocument(
        folder,
        file,
        v => {
          this.setState({
            progress: Math.round((v.loaded / v.total) * 100),
          });
        },
        () => {},
        (path: string) => {
          this.setState({
            progress: 0,
            uploading: false,
          });

          onPush({ path, type: types[0].type });
        }
      );
    };

    this.setState({
      uploading: true,
    });

    reader.readAsDataURL(file);
  };

  render() {
    const { name, value, readOnly, onChange, onBlur, types } = this.props;
    const { uploading, progress } = this.state;

    return (
      <FieldArray
        name={name}
        render={({ fields: arrayHelpers }) => (
          <div>
            {readOnly &&
              (value && value.length > 0 ? (
                <div className={DocumentListStyle}>
                  {value.map(document => (
                    <DocumentItem
                      name=""
                      key={document.id}
                      value={document}
                      types={types}
                      readOnly
                    />
                  ))}
                </div>
              ) : (
                <div className={NoDocumentsStyle}>
                  <FormattedMessage {...messages.noDocuments} />
                </div>
              ))}

            {!readOnly && (
              <div className={DocumentListStyle}>
                {value &&
                  value.map((document, index) => {
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
                          arrayHelpers.remove(index);
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
                        this.handleChange(e, arrayHelpers.push);
                      }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        )}
      />
    );
  }
}

export default DocumentsInput;
