// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  mainExporterChangeMessage: {
    id: 'modules.Shipment.mainExporterChangeMessage',
    defaultMessage:
      'Changing the Main Exporter will remove all Batches of the current Main Exporter and all assigned Staff of the current Main Exporter from all Tasks, In Charge, Timeline Assignments, and Container Dates Assignments. Are you sure you want to change the Main Exporter?',
  },
  mainExporterSelectMessage: {
    id: 'modules.Shipment.mainExporterSelectMessage',
    defaultMessage:
      'Selecting a Main Exporter will allow them access to this Shipment. However, it will mean only Batches of the Main Exporter can be used in this Shipment. All Batches that are currently in this Shipment that do not belong to this Main Exporter will be removed. Are you sure you want to select a Main Exporter?',
  },
});
