# Node Dynamics GP

_Read only inquiries into Microsoft Dynamics GP._

The purpose of this project to make it easy to incorporate Dynamics GP data
into custom business applications. It connects to the underlying SQL Server directly,
and returns data in easy-to-use Javascript objects.

## Features

- TypeScript types. Easy to get started.

- Temporary caching of lookup table data, like accounts, customers, and items
  to reduce database hits and function return times.

- All whitespace trimmed from the end of the `char` data. Strings are ready to use!

- Consistent and clear field names. For example:
  - `PRIMVNDR` becomes `primaryVendorId`
  - `PHNUMBR2` becomes `phoneNumber2`
  - `PHONE3` becomes `phoneNumber3`

## Good Use Cases

- ✔️ Validating a corresponding receipt number was properly entered.
- ✔️ Displaying the status of an outstanding invoice in a business application.

## Not So Good Use Cases

- ❌ Reporting on all of the inventory items at a specific location.
  _Use a SmartList instead._

- ❌ Modifying Dynamics GP data. _Use Dynamics GP._

## Installation

    npm install @cityssm/dynamics-gp

## Dynamics GP Functions

```javascript
import * as gp from '@cityssm/dynamics-gp'

gp.setMSSQLConfig(mssqlConfig)

const account = await gp.getAccountByAccountIndex(123)

const customer = await gp.getCustomerByCustomerNumber('CUST0001')

const invoice = await gp.getInvoiceByInvoiceNumber('INV00000002')

const item = await gp.getItemByItemNumber('01-0001-00001')

const vendor = await gp.getVendorByVendorId('VEND002')
```

## Diamond-Specific GP Functions

The functions below query Dynamics GP tables with extensions from
[Diamond Municipal Solutions](https://diamondmunicipal.com/).

```javascript
import * as diamond from '@cityssm/dynamics-gp/diamond.js'

diamond.setMSSQLConfig(mssqlConfig)

const cashReceipt = await diamond.getCashReceiptByDocumentNumber('123456')
```
