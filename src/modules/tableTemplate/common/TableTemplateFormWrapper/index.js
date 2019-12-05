// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { useMutation } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer } from 'modules/form';
import {
  maskEditUpdateMutation,
  maskEditCreateMutation,
  prepareParsedMaskEditInput,
} from 'modules/tableTemplate/form/mutation';
import validator from 'modules/tableTemplate/form/validator';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import TableTemplateForm from 'modules/tableTemplate/form';

type Props = {
  isNew: boolean,
  onCancel: () => void,
};

const formContainer = new FormContainer();

const TableTemplateFormWrapper = ({ isNew, onCancel }: Props) => {
  const {
    state,
    originalState,
    initializeState,
    isDirty,
    resetState,
  } = TableTemplateFormContainer.useContainer();

  const [maskEditMutate, { loading: isProcessing }] = useMutation(
    isNew ? maskEditCreateMutation : maskEditUpdateMutation
  );

  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  const onSave = async () => {
    const input = prepareParsedMaskEditInput(isNew ? null : originalState, state);

    const { data } = await maskEditMutate({
      variables: { input },
    });

    const violations = isNew ? data?.maskEditCreate?.violations : data?.maskEditUpdate?.violations;

    if (violations && violations.length) {
      formContainer.onErrors(violations);
    } else {
      initializeState(isNew ? data?.maskEditCreate : data?.maskEditUpdate);
      formContainer.onReset();
    }
  };

  return (
    <Provider inject={[formContainer]}>
      <SlideViewLayout>
        <SlideViewNavBar>
          <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
          <JumpToSection>
            <SectionTabs
              link="tableTemplate_templateSection"
              label={<FormattedMessage id="modules.Templates.template" defaultMessage="TEMPLATE" />}
              icon="TEMPLATE"
            />
            <SectionTabs
              link="tableTemplate_editFieldsSection"
              label={
                <FormattedMessage
                  id="modules.Templates.relationTable"
                  defaultMessage="RELATION TABLE"
                />
              }
              icon="EDIT_TABLE"
            />
          </JumpToSection>
          {isNew && <CancelButton onClick={() => onCancel()} />}

          {!isNew && isDirty && <ResetButton onClick={resetState} />}

          {(isNew || isDirty) && (
            <SaveButton
              id="table_template_form_save_button"
              disabled={!formContainer.isReady(state, validator)}
              isLoading={isProcessing}
              onClick={onSave}
            />
          )}
        </SlideViewNavBar>

        <Content>
          <TableTemplateForm isNew={isNew} />
        </Content>
      </SlideViewLayout>
    </Provider>
  );
};

export default TableTemplateFormWrapper;
