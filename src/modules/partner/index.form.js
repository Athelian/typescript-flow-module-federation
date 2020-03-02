// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { navigate } from '@reach/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { FormContainer } from 'modules/form';
import { partnerUpdateMutation, prepareParsedPartnerInput } from 'modules/partner/form/mutation';
import PartnerForm from 'modules/partner/form';
import PartnerFormContainer from 'modules/partner/form/container';
import { partnerQuery } from 'modules/partner/form/query';

type Props = {
  partnerId?: string,
};

type ImplProps = {
  isLoading: boolean,
  partnerId: ?string,
};

const formContainer = new FormContainer();

const PartnerFormModuleImpl = ({ isLoading, partnerId }: ImplProps) => {
  const {
    state,
    originalState,
    initializeState,
    isDirty,
    resetState,
  } = PartnerFormContainer.useContainer();

  const [partnerMutate, { loading: isProcessing }] = useMutation(partnerUpdateMutation);

  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  const handleSave = async () => {
    const input = prepareParsedPartnerInput(originalState, state);

    const { data } = await partnerMutate({
      variables: { id: state.id, input },
    });

    const violations = data?.partnerUpdate?.violations;

    if (violations && violations.length) {
      formContainer.onErrors(violations);
    } else {
      initializeState(data?.partnerUpdate);
      formContainer.onReset();
    }
  };

  return (
    <PartnerForm
      {...(partnerId ? { partnerId } : {})}
      isDirty={isDirty}
      resetState={resetState}
      isLoading={isLoading}
      isProcessing={isProcessing}
      handleSave={handleSave}
    />
  );
};

const PartnerFormModule = ({ partnerId }: Props) => {
  const { data, loading: isLoading } = useQuery(partnerQuery, {
    variables: { id: decodeId(partnerId ?? '') },
    fetchPolicy: 'network-only',
    onError: error => {
      if ((error?.message ?? '').includes('403')) {
        navigate('/403');
      }
      logger.error(error);
    },
  });

  return (
    <Provider inject={[formContainer]}>
      <PartnerFormContainer.Provider initialState={data?.partner}>
        <PartnerFormModuleImpl isLoading={isLoading} partnerId={partnerId} />
      </PartnerFormContainer.Provider>
    </Provider>
  );
};

export default PartnerFormModule;
