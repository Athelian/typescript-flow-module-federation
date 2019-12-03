// @flow
import gql from 'graphql-tag';

export const sheetProductFragment = gql`
  fragment sheetProductFragment on Product {
    id
    name
    serial
    material
  }
`;

export default sheetProductFragment;
