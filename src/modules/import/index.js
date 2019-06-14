// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import { FormattedMessage, injectIntl, type InjectIntlProvidedProps } from 'react-intl';
import { Mutation, Subscription } from 'react-apollo';
import { ButtonStyle } from 'components/Buttons/ExportButton/style';
import { BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import Progress from './Progress';
import Errors from './Errors';
import FileInput from './FileInput';
import messages from './messages';
import { importMutation } from './mutation';
import { importEventSubscription } from './subscription';
import { ImportLifecycle, Status } from './constants';
import {
  ContainerStyle,
  HeaderStyle,
  HeaderIconStyle,
  MainStyle,
  CancelButtonStyle,
} from './style';

// 9 sheets * 6 events
const EventSheetProgress = 100 / (9 * 6);

const Import = ({ intl }: InjectIntlProvidedProps) => {
  const [open, setOpen] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [importId, setImportId] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [message, setMessage] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [errors, setErrors] = React.useState([]);
  const [status, setStatus] = React.useState(Status.PENDING);

  return (
    <>
      <BaseButton
        icon="IMPORT"
        label={<FormattedMessage {...messages.import} />}
        textColor="GRAY_LIGHT"
        backgroundColor="WHITE"
        hoverBackgroundColor="GRAY_SUPER_LIGHT"
        className={ButtonStyle}
        onClick={() => setOpen(true)}
      />

      {importId !== null && (
        <Subscription
          subscription={importEventSubscription}
          variables={{ importId }}
          fetchPolicy="no-cache"
          onSubscriptionData={({
            subscriptionData: {
              data: {
                data: { importEvent },
              },
            },
          }) => {
            switch (importEvent.lifecycle) {
              case ImportLifecycle.END:
                if (errors.length === 0) {
                  setProgress(100);
                  setStatus(Status.SUCCEED);
                } else {
                  setStatus(Status.FAILED);
                }
                setFile(null);
                setImporting(false);
                break;
              case ImportLifecycle.ERROR:
                setMessage(null);
                setStatus(Status.FAILED);
                setErrors([importEvent.error]);
                setFile(null);
                setImporting(false);
                break;
              case ImportLifecycle.START_READ:
              case ImportLifecycle.END_READ:
              case ImportLifecycle.START_PREPARE:
              case ImportLifecycle.END_PREPARE:
              case ImportLifecycle.START_IMPORT:
              case ImportLifecycle.END_IMPORT:
                setProgress(progress + EventSheetProgress);
                setMessage(`${importEvent.lifecycle} "${importEvent.sheet}"`);
                setErrors(
                  importEvent.violations.map(violation =>
                    intl.formatMessage(messages.error, {
                      error: violation.message,
                      location: violation.path,
                    })
                  )
                );
                break;
              default:
                break;
            }
          }}
        />
      )}

      <Dialog isOpen={open} width="800px" onRequestClose={() => setOpen(false)}>
        <div className={ContainerStyle}>
          <header className={HeaderStyle}>
            <i className={HeaderIconStyle}>
              <Icon icon="IMPORT" />
            </i>
            <FormattedMessage {...messages.header} />
            <BaseButton
              icon="DOWNLOAD"
              label={<FormattedMessage {...messages.downloadTemplate} />}
              backgroundColor="TEAL"
              hoverBackgroundColor="TEAL_DARK"
              onClick={() => {
                /* download */
              }}
            />
            <button type="button" onClick={() => setOpen(false)} className={CancelButtonStyle}>
              <Icon icon="CLEAR" />
            </button>
          </header>
          <main className={MainStyle}>
            <Progress message={message} progress={progress} status={status} />
            <FileInput value={file} onChange={setFile} />
            <Mutation
              mutation={importMutation}
              onCompleted={({ import: importResult }) => {
                setStatus(Status.IN_PROGRESS);
                setImportId(importResult.id);
                setImporting(true);
              }}
            >
              {doImport => (
                <BaseButton
                  icon="IMPORT"
                  label={<FormattedMessage {...messages.startImport} />}
                  backgroundColor="TEAL"
                  hoverBackgroundColor="TEAL_DARK"
                  disabled={importing || !file}
                  onClick={() => {
                    setImportId(null);
                    setStatus(Status.PENDING);
                    setMessage(null);
                    setProgress(0);
                    setErrors([]);

                    doImport({
                      variables: {
                        file,
                      },
                    });
                  }}
                />
              )}
            </Mutation>
            <Errors errors={errors} />
          </main>
        </div>
      </Dialog>
    </>
  );
};

export default injectIntl(Import);
