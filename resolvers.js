export default {
    Query: {
        async categories (root, args, { models }) {
            return models.Category.findAll()
        },
        async category (root, { id }, { models }) {
            return models.Category.findById(id)
        }
    },
    Mutation: {
        async addCategory (root, { name }, { models}) {
            return models.Category.create({
                name,
            })
        }
    }
}