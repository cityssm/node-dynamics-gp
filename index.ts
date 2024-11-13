import { minutesToSeconds, secondsToMillis } from '@cityssm/to-millis'
import type { config as MSSQLConfig } from 'mssql'
import NodeCache from 'node-cache'

import _extendGpInvoice from './diamond/extendGpInvoice.js'
import _getCashReceiptByDocumentNumber from './diamond/getCashReceiptByDocumentNumber.js'
import type {
  DiamondCashReceipt,
  DiamondExtendedGPInvoice
} from './diamond/types.js'
import _getAccountByAccountIndex from './gp/getAccountByAccountIndex.js'
import _getCustomerByCustomerNumber from './gp/getCustomerByCustomerNumber.js'
import _getInvoiceByInvoiceNumber from './gp/getInvoiceByInvoiceNumber.js'
import _getInvoiceDocumentTypes from './gp/getInvoiceDocumentTypes.js'
import _getItemByItemNumber from './gp/getItemByItemNumber.js'
import _getItemsByLocationCodes from './gp/getItemsByLocationCodes.js'
import _getVendorByVendorId from './gp/getVendorByVendorId.js'
import type {
  GPAccount,
  GPCustomer,
  GPInvoice,
  GPInvoiceDocumentType,
  GPItemWithQuantities,
  GPItemWithQuantity,
  GPVendor
} from './gp/types.js'

export interface DynamicsGPOptions {
  /**
   * Time in seconds until cached lookup records expire
   */
  cacheTTL: number

  /**
   * Time in seconds until cached document records expire
   */
  documentCacheTTL: number
}

const defaultOptions: DynamicsGPOptions = {
  cacheTTL: minutesToSeconds(3),
  documentCacheTTL: minutesToSeconds(1)
}

function getInvoiceCacheKey(
  invoiceNumber: string,
  invoiceDocumentTypeOrAbbreviationOrName?: number | string
): string {
  return `${(
    invoiceDocumentTypeOrAbbreviationOrName ?? ''
  ).toString()}::${invoiceNumber}`
}

export class DynamicsGP {
  readonly #mssqlConfig: MSSQLConfig
  readonly #options: DynamicsGPOptions

  readonly #accountCache: NodeCache
  readonly #customerCache: NodeCache
  readonly #invoiceCache: NodeCache
  readonly #itemCache: NodeCache
  readonly #vendorCache: NodeCache

  #invoiceDocumentTypesCache: GPInvoiceDocumentType[] = []
  #invoiceDocumentTypesCacheExpiryMillis = 0

  readonly #diamondCashReceiptCache: NodeCache
  readonly #diamondInvoiceCache: NodeCache

