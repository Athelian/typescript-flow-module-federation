// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import PartnerSelectorInput from '../PartnerSelectorInput';

function MainExporterInput(props: any): React$Node {
  const { value, readonly } = props;
  const { isExporter } = useUser();
  return (
    <PartnerSelectorInput.Exporter
      {...props}
      readonly={readonly || isExporter()}
      extra={{
        confirmationDialogMessage: value ? (
          <FormattedMessage
            id="modules.Shipment.mainExporterChangeMessage"
            defaultMessage="Changing the Main Exporter will remove all Batches of the current Main Exporter and all assigned Staff of the current Main Exporter from all Tasks, In Charge, Timeline Assignments, and Container Dates Assignments. Are you sure you want to change the Main Exporter?"
          />
        ) : (
          <FormattedMessage
            id="modules.Shipment.mainExporterSelectMessage"
            defaultMessage="Selecting a Main Exporter will allow them access to this Shipment. However, it will mean only Batches of the Main Exporter can be used in this Shipment. All Batches that are currently in this Shipment that do not belong to this Main Exporter will be removed. Are you sure you want to select a Main Exporter?"
          />
        ),
      }}
    />
  );
}

export default MainExporterInput;
