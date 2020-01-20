// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { Provider } from 'unstated';
import { SectionWrapper } from 'components/Form';
import { CancelButton } from 'components/Buttons';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import type { MaskEdit, MaskEditType } from 'generated/graphql';
import { FormContainer } from 'modules/form';
import TemplateSection from './components/TemplateSection';
import ColumnsConfigSection from './components/ColumnsConfigSection';
import {
  maskEditCreateMutation,
  maskEditUpdateMutation,
  prepareParsedMaskEditInput,
} from './mutation';
import TableTemplateFormContainer from './container';
import validator from './validator';
import { getComputeColumns, getDefaultColumns } from './helpers';
import { TemplateFormWrapperStyle } from './style';

type FormProps = {
  onSave: Object => void,
  onCancel: () => void,
  onRefetch?: () => void,
};

type WrapperProps = {
  type: MaskEditType,
  tableTemplate: ?MaskEdit,
  customFields: Object,
};

const formContainer = new FormContainer();

export const TableTemplateForm = ({ onSave, onCancel, onRefetch }: FormProps) => {
  const {
    state,
    originalValues,
    isDirty,
    initializeState,
    resetState,
  } = TableTemplateFormContainer.useContainer();

  const [mutate, { loading: isProcessing }] = useMutation(
    state.isNew ? maskEditCreateMutation : maskEditUpdateMutation
  );

  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  const handleSave = async () => {
    const input = prepareParsedMaskEditInput(state.isNew ? null : originalValues, state.values);

    const { data } = await mutate({
      variables: { ...(state.isNew ? {} : { id: state.tableTemplate?.id }), input },
    });

    const violations = state.isNew
      ? data?.maskEditCreate?.violations
      : data?.maskEditUpdate?.violations;

    if (violations && violations.length) {
      formContainer.onErrors(violations);
    } else {
      initializeState(state.isNew ? data?.maskEditCreate : data?.maskEditUpdate);
      formContainer.onReset();
      if (onRefetch) {
        onRefetch();
      }
      onSave(state.isNew ? data?.maskEditCreate : data?.maskEditUpdate);
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
              label={
                <FormattedMessage id="modules.TableTemplates.template" defaultMessage="TEMPLATE" />
              }
              icon="TEMPLATE"
            />
            <SectionTabs
              link="tableTemplate_editFieldsSection"
              label={
                <FormattedMessage
                  id="modules.TableTemplates.columnsConfigSection"
                  defaultMessage="Columns Configuration"
                />
              }
              icon="EDIT_TABLE"
            />
          </JumpToSection>
          {state.isNew && <CancelButton onClick={() => onCancel()} />}

          {!state.isNew && isDirty && <ResetFormButton onClick={resetState} />}

          {(state.isNew || isDirty) && (
            <SaveFormButton
              id="table_template_form_save_button"
              disabled={!formContainer.isReady(state.values, validator)}
              isLoading={isProcessing}
              onClick={handleSave}
            />
          )}
        </SlideViewNavBar>

        <Content>
          <div className={TemplateFormWrapperStyle}>
            <SectionWrapper id="tableTemplate_templateSection">
              <TemplateSection />
            </SectionWrapper>

            <SectionWrapper id="tableTemplate_editFieldsSection">
              <ColumnsConfigSection />
            </SectionWrapper>
          </div>
        </Content>
      </SlideViewLayout>
    </Provider>
  );
};

export const TableTemplateFormWrapper = ({
  type,
  tableTemplate,
  customFields,
  onSave,
  onCancel,
  onRefetch,
}: WrapperProps & FormProps) => {
  const defaultColumns = React.useMemo(() => getDefaultColumns(type, customFields), [
    type,
    customFields,
  ]);

  return (
    <TableTemplateFormContainer.Provider
      initialState={{
        type,
        defaultColumns,
        tableTemplate,
        computeColumns: getComputeColumns(type),
      }}
    >
      <TableTemplateForm onSave={onSave} onCancel={onCancel} onRefetch={onRefetch} />
    </TableTemplateFormContainer.Provider>
  );
};

export default TableTemplateForm;
