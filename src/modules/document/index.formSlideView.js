// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import type { FilePayload } from 'generated/graphql';
import { FormContainer } from 'modules/form';
import { SlideViewLayout } from 'components/Layout';
import validator from 'modules/document/form/validator';
import DocumentFormContainer from 'modules/document/form/container';
import DocumentForm from 'modules/document/form';

type Props = {
  onSave: Object => void,
  file: FilePayload,
};

const formContainer = new FormContainer();

const DocumentFormSlideView = ({ onSave, file }: Props) => {
  const { state, isDirty, resetState } = DocumentFormContainer.useContainer();

  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  return (
    <Provider inject={[formContainer]}>
      <DocumentFormContainer.Provider initialState={file}>
        <SlideViewLayout>
          <DocumentForm
            isDirty={isDirty}
            isValidated={formContainer.isReady(state, validator)}
            resetState={resetState}
            isSlideView
            handleSave={() => onSave(state)}
          />
        </SlideViewLayout>
      </DocumentFormContainer.Provider>
    </Provider>
  );
};

export default DocumentFormSlideView;