  constructor(mssqlConfig: MSSQLConfig, options?: Partial<DynamicsGPOptions>) {
    this.#mssqlConfig = mssqlConfig
    this.#options = { ...defaultOptions, ...options }

    this.#accountCache = new NodeCache({ stdTTL: this.#options.cacheTTL })
    this.#customerCache = new NodeCache({ stdTTL: this.#options.cacheTTL })
    this.#itemCache = new NodeCache({ stdTTL: this.#options.cacheTTL })
    this.#vendorCache = new NodeCache({ stdTTL: this.#options.cacheTTL })

    this.#invoiceCache = new NodeCache({
      stdTTL: this.#options.documentCacheTTL
    })

    this.#diamondCashReceiptCache = new NodeCache({
      stdTTL: this.#options.documentCacheTTL
    })

    this.#diamondInvoiceCache = new NodeCache({
      stdTTL: this.#options.documentCacheTTL
    })
  }

  clearCaches(): void {
    this.#accountCache.flushAll()
    this.#customerCache.flushAll()
    this.#invoiceCache.flushAll()
    this.#itemCache.flushAll()
    this.#vendorCache.flushAll()
    this.#vendorCache.flushAll()

    this.#invoiceDocumentTypesCache = []
    this.#invoiceDocumentTypesCacheExpiryMillis = 0

    this.#diamondCashReceiptCache.flushAll()
    this.#diamondInvoiceCache.flushAll()
  }

  async getAccountByAccountIndex(
    accountIndex: number | string
  ): Promise<GPAccount | undefined> {
    let account: GPAccount | undefined =
      this.#accountCache.get(accountIndex) ?? undefined

    if (account === undefined) {
      account = await _getAccountByAccountIndex(this.#mssqlConfig, accountIndex)
      this.#accountCache.set(accountIndex, account)
    }

    return account
  }

  async getCustomerByCustomerNumber(
    customerNumber: string
  ): Promise<GPCustomer | undefined> {
    let customer: GPCustomer | undefined =
      this.#customerCache.get(customerNumber) ?? undefined

    if (customer === undefined) {
      customer = await _getCustomerByCustomerNumber(
        this.#mssqlConfig,
        customerNumber
      )
      this.#customerCache.set(customerNumber, customer)
    }

    return customer
  }

  async #getInvoiceByInvoiceNumber(
    invoiceNumber: string,
    invoiceDocumentTypeOrAbbreviationOrName?: number | string,
    skipCache = false
  ): Promise<GPInvoice | undefined> {
    const cacheKey = getInvoiceCacheKey(
      invoiceNumber,
      invoiceDocumentTypeOrAbbreviationOrName
    )

    let invoice: GPInvoice | undefined =
      this.#invoiceCache.get(cacheKey) ?? undefined

    if (invoice === undefined || skipCache) {
      invoice = await _getInvoiceByInvoiceNumber(
        this.#mssqlConfig,
        invoiceNumber,
        invoiceDocumentTypeOrAbbreviationOrName
      )

      if (!skipCache) {
        this.#invoiceCache.set(cacheKey, invoice)
      }
    }

    return invoice
  }

  async getInvoiceByInvoiceNumber(
    invoiceNumber: string,
    invoiceDocumentTypeOrAbbreviationOrName?: number | string
  ): Promise<GPInvoice | undefined> {
    return await this.#getInvoiceByInvoiceNumber(
      invoiceNumber,
      invoiceDocumentTypeOrAbbreviationOrName,
      false
    )
  }

  async getInvoiceDocumentTypes(): Promise<GPInvoiceDocumentType[]> {
    if (this.#invoiceDocumentTypesCacheExpiryMillis < Date.now()) {
      this.#invoiceDocumentTypesCache = await _getInvoiceDocumentTypes(
        this.#mssqlConfig
      )
      this.#invoiceDocumentTypesCacheExpiryMillis =
        Date.now() + secondsToMillis(this.#options.cacheTTL)
    }

    return this.#invoiceDocumentTypesCache
  }

  async getItemByItemNumber(
    itemNumber: string
  ): Promise<GPItemWithQuantities | undefined> {
    let item: GPItemWithQuantities | undefined =
      this.#itemCache.get(itemNumber) ?? undefined

    if (item === undefined) {
      item = await _getItemByItemNumber(this.#mssqlConfig, itemNumber)
      this.#itemCache.set(itemNumber, item)
    }

    return item
  }

  async getItemsByLocationCodes(
    locationCodes: string[] = ['']
  ): Promise<GPItemWithQuantity[]> {
    return await _getItemsByLocationCodes(this.#mssqlConfig, locationCodes)
  }

  async getVendorByVendorId(vendorId: string): Promise<GPVendor | undefined> {
    let vendor: GPVendor | undefined =
      this.#vendorCache.get(vendorId) ?? undefined

    if (vendor === undefined) {
      vendor = await _getVendorByVendorId(this.#mssqlConfig, vendorId)
      this.#vendorCache.set(vendorId, vendor)
    }

    return vendor
  }

  async getDiamondCashReceiptByDocumentNumber(
    documentNumber: number | string
  ): Promise<DiamondCashReceipt | undefined> {
    let receipt: DiamondCashReceipt | undefined =
      this.#diamondCashReceiptCache.get(documentNumber)

    if (receipt === undefined) {
      receipt = await _getCashReceiptByDocumentNumber(
        this.#mssqlConfig,
        documentNumber
      )
      this.#diamondCashReceiptCache.set(documentNumber, receipt)
    }

    return receipt
  }

  async getDiamondExtendedInvoiceByInvoiceNumber(
    invoiceNumber: string,
    invoiceDocumentTypeOrAbbreviationOrName?: number | string
  ): Promise<DiamondExtendedGPInvoice | undefined> {
    const cacheKey = getInvoiceCacheKey(
      invoiceNumber,
      invoiceDocumentTypeOrAbbreviationOrName
    )

    let diamondInvoice: DiamondExtendedGPInvoice | undefined =
      this.#diamondInvoiceCache.get(cacheKey) ?? undefined

    if (diamondInvoice === undefined) {
      const gpInvoice = await this.#getInvoiceByInvoiceNumber(
        invoiceNumber,
        invoiceDocumentTypeOrAbbreviationOrName
      )

      if (gpInvoice !== undefined) {
        diamondInvoice = await _extendGpInvoice(this.#mssqlConfig, gpInvoice)

        this.#diamondInvoiceCache.set(cacheKey, diamondInvoice)
      }
    }

    return diamondInvoice
  }
}

export type {
  GPAccount,
  GPCustomer,
  GPInvoice,
  GPInvoiceDocumentType,
  GPItemWithQuantities,
  GPItemWithQuantity,
  GPVendor
} from './gp/types.js'

export type {
  DiamondCashReceipt,
  DiamondExtendedGPInvoice
} from './diamond/types.js'
