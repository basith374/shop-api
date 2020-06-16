import { gql } from 'apollo-server';

export default gql`
    type Category {
        id: Int!
        name: String!
        products: [Product!]!
    }
    type Product {
        id: Int!
        name: String!
        description: String
        tags: String
        category: Category!,
        active: Boolean!
        variants: [ProductVariant!]!
        images: [Image]!
    }
    type ProductVariant {
        id: Int!
        name: String!
        price: Float!
        purchasePrice: Float!
        mrp: Float!
        product: Product!
    }
    input ProductVariantInput {
        id: Int
        name: String!
        price: Float!
        purchasePrice: Float!
        mrp: Float!
    }
    type Store {
        id: Int!
        name: String!
        streetAddress: String
        locality: String!
        pincode: String
        active: Boolean!
    }
    type Customer {
        id: Int!
        name: String!
        active: Boolean!
        orders: [Order!]!
        addresses: [Address!]!
    }
    type Order {
        id: Int!
        total: Float!
        deliveryCharge: Float!
        customer: Customer!
        address: Address! # not a snapshot, if user changes address, create new one
        status: Int!
        items: [OrderItem!]!
        createdAt: String!
    }
    type OrderItem {
        name: String!
        price: Float!
        qty: Float!
        productVariant: ProductVariant # might get deleted
        order: Order!
    }
    input OrderItemInput {
        productVariantId: Int!
        qty: Float!
    }
    type Image {
        id: Int!
        filename: String!
    }
    type Address {
        id: Int!
        streetAddress: String!
        landmark: String!
        locality: String!
        pincode: String!
        type: String! # home or office
        customer: Customer!
        orders: [Order!]!
    }
    type Query {
        categories: [Category!]!
        category(id: Int!): Category
        products: [Product!]!
        product(id: Int!): Product
        store(id: Int!): Store
        stores: [Store!]!
        customer(id: Int!): Customer
        customers: [Customer!]!
        orders: [Order!]!
        images: [Image!]!
        pendingOrders: [Order!]!
    }
    type Mutation {
        login(name: String!, email: String!, token: String!): String

        addCategory(name: String!): Category
        updateCategory(id: Int!, name: String!): [Int]
        deleteCategory(id: Int!): Boolean

        addProduct(name: String!, description: String, tags: String, CategoryId: Int!, active: Boolean, ProductVariants: [ProductVariantInput!]!, images: [Int!]!): Product
        updateProduct(id: Int!, name: String!, description: String, tags: String, CategoryId: Int!, active: Boolean, ProductVariants: [ProductVariantInput!]!, images: [Int!]!): [Int]
        deleteProduct(id: Int!): Boolean

        addStore(name: String!, streetAddress: String, locality: String!, pincode: String, active: Boolean): Store
        updateStore(id: Int!, name: String!, streetAddress: String, locality: String!, pincode: String, active: Boolean): [Int]
        deleteStore(id: Int!): Boolean

        uploadImage(image: Upload!): Image!
        deleteImage(id: Int!): Boolean

        addOrder(CustomerId: Int!, AddressId: Int!, deliveryCharge: Float!, OrderItems: [OrderItemInput!]!): Order
        updateOrder(id: Int!, CustomerId: Int!, AddressId: Int!, deliveryCharge: Float!, OrderItems: [OrderItemInput!]!): [Int]
        updateOrderStatus(id: Int!, status: Int!): [Int]
        deleteOrder(id: Int!): Boolean

        addAddress(streetAddress: String!, landmark: String!, locality: String!, pincode: String!, type: String!): Address
        updateAddress(id: Int!, streetAddress: String!, landmark: String!, locality: String!, pincode: String!, type: String!): [Int]
        deleteAddress(id: Int!): Boolean

        addCustomer(name: String!): Customer
        updateCustomer(id: Int!, name: String!, active: Boolean!): [Int]
        deleteCustomer(id: Int!): Boolean
    }
`