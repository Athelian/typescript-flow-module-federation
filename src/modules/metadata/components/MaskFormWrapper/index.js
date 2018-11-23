// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mutation, Query } from 'react-apollo';

import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import Layout from 'components/Layout';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import { FormContainer } from 'modules/form';
import MaskForm from 'modules/metadata/components/MaskForm';
import MaskContainer from 'modules/metadata/components/MaskForm/container';
import validator from './validator';
import { maskQuery } from './query';
import { createMaskMutation, updateMaskMutation } from './mutation';

type OptionalProps = {
  isNew: boolean,
  id: string,
};

type Props = OptionalProps & {
  entityType: string,
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  isNew: false,
  id: '',
};

class MaskFormWrapper extends React.Component<Props> {
  static defaultProps = defaultProps;

  onSave = async (
    formData: Object,
    saveMask: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { isNew, entityType, id } = this.props;

    const input = isNew
      ? {
          entityType,
          name: formData.name,
          memo: formData.memo,
          fieldDefinitionIDs: formData.fieldDefinitionIDs,
        }
      : {
          entityType,
          name: formData.name,
          memo: formData.memo,
          fieldDefinitionIDs: formData.fieldDefinitionIDs,
        };

    if (isNew) {
      const { data } = await saveMask({ variables: { input } });
      const {
        maskCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else {
      const { data } = await saveMask({ variables: { input, id } });
      const {
        maskUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  render() {
    const { isNew, id, onCancel, onSave } = this.props;

    return (
      <Mutation mutation={isNew ? createMaskMutation : updateMaskMutation}>
        {(saveMask, { loading: isLoading, error: apiError }) => (
          <>
            {isLoading && <LoadingIcon />}
            {apiError && <p>Error: Please try again.</p>}
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="METADATA" color="METADATA" />
                  <JumpToSection>
                    <SectionTabs
                      link="templateSection"
                      label={
                        <FormattedMessage
                          id="modules.metadata.template"
                          defaultMessage="TEMPLATE"
                        />
                      }
                      icon="TEMPLATE"
                    />
                    <SectionTabs
                      link="customFieldsSection"
                      label={
                        <FormattedMessage
                          id="modules.metadata.customFieldsSection"
                          defaultMessage="CUSTOM FIELDS"
                        />
                      }
                      icon="METADATA"
                    />
                  </JumpToSection>
                  <CancelButton onClick={onCancel} />
                  <Subscribe to={[MaskContainer, FormContainer]}>
                    {({ state, isDirty, onSuccess }, form) => (
                      <SaveButton
                        disabled={!isDirty() || !form.isReady(state, validator)}
                        onClick={() => {
                          this.onSave(
                            state,
                            saveMask,
                            () => {
                              onSuccess();
                              form.onReset();
                            },
                            form.onErrors
                          );
                          onSave();
                        }}
                      />
                    )}
                  </Subscribe>
                </SlideViewNavBar>
              }
            >
              {isNew ? (
                <Subscribe to={[MaskContainer]}>
                  {({ initDetailValues }) => (
                    <MaskForm
                      isNew
                      onFormReady={() =>
                        initDetailValues({
                          name: '',
                          memo: '',
                          fieldDefinitionIDs: [],
                        })
                      }
                    />
                  )}
                </Subscribe>
              ) : (
                <Query query={maskQuery} variables={{ id }} fetchPolicy="network-only">
                  {({ loading, data, error }) => {
                    if (error) {
                      if (error.message && error.message.includes('403')) {
                        navigate('/403');
                      }
                      return error.message;
                    }

                    if (loading) return <LoadingIcon />;

                    const name = getByPathWithDefault({}, 'mask.name', data);
                    const memo = getByPathWithDefault({}, 'mask.memo', data);

                    const fieldDefinitions = getByPathWithDefault(
                      {},
                      'mask.fieldDefinitions',
                      data
                    );

                    const mask = {
                      name,
                      memo,
                      fieldDefinitionIDs: fieldDefinitions.map(item => item.id),
                    };

                    return (
                      <Subscribe to={[MaskContainer]}>
                        {({ initDetailValues }) => (
                          <MaskForm onFormReady={() => initDetailValues(mask)} />
                        )}
                      </Subscribe>
                    );
                  }}
                </Query>
              )}
            </Layout>
            )} }}
          </>
        )}
      </Mutation>
    );
  }
}

export default MaskFormWrapper;
