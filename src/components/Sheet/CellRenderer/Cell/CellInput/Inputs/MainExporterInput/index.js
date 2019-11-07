// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import messages from 'modules/shipment/messages';
import PartnerSelectorInput from '../PartnerSelectorInput';

function MainExporterInput(props: InputProps<Object>): React$Node {
  const { value, readonly } = props;
  const { isExporter } = useUser();
  return (
    <PartnerSelectorInput.Exporter
      {...props}
      readonly={readonly || isExporter()}
      extra={{
        confirmationDialogMessage: value ? (
          <FormattedMessage {...messages.mainExporterChangeMessage} />
        ) : (
          <FormattedMessage {...messages.mainExporterSelectMessage} />
        ),
      }}
    />
  );
}

export default MainExporterInput;
