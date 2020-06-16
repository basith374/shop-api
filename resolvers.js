import jwt from 'jsonwebtoken';
import _ from 'lodash';
import cloudinary from 'cloudinary';
import { OAuth2Client } from 'google-auth-library';
import { JWT_SECRET } from '.';

// google sign on
const CLIENT_ID = '';
const client = new OAuth2Client(CLIENT_ID);

export default {
    Query: {
        async categories (root, args, { models }) {
            return models.Category.findAll()
        },
        async category (root, { id }, { models }) {
            return models.Category.findByPk(id)
        },
        async products (root, args, { models }) {
            return models.Product.findAll()
        },
        async product (root, { id }, { models }) {
            return models.Product.findByPk(id)
        },
        async stores (root, args, { models }) {
            return models.Store.findAll()
        },
        async store (root, { id }, { models }) {
            return models.Store.findByPk(id)
        },
        async customers (root, args, { models }) {
            return models.Customer.findAll()
        },
        async orders (root, args, { models }) {
            return models.Order.findAll()
        },
        async images (root, args, { models }) {
            return models.Image.findAll()
        },
        async pendingOrders (root, args, { models }) {
            return models.Order.findAll({
                where: {
                    status: 0
                },
                include: models.OrderItem
            })
        }
    },
    Mutation: {
        async login(root, { email, name, token }, { models }) {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            })
            // const payload = ticket.getPayload();
            // const userid = payload['sub'];
            let user = await models.User.findOne({ email })
            const authenticateUser = (user) => {
                let token = jwt.sign({ id: user.id, email, name, roles: user.roles }, JWT_SECRET, {
                    expiresIn: '7d'
                })
                return token
            }
            if(!user) {
                user = await models.User.create({ email, name, roles: 'admin' })
            }
            return authenticateUser(user);
        },
        async addCategory (root, { name }, { models }) {
            return models.Category.create({
                name,
            })
        },
        async addProduct(root, data, { models }) {
            return models.Product.create(data, {
                include: models.ProductVariant
            }).then(product => {
                return models.Image.findAll({
                    where: {
                        id: data.images
                    }
                }).then(attachImages => {
                    product.setImages(attachImages);
                    return product;
                })
            })
        },
        async updateProduct(root, data, { models }) {
            const {id, ProductVariants, images, ...otherData} = data;
            return models.Product.findOne({
                where: { id },
                include: models.ProductVariant
            }).then(product => {
                let incomingIds = ProductVariants.map(v => v.id);
                let removedIds = product.ProductVariants.filter(v => !incomingIds.includes(v.id)).map(v => v.id);
                // remove associations
                models.ProductVariant.destroy({
                    where: {
                        id: removedIds
                    }
                })
                // create/update associations
                ProductVariants.forEach(v => {
                    if('id' in v) {
                        let {id, ...data} = v;
                        models.ProductVariant.update(data, {
                            where: { id }
                        })
                    } else {
                        product.createProductVariant(v);
                    }
                })
                return models.Image.findAll({
                    where: {
                        id: images
                    }
                }).then(attachImages => {
                    product.setImages(attachImages);
                    return [1];
                })
            });
        },
        async deleteProduct(root, { id }, { models }) {
            return models.Product.destroy({
                where: { id }
            });
        },
        async deleteCategory(root, { id }, { models }) {
            return models.Category.destroy({
                where: { id }
            })
        },
        async updateCategory(root, { id, name }, { models }) {
            return models.Category.update({ name }, {
                where: { id }
            });
        },
        async addStore(root, data, { models }) {
            return models.Store.create(data)
        },
        async updateStore(root, { id, name, streetAddress, locality, pincode, active }, { models }) {
            return models.Store.update({ name, streetAddress, locality, pincode, active }, {
                where: { id }
            })
        },
        async deleteStore(root, { id }, { models }) {
            return models.Store.destroy({
                where: { id }
            })
        },
        async uploadImage(root, { image }, { models }) {
            const { filename, mimetype, createReadStream } = await image;
            return await new Promise((resolve, reject) => {
                let data = '';
                const stream = createReadStream(filename);
                stream.setEncoding('base64');
                stream.on('data', d => {
                    data += d;
                }).on('end', () => {
                    const fileb64 = 'data:' + mimetype + ';base64,' + data;
                    cloudinary.v2.uploader.upload(fileb64, {
                        folder: 'shop-images',
                    }, (err, res) => {
                        if(err) reject(err);
                        else {
                            const filename = res.secure_url;
                            const img = models.Image.create({ filename })
                            resolve(img);
                        }
                    })
                }).on('error', err => reject(err))
            });
        },
        async deleteImage(root, { id }, { models }) {
            return models.Image.destroy({
                where: { id }
            })
        },
        async addOrder(root, data, { models }) {
            let orderItemMap = _.keyBy(data.OrderItems, 'productVariantId')
            return models.ProductVariant.findAll({
                where: {
                    id: data.OrderItems.map(pv => pv.productVariantId)
                },
                include: models.Product
            }).then(variants => {
                let orderTotal = 0;
                const items = variants.map(pv => {
                    let qty = orderItemMap[pv.id].qty;
                    let price = qty * pv.price;
                    orderTotal += price;
                    return {
                        productVariantId: pv.id,
                        name: pv.name + ' ' + pv.Product.name,
                        qty,
                        price
                    }
                });
                return models.Order.create({
                    ...data,
                    total: orderTotal,
                    OrderItems: items,
                }, {
                    include: models.OrderItem
                })
            })
        },
        async updateOrder(root, data, { models }) {

        },
        async updateOrderStatus(root, data, { models }) {

        },
        async deleteOrder(root, { id }, { models }) {

        },
        async addAddress(root, data, { models }) {

        },
        async updateAddress(root, data, { models }) {

        },
        async deleteAddress(root, { id }, { models }) {

        },
        async addCustomer(root, data, { models }) {

        },
        async updateCustomer(root, data, { models }) {

        },
        async deleteCustomer(root, { id }, { models }) {

        },
    },
    Product: {
        async category (product) {
            return product.getCategory()
        },
        async variants (product) {
            return product.getProductVariants()
        },
        async images (product) {
            return product.getImages()
        },
    },
    Category: {
        async products (category) {
            return category.getProducts()
        }
    },
    Customer: {
        async orders (customer) {
            return customer.getOrders()
        },
        async addresses (customer) {
            return customer.getAddresses()
        },
    },
    Order: {
        async customer (order) {
            return order.getCustomer()
        },
        async items (order) {
            return order.getOrderItems()
        },
        async address (order) {
            return order.getAddress()
        },
    },
    OrderItem: {
        async order (orderItem) {
            return orderItem.getOrder()
        },
        async productVariant (orderItem) {
            return orderItem.getProductVariant()
        },
    },
    Address: {
        async customer (address) {
            return address.getCustomer()
        },
        async orders (address) {
            return address.getOrders()
        },
    },
}