// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormField } from 'modules/form';
import { TextAreaInputFactory, EnumSelectInputFactory, SelectInputFactory } from 'components/Form';
import BaseCard, { CardAction } from 'components/Cards';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import type { Document, FileType } from 'components/Form/DocumentsInput/type.js.flow';
import { computeIcon, getFileExtension, getFileName } from './helpers';
import {
  DocumentWrapperStyle,
  DocumentCardStyle,
  FileExtensionIconStyle,
  BottomWrapperStyle,
  FileNameWrapperStyle,
  FileNameStyle,
  FileStatusColoringWrapper,
  DownloadButtonStyle,
  MemoWrapperStyle,
  OpenMemoButtonStyle,
  ProgressStyle,
} from './style';

type OptionalProps = {
  onChange: (string, any) => void,
  onRemove: Function,
  editable: boolean,
  downloadable: boolean,
  uploading: boolean,
  progress: number,
};

type Props = OptionalProps & {
  name: string,
  value: Document,
  types: Array<FileType>,
};

const defaultProps = {
  onChange: () => {},
  onRemove: () => {},
  editable: true,
  downloadable: true,
  uploading: true,
  progress: 0,
};

const DocumentItem = ({
  name,
  value,
  onChange,
  onRemove,
  types,
  editable,
  downloadable,
  uploading,
  progress,
}: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleMemo = React.useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  if (!value.id) return null;

  const fileExtension = getFileExtension(value.name);
  const fileName = getFileName(value.name);
  const fileIcon = computeIcon(fileExtension);

  return uploading ? (
    <div className={ProgressStyle}>{`${progress}%`}</div>
  ) : (
    <div className={DocumentWrapperStyle(isExpanded)}>
      <BaseCard
        actions={[
          editable && <CardAction icon="REMOVE" hoverColor="RED" onClick={onRemove} />,
        ].filter(Boolean)}
        showActionsOnHover
        readOnly={!editable}
      >
        <div className={DocumentCardStyle}>
          <FormField
            name={`${name}.type`}
            initValue={value.type}
            setFieldValue={onChange}
            saveOnChange
          >
            {({ ...inputHandlers }) => (
              <SelectInputFactory
                {...inputHandlers}
                items={types}
                editable={editable}
                inputWidth="130px"
                inputHeight="30px"
                hideTooltip
                inputAlign="left"
                required
                hideDropdownArrow
              />
            )}
          </FormField>

          <div className={FileExtensionIconStyle(fileIcon.color)}>
            <Icon icon={fileIcon.icon} />
          </div>

          <div className={BottomWrapperStyle}>
            <Tooltip message={`${fileName}.${fileExtension}`}>
              <div className={FileNameWrapperStyle}>
                <div className={FileNameStyle}>{fileName}</div>
                {`.${fileExtension}`}
              </div>
            </Tooltip>

            {downloadable ? (
              <button
                type="button"
                className={DownloadButtonStyle(false)}
                onClick={() => {
                  window.open(value.path, '_blank');
                }}
              >
                <Icon icon="DOWNLOAD" />
              </button>
            ) : (
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
            )}
          </div>

          <FormField
            name={`${name}.status`}
            initValue={value.status}
            setFieldValue={onChange}
            saveOnChange
          >
            {({ ...inputHandlers }) => (
              <span className={FileStatusColoringWrapper(value.status, editable)}>
                <EnumSelectInputFactory
                  {...inputHandlers}
                  enumType="FileStatus"
                  editable={editable}
                  inputWidth="130px"
                  inputHeight="30px"
                  hideTooltip
                  inputAlign="center"
                  required
                  hideDropdownArrow
                  dropDirection="up"
                />
              </span>
            )}
          </FormField>
        </div>
      </BaseCard>

      <div className={MemoWrapperStyle(isExpanded)}>
        <FormField name={`${name}.memo`} initValue={value.memo} setFieldValue={onChange}>
          {({ ...inputHandlers }) => (
            <TextAreaInputFactory
              {...inputHandlers}
              isNew
              editable={editable}
              inputWidth="630px"
              inputHeight="125px"
            />
          )}
        </FormField>
      </div>

      <button
        type="button"
        onClick={toggleMemo}
        className={OpenMemoButtonStyle(isExpanded, !!value.memo)}
      >
        <Icon icon={isExpanded ? 'CHEVRON_LEFT' : 'MEMO'} />
      </button>
    </div>
  );
};

DocumentItem.defaultProps = defaultProps;

export default DocumentItem;
