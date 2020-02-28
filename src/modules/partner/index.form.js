// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { navigate } from '@reach/router';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { FormContainer } from 'modules/form';
import QueryFormV2 from 'components/common/QueryFormV2';
import { decodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import { showToastError } from 'utils/errors';
import { getByPath } from 'utils/fp';
import PartnerForm from './form';
import PartnerInfoContainer from './form/containers';
import { partnerFormQuery } from './form/query';
import { updatePartnerMutation, prepareParsedPartnerInput } from './form/mutation';
import validator from './form/validator';

type OptionalProps = {
  path: string,
  partnerId: string,
};

type Props = OptionalProps & {
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  partnerId: '',
};

type UpdatePartnerResponse = {|
  partnerUpdate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type PartnerFormState = {
  partnerInfoState: Object,
};

const formContainer = new FormContainer();
class PartnerFormContainer extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  initAllValues = ({ partnerInfoState }: PartnerFormState, partner: Object) => {
    partnerInfoState.initDetailValues(partner);
    return null;
  };

  onCancel = () => navigate(`/partner`);

  onSave = async (
    originalValues: Object,
    formData: Object,
    savePartner: Function,
    onSuccess: Object => void,
    onErrors: Function = () => {}
  ) => {
    const { partnerId } = this.props;

    const input = prepareParsedPartnerInput(
      removeTypename(originalValues),
      removeTypename(formData)
    );

    if (partnerId) {
      const { data } = await savePartner({
        variables: {
          input,
          // id: decodeId(partnerId),
          id: partnerId,
        },
      });
      if (!data) return;

      const {
        partnerUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('partnerUpdate', data));
      }
    }
  };

  onMutationCompleted = (result: UpdatePartnerResponse) => {
    const { intl } = this.props;

    showToastError({ intl, result, entity: 'partner' });
  };

  onFormReady = ({ partnerInfoState }: PartnerFormState, partner: Object) => {
    const hasInitialStateYet = partnerInfoState.state.id || Object.keys(partner).length === 0;
    if (hasInitialStateYet) return null;

    this.initAllValues({ partnerInfoState }, partner);
    return null;
  };

  render() {
    const { partnerId } = this.props;
    let mutationKey = {};

    if (partnerId) {
      mutationKey = { key: decodeId(partnerId) };
    }

    return (
      <Provider inject={[formContainer]}>
        <Mutation
          mutation={updatePartnerMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(savePartner, { loading: isLoading, error: apiError }) => (
            <>
              <NavBar>
                <EntityIcon icon="PARTNER" color="PARTNER" />
                <JumpToSection>
                  <SectionTabs
                    link="partner_partnerSection"
                    label={
                      <FormattedMessage id="modules.Partners.partner" defaultMessage="PARTNER" />
                    }
                    icon="PARTNER"
                  />
                </JumpToSection>
                <Subscribe to={[PartnerInfoContainer, FormContainer]}>
                  {(partnerInfoState, form) => {
                    const isDirty = partnerInfoState.isDirty();

                    return (
                      <>
                        {isDirty && (
                          <ResetFormButton
                            onClick={() => {
                              this.initAllValues(
                                { partnerInfoState },
                                { ...partnerInfoState.originalValues }
                              );
                              form.onReset();
                            }}
                          />
                        )}

                        {isDirty && (
                          <SaveFormButton
                            data-testid="saveButton"
                            disabled={!form.isReady({ ...partnerInfoState.state }, validator)}
                            isLoading={isLoading}
                            onClick={() =>
                              this.onSave(
                                {
                                  ...partnerInfoState.originalValues,
                                },
                                {
                                  ...partnerInfoState.state,
                                },
                                savePartner,
                                updatePartner => {
                                  this.initAllValues(
                                    {
                                      partnerInfoState,
                                    },
                                    {
                                      ...updatePartner,
                                    }
                                  );
                                  form.onReset();
                                },
                                form.onErrors
                              )
                            }
                          />
                        )}
                      </>
                    );
                  }}
                </Subscribe>
              </NavBar>
              <Content>
                {apiError && <p>Error: Please try again.</p>}
                <QueryFormV2
                  query={partnerFormQuery}
                  entityId={partnerId}
                  entityType="partner"
                  render={(partner, loading) => (
                    <>
                      <PartnerForm partner={partner} isLoading={loading} />
                      <Subscribe to={[PartnerInfoContainer]}>
                        {partnerInfoState =>
                          this.onFormReady(
                            {
                              partnerInfoState,
                            },
                            partner
                          )
                        }
                      </Subscribe>
                    </>
                  )}
                />
              </Content>
            </>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(PartnerFormContainer);
