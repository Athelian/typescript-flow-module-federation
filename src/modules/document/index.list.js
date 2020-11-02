// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import type { FileInput } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { Content } from 'components/Layout';
import Icon from 'components/Icon';
import usePrevious from 'hooks/usePrevious';
import {
  FileFilterConfig,
  FileSortConfig,
  EntityIcon,
  Filter,
  NavBar,
  Search,
  Sort,
} from 'components/NavBar';
import useFilterSort from 'hooks/useFilterSort';
import { DOCUMENT_CREATE } from 'modules/permission/constants/file';
import { uuid } from 'utils/id';
import { isEquals } from 'utils/fp';
import DocumentList from './list';
import { fileUploadMutation } from './list/mutation';
import messages from './messages';
import {
  AddDocumentButtonWrapperStyle,
  AddDocumentButtonLabelStyle,
  AddDocumentButtonIconStyle,
} from './style';

const DocumentModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' },
    'file_cards'
  );
  const [upload] = useMutation(fileUploadMutation);
  const [filesState, setFileState] = React.useState<
    Array<{|
      uploading: boolean,
      progress: number,
      ...FileInput,
    |}>
  >([]);
  const filesStateRef = React.useRef(filesState);

  React.useEffect(() => {
    filesStateRef.current = filesState;
  }, [filesState]);

  const lastFilter = usePrevious({ query, filterBy, sortBy });

  React.useEffect(() => {
    if (!isEquals(lastFilter, { query, filterBy, sortBy })) {
      setFileState([]);
    }
  }, [filterBy, lastFilter, query, sortBy]);

  const hasPermissions = useViewerHasPermissions();
  const uploadable = hasPermissions(DOCUMENT_CREATE);

  const handleChange = (event: SyntheticInputEvent<HTMLInputElement> | Array<File>) => {
    let newFiles = [];
    if (Array.isArray(event)) {
      newFiles = event;
    } else {
      event.preventDefault();
      newFiles = Array.from(event.target.files);
    }

    const newUploadFiles = newFiles.map(({ name }) => ({
      name,
      type: 'Document',
      id: uuid(),
      path: '',
      status: 'Draft',
      memo: '',
      uploading: true,
      progress: 0,
    }));

    setFileState([...newUploadFiles, ...filesState]);

    Promise.all<any>(
      newFiles.map((file, index) =>
        upload({
          variables: {
            file,
            input: {
              status: 'Approved',
              type: 'Document',
              orphan: false,
            },
          },
          context: ({
            fetchOptions: {
              onProgress: (progressEvent: ProgressEvent) => {
                const { lengthComputable, loaded, total } = progressEvent;
                if (lengthComputable) {
                  setFileState(
                    filesStateRef.current.map(fileState => ({
                      ...fileState,
                      progress:
                        fileState.id === newUploadFiles[index].id
                          ? Math.round((loaded / total) * 100)
                          : fileState.progress,
                    }))
                  );
                }
              },
            },
          }: any),
        })
      )
    )
      .then(uploadResults => {
        setFileState([
          ...uploadResults.map(uploadFile => uploadFile?.data?.fileUpload),
          ...filesState,
        ]);
      })
      .catch(() => {
        setFileState(filesState);
      });
  };

  return (
    <Provider>
      <Content>
        <NavBar>
          <EntityIcon icon="DOCUMENT" color="DOCUMENT" />

          <Filter config={FileFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
          <Search query={query} onChange={setQuery} />
          <Sort config={FileSortConfig} sortBy={sortBy} onChange={setSortBy} />

          {uploadable && (
            <>
              <label className={AddDocumentButtonWrapperStyle}>
                <div className={AddDocumentButtonLabelStyle}>
                  <FormattedMessage {...messages.newDocument} />
                </div>
                <div className={AddDocumentButtonIconStyle}>
                  <Icon icon="ADD" />
                </div>
                <input type="file" accept="*" hidden multiple value="" onChange={handleChange} />
              </label>
            </>
          )}
        </NavBar>
        <DocumentList
          uploadFiles={filesState}
          filterBy={{ query, ...filterBy }}
          sortBy={sortBy}
          page={1}
          perPage={10}
        />
      </Content>
    </Provider>
  );
};

export default DocumentModule;
