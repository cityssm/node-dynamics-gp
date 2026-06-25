import { NodeCache } from '@cacheable/node-cache'
import { minutesToSeconds, secondsToMillis } from '@cityssm/to-millis'
import type { config as MSSQLConfig } from 'mssql'

import _extendGpInvoice from './diamond/extendGpInvoice.js'
import _findTaxedPropertiesByAddress from './diamond/findTaxedPropertiesByAddress.js'
import _getAllTaxedProperties from './diamond/getAllTaxedProperties.js'
import _getCashReceiptByDocumentNumber from './diamond/getCashReceiptByDocumentNumber.js'
import _getTaxedPropertyAssessmentsByRollNumber from './diamond/getTaxedPropertyAssessmentsByRollNumber.js'
import _getTaxedPropertyByRollNumber from './diamond/getTaxedPropertyByRollNumber.js'
import _getTaxedPropertyOwnersByRollNumber from './diamond/getTaxedPropertyOwnersByRollNumber.js'
import type {
  DiamondCashReceipt,
  DiamondExtendedGPInvoice,
  DiamondTaxedProperty,
  DiamondTaxedPropertyAssessment,
  DiamondTaxedPropertyOwner
} from './diamond/types.js'
import _getAccountByAccountIndex from './gp/getAccountByAccountIndex.js'
import _getCustomerByCustomerNumber from './gp/getCustomerByCustomerNumber.js'
import _getInvoiceByInvoiceNumber from './gp/getInvoiceByInvoiceNumber.js'
import _getInvoiceDocumentTypes from './gp/getInvoiceDocumentTypes.js'
import _getItemByItemNumber from './gp/getItemByItemNumber.js'
import _getItemsByLocationCodes from './gp/getItemsByLocationCodes.js'
import _getVendors, { type GetVendorsFilters } from './gp/getVendors.js'
import _testConnection from './gp/testConnection.js'
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
  readonly #accountCache: NodeCache<GPAccount | undefined>
  readonly #customerCache: NodeCache<GPCustomer | undefined>
  readonly #diamondCashReceiptCache: NodeCache<DiamondCashReceipt | undefined>
  readonly #diamondInvoiceCache: NodeCache<DiamondExtendedGPInvoice | undefined>
  readonly #diamondTaxedPropertyCache: NodeCache<
    DiamondTaxedProperty | undefined
  >

  readonly #invoiceCache: NodeCache<GPInvoice | undefined>
  #invoiceDocumentTypesCache: GPInvoiceDocumentType[] = []
  #invoiceDocumentTypesCacheExpiryMillis = 0

  readonly #itemCache: NodeCache<GPItemWithQuantities | undefined>

  readonly #mssqlConfig: MSSQLConfig
  readonly #options: DynamicsGPOptions

  readonly #vendorCache: NodeCache<GPVendor | undefined>

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

    this.#diamondTaxedPropertyCache = new NodeCache({
      stdTTL: this.#options.documentCacheTTL
    })
  }

  clearCaches(): void {
    this.#accountCache.flushAll()
    this.#customerCache.flushAll()
    this.#invoiceCache.flushAll()
    this.#itemCache.flushAll()
    this.#vendorCache.flushAll()

    this.#invoiceDocumentTypesCache = []
    this.#invoiceDocumentTypesCacheExpiryMillis = 0

    this.#diamondCashReceiptCache.flushAll()
    this.#diamondInvoiceCache.flushAll()
    this.#diamondTaxedPropertyCache.flushAll()
  }

  async findDiamondTaxedPropertiesByAddress(
    address: {
      civicNumber: string
      streetName: string
      unitNumberOrQualifier?: string
    },
    exactMatch = false
  ): Promise<DiamondTaxedProperty[]> {
    return await _findTaxedPropertiesByAddress(
      this.#mssqlConfig,
      address,
      exactMatch
    )
  }

  async getAccountByAccountIndex(
    accountIndex: number | string
  ): Promise<GPAccount | undefined> {
    let account = this.#accountCache.get(accountIndex) ?? undefined

    if (account === undefined) {
      account = await _getAccountByAccountIndex(this.#mssqlConfig, accountIndex)
      this.#accountCache.set(accountIndex, account)
    }

    return account
  }

  async getAllDiamondTaxedProperties(
    limit = -1,
    offset = 0
  ): Promise<DiamondTaxedProperty[]> {
    return await _getAllTaxedProperties(this.#mssqlConfig, limit, offset)
  }

  async getCustomerByCustomerNumber(
    customerNumber: string
  ): Promise<GPCustomer | undefined> {
    let customer = this.#customerCache.get(customerNumber) ?? undefined

    if (customer === undefined) {
      customer = await _getCustomerByCustomerNumber(
        this.#mssqlConfig,
        customerNumber
      )
      this.#customerCache.set(customerNumber, customer)
    }

    return customer
  }

  async getDiamondCashReceiptByDocumentNumber(
    documentNumber: number | string
  ): Promise<DiamondCashReceipt | undefined> {
    let receipt = this.#diamondCashReceiptCache.get(documentNumber)

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

    let diamondInvoice = this.#diamondInvoiceCache.get(cacheKey) ?? undefined

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

  async getDiamondTaxedPropertyAssessmentsByRollNumber(
    rollNumber: string
  ): Promise<DiamondTaxedPropertyAssessment[]> {
    return await _getTaxedPropertyAssessmentsByRollNumber(
      this.#mssqlConfig,
      rollNumber
    )
  }

  async getDiamondTaxedPropertyByRollNumber(
    rollNumber: string
  ): Promise<DiamondTaxedProperty | undefined> {
    let taxedProperty = this.#diamondTaxedPropertyCache.get(rollNumber)

    if (taxedProperty === undefined) {
      taxedProperty = await _getTaxedPropertyByRollNumber(
        this.#mssqlConfig,
        rollNumber
      )

      this.#diamondTaxedPropertyCache.set(rollNumber, taxedProperty)
    }

    return taxedProperty
  }

  async getDiamondTaxedPropertyOwnersByRollNumber(
    rollNumber: string
  ): Promise<DiamondTaxedPropertyOwner[]> {
    return await _getTaxedPropertyOwnersByRollNumber(
      this.#mssqlConfig,
      rollNumber
    )
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
    let item = this.#itemCache.get(itemNumber) ?? undefined

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
    let vendor = this.#vendorCache.get(vendorId) ?? undefined

    if (vendor === undefined) {
      const vendors = await this.getVendors({ vendorId })
      vendor = vendors.length > 0 ? vendors[0] : undefined
      this.#vendorCache.set(vendorId, vendor)
    }

    return vendor
  }

  async getVendors(
    vendorFilters?: Partial<GetVendorsFilters>
  ): Promise<GPVendor[]> {
    return await _getVendors(this.#mssqlConfig, vendorFilters ?? {})
  }

  async testConnection(): Promise<boolean> {
    return await _testConnection(this.#mssqlConfig)
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

    let invoice = this.#invoiceCache.get(cacheKey) ?? undefined

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
}

export type {
  DiamondCashReceipt,
  DiamondExtendedGPInvoice,
  DiamondTaxedProperty,
  DiamondTaxedPropertyAssessment,
  DiamondTaxedPropertyOwner
} from './diamond/types.js'

export type { GetVendorsFilters } from './gp/getVendors.js'

export type {
  GPAccount,
  GPCustomer,
  GPInvoice,
  GPInvoiceDocumentType,
  GPItemWithQuantities,
  GPItemWithQuantity,
  GPVendor
} from './gp/types.js'
