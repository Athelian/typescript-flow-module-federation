// @flow
// import gql from 'graphql-tag';

/*
const productTagsQuery = gql`
  query {
    viewer {
      productTags {
        id
        name
        description
        color
      }
    }
  }
`;

const shipmentTagsQuery = gql`
  query {
    viewer {
      shipmentTags {
        id
        name
        description
        color
      }
    }
  }
`;

const userTagsQuery = gql`
  query {
    viewer {
      userTags {
        id
        name
        description
        color
      }
    }
  }
`;

const batchTagsQuery = gql`
  query {
    viewer {
      batchTags {
        id
        name
        description
        color
      }
    }
  }
`;


export { productTagsQuery, shipmentTagsQuery, userTagsQuery, batchTagsQuery };

const tagsQuery = {
  productTags: productTagsQuery,
  shipmentTags: shipmentTagsQuery,
  userTags: userTagsQuery,
  batchTags: batchTagsQuery,
};
*/

export default (tagType: string) => tagType;
