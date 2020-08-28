// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import type { UserPayload } from 'generated/graphql';
import { isEquals } from 'utils/fp';
import { showToastError } from 'utils/errors';
import ContainerForm from 'modules/container/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import {
  ContainerInfoContainer,
  ContainerBatchesContainer,
} from 'modules/container/form/containers';
import { prepareParsedContainerInput } from 'modules/container/form/mutation';
import validator from 'modules/container/form/validator';
import { createContainerMutation } from './mutation';

type Props = {|
  container: Object,
  intl: IntlShape,
  onSuccessCallback: ?Function,
  shipmentId: string,
  user: UserPayload,
|};

const formContainer = new FormContainer();
const infoContainer = new ContainerInfoContainer();
const batchesContainer = new ContainerBatchesContainer();

type CreateContainerResponse = {|
  containerCreate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

class NewContainerForm extends React.Component<Props> {
  componentDidMount() {
    const { container, user } = this.props;
    const { batches = [], representativeBatch, ...info } = container;
    infoContainer.initDetailValues(info, user.timezone);
    batchesContainer.initDetailValues({ batches, representativeBatch }, user.timezone);
  }

  shouldComponentUpdate(nextProps: Props) {
    const { container } = this.props;

    return !isEquals(container, nextProps.container);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  onSave = async (
    existingBatches: Array<Object>,
    newValues: Object,
    saveContainer: Function,
    onSuccess: Object => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { onSuccessCallback, shipmentId } = this.props;

    const input = {
      ...prepareParsedContainerInput({
        originalValues: null,
        existingBatches,
        newValues,
        location: {
          inContainerForm: true,
          inShipmentForm: false,
        },
      }),
      shipmentId,
    };

    const result = await saveContainer({
      variables: { input },
    });
    if (result && result.data) {
      const { data } = result;
      if (data.containerCreate) {
        const {
          containerCreate: { violations },
        } = data;
        if (violations && violations.length) {
          onErrors(violations);
        } else {
          onSuccess(data?.containerCreate);
          if (onSuccessCallback) {
            onSuccessCallback(data);
          }
        }
      }
    }
  };

  onMutationCompleted = (result: CreateContainerResponse) => {
    const { intl } = this.props;

    showToastError({ result, intl, entity: 'container' });
  };

  render() {
    const { container } = this.props;
    return (
      <Provider inject={[formContainer, infoContainer, batchesContainer]}>
        <Mutation mutation={createContainerMutation} onCompleted={this.onMutationCompleted}>
          {(saveContainer, { loading: isLoading, error: apiError }) => (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="CONTAINER" color="CONTAINER" />
                <JumpToSection>
                  <SectionTabs
                    link="container_containerSection"
                    label={
                      <FormattedMessage
                        id="modules.container.container"
                        defaultMessage="CONTAINER"
                      />
                    }
                    icon="CONTAINER"
                  />
                  <SectionTabs
                    link="container_batchesSection"
                    label={
                      <FormattedMessage id="modules.container.batches" defaultMessage="BATCHES" />
                    }
                    icon="BATCH"
                  />
                  <SectionTabs
                    link="container_ordersSection"
                    label={
                      <FormattedMessage id="modules.container.orders" defaultMessage="ORDERS" />
                    }
                    icon="ORDER"
                  />
                </JumpToSection>
                <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
                  {(containerInfoContainer, containerBatchesContainer) =>
                    (containerInfoContainer.isDirty() || containerBatchesContainer.isDirty()) && (
                      <>
                        <ResetFormButton
                          onClick={() => {
                            resetFormState(containerInfoContainer);
                            resetFormState(containerBatchesContainer);
                            formContainer.onReset();
                          }}
                        />
                        <SaveFormButton
                          id="container_form_save_button"
                          isLoading={isLoading}
                          disabled={
                            !formContainer.isReady(
                              {
                                ...containerInfoContainer.state,
                                ...containerBatchesContainer.state,
                              },
                              validator
                            )
                          }
                          onClick={() =>
                            this.onSave(
                              containerBatchesContainer.existingBatches,
                              {
                                ...containerInfoContainer.state,
                                ...containerBatchesContainer.state,
                              },
                              saveContainer,
                              () => {
                                formContainer.onReset();
                              },
                              formContainer.onErrors
                            )
                          }
                        />
                      </>
                    )
                  }
                </Subscribe>
              </SlideViewNavBar>

              <Content>
                {apiError && <p>Error: Please try again.</p>}
                <ContainerForm isSlideView container={container} />
              </Content>
            </SlideViewLayout>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(NewContainerForm);
