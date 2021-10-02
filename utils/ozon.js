import axios from 'axios';

class Ozon {
  constructor(clientId, apiKey) {
    this.ozonApi = axios.create({
      baseURL: 'https://api-seller.ozon.ru/',
      headers: {
        'Client-Id': clientId,
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    this.prams = [];
    this.total_prams = 0;
  }

  async getFid() {
    const items = await this.getItems();
    const requests = this.createRequests(items);
    // await Promise.allSettled(requests).then((value) => {
    //   console.log(value);
    // });

    await axios.all(requests).then(axios.spread((...values) => {
      this.prams = values;
    }));

    return this.prams;
  }

  async getItems() {
    try {
      const res = await this.ozonApi({
        method: 'POST',
        url: 'v1/product/list',
        data: {
          filter: {
            visibility: 'ALL',
          },
          page: 0,
          page_size: 250,
        },
      });
      this.total_prams = res.data.result.total;
      return res.data.result.items;
    } catch (error) {
      return new Error(error);
    }
  }

  async createRequestProductInfo(offerId) {
    try {
      const req = await this.ozonApi({
        method: 'POST',
        url: 'v2/product/info',
        data: {
          offer_id: offerId,
        },
      });
      return req.data.result;
    } catch (error) {
      return new Error(error);
    }
  }

  async createRequestProductInfoAttributes(offerId) {
    try {
      const req = await this.ozonApi({
        method: 'POST',
        url: 'v2/products/info/attributes',
        data: {
          filter: {
            offer_id: [offerId],
          },
          page: 0,
          page_size: 1000,
        },
      });
      return req.data.result[0];
    } catch (error) {
      return new Error(error);
    }
  }

  async createRequestProductInfoDescription(offerId) {
    try {
      const req = await this.ozonApi({
        method: 'POST',
        url: 'v1/product/info/description',
        data: {
          offer_id: offerId,
        },
      });
      return req.data.result;
    } catch (error) {
      return new Error(error);
    }
  }

  async createRequestProduct(offerId) {
    try {
      const productInfo = await this.createRequestProductInfo(offerId);
      const productInfoAttributes = await this.createRequestProductInfoAttributes(offerId);
      const productInfoDescription = await this.createRequestProductInfoDescription(offerId);
      const requests = [productInfo, productInfoAttributes, productInfoDescription];
      const product = {};

      await axios.all(requests).then(axios.spread((...values) => {
        values.forEach((value) => {
          Object.assign(product, value);
        });
      }));

      return product;
    } catch (error) {
      return new Error(error);
    }
  }

  createRequests(arr) {
    const arrayRequests = [];

    arr.forEach((item) => {
      const offerId = item.offer_id;
      arrayRequests.push(this.createRequestProduct(offerId));
    });
    return arrayRequests;
  }
}

export default Ozon;
