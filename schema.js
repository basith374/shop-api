import { gql } from 'apollo-server';

export default gql`
    type Category {
        id: Int!
        name: String!
    }
    type Query {
        categories: [Category!]!
        category(id: Int!): Category
    }
    type Mutation {
        addCategory(name: String!): Category
    }
`