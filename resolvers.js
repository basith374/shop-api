import jwt from 'jsonwebtoken';
import _ from 'lodash';
import cloudinary from 'cloudinary';
import { OAuth2Client } from 'google-auth-library';
import { JWT_SECRET } from '.';
import { Op } from 'sequelize';
import { pubsub } from './index';

// google sign on
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export default {
    Query: {
        async categories (root, { str }, { models }) {
            let params = {}
            if(str) params.where = { name: { [Op.like]: '%' + str + '%' } }
            return models.Category.findAll(params)
        },
        async category (root, { name }, { models }) {
            return models.Category.findOne({
                where: { name }
            })
        },
        async products (root, { str }, { models }) {
            let params = {}
            if(str) params.where = { name: { [Op.like]: '%' + str + '%' } }
            return models.Product.findAll(params)
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
        async orders (root, { status }, { models, user }) {
            if(user.type === 'customer') {
                return models.Customer.findOne({
                    where: { id: user.id }
                }).then(customer => {
                    return customer.getOrders();
                })
            }
            const params = { where: {}, include: models.OrderItem }
            if(status) params.where.status = status;
            return models.Order.findAll(params)
        },
        async images (root, { str }, { models }) {
            const params = { where: {} }
            if(str) params.where.filename = { [Op.like]: '%' + str + '%' }
            return models.Image.findAll(params)
        },
        async search (root, { str }, { models }) {
            return Promise.all([
                models.Product.findAll({
                    where: {
                        name: { [Op.like]: '%' + str + '%' }
                    },
                    include: models.Image
                }),
                models.Category.findAll({
                    where: {
                        name: { [Op.like]: '%' + str + '%' }
                    },
                    include: models.Image
                })
            ]).then(result => {
                return [
                    ...result[0].map(async i => {
                        const { id, name } = i;
                        const images = await i.getImages();
                        return {
                            type: 'product',
                            id,
                            name,
                            image: images[0].filename
                        }
                    }),
                    ...result[1].map(async i => {
                        const { id, name } = i;
                        const image = await i.getImage();
                        return {
                            type: 'category',
                            id,
                            name,
                            image: image.filename
                        }
                    }),
                ]
            })
        },
        async setting (root, { key }, { models }) {
            return models.Setting.findOne({
                where: { key }
            }).then(setting => _.get(setting, 'value', ''))
        },
        async addresses (root, args, { models, user }) {
            if(!user) return null;
            if(user.type === 'customer') {
                return models.Customer.findOne({
                    where: { id: user.id }
                }, {
                    include: models.Address
                }).then(customer => {
                    return customer.getAddresses();
                })
            } else {
                return models.Address.findAll()
            }
        },
        async users (root, args, { models, user }) {
            return models.User.findAll()
        },
        async user (root, args, { models, user }) {
            return models.User.findByPk(user.id);
        },
    },
    Subscription: {
        orderAdded: {
            subscribe: () => pubsub.asyncIterator(['ORDER_ADDED'])
        }
    },
    Mutation: {
        async addUser (root, args, { models }) {
            const { email } = args;
            return models.User.findOne({
                where: { email }
            }).then(user => {
                if(user) {
                    throw new Error('user already exists')
                } else {
                    return models.User.create(args);
                }
            })
        },
        async updateUser (root, { id, ...args}, { models }) {
            return models.User.findByPk(id).then(user => {
                return user.update(args);
            })
        },
        async deleteUser (root, { id }, { models, user }) {
            if(user.roles === 'admin') {
                return models.User.destroy({ where: { id } });
            }
            throw new Error('no permissions');
        },
        async updateSetting (root, { key, value }, { models }) {
            return models.Setting.findOne({
                where: { key }
            }).then(setting => {
                if(!setting) return models.Setting.create({ key, value }).then(rsp => true)
                else return setting.update({ value }).then(rsp => true)
            })
        },
        async login(root, { token }, { models }) {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            })
            const payload = ticket.getPayload();
            const { email, name } = payload;
            let user = await models.User.findOne({ where: { email } })
            const authenticateUser = (user) => {
                let token = jwt.sign({ id: user.id, email, name, roles: user.roles, type: 'user' }, JWT_SECRET, {
                    expiresIn: '7d'
                })
                return token;
            }
            if(user) return authenticateUser(user);
            throw new Error('Access denied')
        },
        async customerLogin(root, { email, name, token }, { models }) {
            await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            })
            let user = await models.Customer.findOne({ where:  { email } })
            const authenticateUser = (user) => {
                let token = jwt.sign({ id: user.id, email, name, type: 'customer' }, JWT_SECRET, {
                    expiresIn: '14d'
                })
                return token
            }
            if(!user) {
                user = await models.Customer.create({ email, name })
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
            }).then(async product => {
                let incomingIds = ProductVariants.map(v => v.id);
                let removedIds = product.ProductVariants.filter(v => !incomingIds.includes(v.id)).map(v => v.id);
                // remove associations
                await models.ProductVariant.destroy({
                    where: {
                        id: removedIds
                    }
                })
                // create/update associations
                ProductVariants.forEach(async v => {
                    if('id' in v) {
                        let {id, ...data} = v;
                        await models.ProductVariant.update(data, {
                            where: { id }
                        })
                    } else {
                        await product.createProductVariant(v);
                    }
                })
                return models.Image.findAll({
                    where: {
                        id: images
                    }
                }).then(async attachImages => {
                    await product.setImages(attachImages);
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
        async addOrder(root, data, { models, user }) {
            if(!user) return null;
            let { CustomerId } = data;
            if(user.type === 'customer') CustomerId = user.id;
            let orderItemMap = _.keyBy(data.OrderItems, 'id')
            return models.ProductVariant.findAll({
                where: {
                    id: data.OrderItems.map(pv => pv.id)
                },
                include: {
                    model: models.Product,
                    include: models.Image
                }
            }).then(async variants => {
                let orderTotal = 0;
                const items = await Promise.all(variants.map(async pv => {
                    let qty = orderItemMap[pv.id].qty;
                    let price = qty * pv.price;
                    let images = await pv.Product.getImages();
                    orderTotal += price;
                    return {
                        productVariantId: pv.id,
                        name: pv.name + ' ' + pv.Product.name,
                        qty,
                        price,
                        ImageId: images[0].id,
                    }
                }));
                return models.Order.create({
                    ...data,
                    CustomerId,
                    total: orderTotal,
                    OrderItems: items,
                    status: 0,
                }, {
                    include: models.OrderItem
                }).then(order => {
                    pubsub.publish('ORDER_ADDED', { orderAdded: order })
                    return order;
                });
            })
        },
        async updateOrder(root, data, { models }) {

        },
        async updateOrderStatus(root, data, { models }) {

        },
        async deleteOrder(root, { id }, { models }) {

        },
        async addAddress(root, data, { models, user }) {
            return models.Customer.findOne({ id: user.id }).then(customer => {
                return customer.createAddress(data);
            })
        },
        async updateAddress(root, data, { models }) {

        },
        async deleteAddress(root, { id }, { models, user }) {
            if(!user) return null;
            const address = await models.Address.findByPk(id);
            if(address && address.CustomerId === user.id) {
                return await address.destroy();
            }
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
        },
        async image (category) {
            return category.getImage()
        },
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
        async image (orderItem) {
            return orderItem.getImage()
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