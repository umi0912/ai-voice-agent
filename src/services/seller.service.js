export class SellerService {
  constructor() {
    this.sellers = new Map();
  }

  addSeller(merchantId, sellerData) {
    this.sellers.set(merchantId, sellerData);
    return sellerData;
  }

  getSeller(merchantId) {
    return this.sellers.get(merchantId);
  }

  hasSeller(merchantId) {
    return this.sellers.has(merchantId);
  }

  removeSeller(merchantId) {
    return this.sellers.delete(merchantId);
  }

  getAllSellers() {
    return Array.from(this.sellers.entries());
  }
}
