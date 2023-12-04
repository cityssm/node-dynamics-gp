import NodeCache from 'node-cache';
import { _extendGpInvoice } from './diamond/extendGpInvoice.js';
import { _getCashReceiptByDocumentNumber } from './diamond/getCashReceiptByDocumentNumber.js';
import { _getAccountByAccountIndex } from './gp/getAccountByAccountIndex.js';
import { _getCustomerByCustomerNumber } from './gp/getCustomerByCustomerNumber.js';
import { _getInvoiceByInvoiceNumber } from './gp/getInvoiceByInvoiceNumber.js';
import { _getInvoiceDocumentTypes } from './gp/getInvoiceDocumentTypes.js';
import { _getItemByItemNumber } from './gp/getItemByItemNumber.js';
import { _getVendorByVendorId } from './gp/getVendorByVendorId.js';
const defaultOptions = {
    cacheTTL: 3 * 60,
    documentCacheTTL: 60
};
function getInvoiceCacheKey(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName) {
    return `${(invoiceDocumentTypeOrAbbreviationOrName ?? '').toString()}::${invoiceNumber}`;
}
export class DynamicsGP {
    #mssqlConfig;
    #options;
    #accountCache;
    #customerCache;
    #invoiceCache;
    #itemCache;
    #vendorCache;
    #invoiceDocumentTypesCache = [];
    #invoiceDocumentTypesCacheExpiryMillis = 0;
    #diamondCashReceiptCache;
    #diamondInvoiceCache;
    constructor(mssqlConfig, options) {
        this.#mssqlConfig = mssqlConfig;
        this.#options = Object.assign({}, defaultOptions, options);
        this.#accountCache = new NodeCache({ stdTTL: this.#options.cacheTTL });
        this.#customerCache = new NodeCache({ stdTTL: this.#options.cacheTTL });
        this.#itemCache = new NodeCache({ stdTTL: this.#options.cacheTTL });
        this.#vendorCache = new NodeCache({ stdTTL: this.#options.cacheTTL });
        this.#invoiceCache = new NodeCache({
            stdTTL: this.#options.documentCacheTTL
        });
        this.#diamondCashReceiptCache = new NodeCache({
            stdTTL: this.#options.documentCacheTTL
        });
        this.#diamondInvoiceCache = new NodeCache({
            stdTTL: this.#options.documentCacheTTL
        });
    }
    clearCaches() {
        this.#accountCache.flushAll();
        this.#customerCache.flushAll();
        this.#invoiceCache.flushAll();
        this.#itemCache.flushAll();
        this.#vendorCache.flushAll();
        this.#vendorCache.flushAll();
        this.#invoiceDocumentTypesCache = [];
        this.#invoiceDocumentTypesCacheExpiryMillis = 0;
        this.#diamondCashReceiptCache.flushAll();
        this.#diamondInvoiceCache.flushAll();
    }
    async getAccountByAccountIndex(accountIndex) {
        let account = this.#accountCache.get(accountIndex) ?? undefined;
        if (account === undefined) {
            account = await _getAccountByAccountIndex(this.#mssqlConfig, accountIndex);
            this.#accountCache.set(accountIndex, account);
        }
        return account;
    }
    async getCustomerByCustomerNumber(customerNumber) {
        let customer = this.#customerCache.get(customerNumber) ?? undefined;
        if (customer === undefined) {
            customer = await _getCustomerByCustomerNumber(this.#mssqlConfig, customerNumber);
            this.#customerCache.set(customerNumber, customer);
        }
        return customer;
    }
    async #getInvoiceByInvoiceNumber(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName, skipCache = false) {
        const cacheKey = getInvoiceCacheKey(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName);
        let invoice = this.#invoiceCache.get(cacheKey) ?? undefined;
        if (invoice === undefined || skipCache) {
            invoice = await _getInvoiceByInvoiceNumber(this.#mssqlConfig, invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName);
            if (!skipCache) {
                this.#invoiceCache.set(cacheKey, invoice);
            }
        }
        return invoice;
    }
    async getInvoiceByInvoiceNumber(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName) {
        return await this.#getInvoiceByInvoiceNumber(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName, false);
    }
    async getInvoiceDocumentTypes() {
        if (this.#invoiceDocumentTypesCacheExpiryMillis < Date.now()) {
            this.#invoiceDocumentTypesCache = await _getInvoiceDocumentTypes(this.#mssqlConfig);
            this.#invoiceDocumentTypesCacheExpiryMillis =
                Date.now() + this.#options.cacheTTL * 1000;
        }
        return this.#invoiceDocumentTypesCache;
    }
    async getItemByItemNumber(itemNumber) {
        let item = this.#itemCache.get(itemNumber) ?? undefined;
        if (item === undefined) {
            item = await _getItemByItemNumber(this.#mssqlConfig, itemNumber);
            this.#itemCache.set(itemNumber, item);
        }
        return item;
    }
    async getVendorByVendorId(vendorId) {
        let vendor = this.#vendorCache.get(vendorId) ?? undefined;
        if (vendor === undefined) {
            vendor = await _getVendorByVendorId(this.#mssqlConfig, vendorId);
            this.#vendorCache.set(vendorId, vendor);
        }
        return vendor;
    }
    async getDiamondCashReceiptByDocumentNumber(documentNumber) {
        let receipt = this.#diamondCashReceiptCache.get(documentNumber);
        if (receipt === undefined) {
            receipt = await _getCashReceiptByDocumentNumber(this.#mssqlConfig, documentNumber);
            this.#diamondCashReceiptCache.set(documentNumber, receipt);
        }
        return receipt;
    }
    async getDiamondExtendedInvoiceByInvoiceNumber(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName) {
        const cacheKey = getInvoiceCacheKey(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName);
        let diamondInvoice = this.#diamondInvoiceCache.get(cacheKey) ?? undefined;
        if (diamondInvoice === undefined) {
            const gpInvoice = await this.#getInvoiceByInvoiceNumber(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName);
            if (gpInvoice !== undefined) {
                diamondInvoice = await _extendGpInvoice(this.#mssqlConfig, gpInvoice);
                this.#diamondInvoiceCache.set(cacheKey, diamondInvoice);
            }
        }
        return diamondInvoice;
    }
}
