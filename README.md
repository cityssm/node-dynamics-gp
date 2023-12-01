# Node Dynamics GP

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/dynamics-gp)](https://www.npmjs.com/package/@cityssm/dynamics-gp)
[![Maintainability](https://api.codeclimate.com/v1/badges/b850568e64485c966d4a/maintainability)](https://codeclimate.com/github/cityssm/node-dynamics-gp/maintainability)
[![codecov](https://codecov.io/gh/cityssm/node-dynamics-gp/branch/main/graph/badge.svg?token=K2D0W6D1LN)](https://codecov.io/gh/cityssm/node-dynamics-gp)
[![Build Status](https://github.com/cityssm/node-dynamics-gp/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/node-dynamics-gp/actions/workflows/coverage.yml)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-dynamics-gp.svg/?label=active+issues&show_trend=true&token=8upUaCFLWbSvxfWIhbeiD2_E)](https://app.deepsource.com/gh/cityssm/node-dynamics-gp/)

_Read only inquiries into Microsoft Dynamics GP using a SQL Server connection._

The purpose of this project to make it easy to incorporate **on prem** Dynamics GP data
into custom business applications. It connects to the underlying SQL Server directly,
and returns data in easy-to-use Javascript objects.

Built to validate transactions linked from the City of Sault Ste. Marie's
[Lot Occupancy System](https://github.com/cityssm/lot-occupancy-system).

_Tested with Microsoft Dynamics GP 2018._

## Features

- 🙌 **TypeScript types.** Easy to get started.

- 🙌 **Temporary caching** to reduce database hits and function return times.

- 🙌 **All whitespace trimmed** from the end of the `char` data. Strings are ready to use!

- 🙌 **Consistent and clear field names.** For example:
  - `PRIMVNDR` becomes `primaryVendorId`
  - `PHNUMBR2` becomes `phoneNumber2`
  - `PHONE3` becomes `phoneNumber3`

### Good Use Cases

- ✔️ Validating a corresponding receipt number was properly entered.

- ✔️ Displaying the status of an outstanding invoice in a business application.

- ✔️ Populating contact fields based on customer information.

### Not So Good Use Cases

- ❌ Reporting on all of the inventory items at a specific location.
  _Use a SmartList instead._

- ❌ Modifying Dynamics GP data.
  _Use Dynamics GP._

## Installation

```sh
npm install @cityssm/dynamics-gp
```

## Dynamics GP Functions

```javascript
import { DynamicsGP } from '@cityssm/dynamics-gp'

const gp = new DynamicsGP(mssqlConfig)

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
const cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber('123456')

const invoice = await gp.getDiamondExtendedInvoiceByInvoiceNumber(invoiceNumber)
```

## Contributions

Is a field you need missing? An entire table?
[Create an issue](https://github.com/cityssm/node-dynamics-gp/issues) with your request,
or better yet, [submit a pull request](https://github.com/cityssm/node-dynamics-gp/pulls)
implementing the feature you need!
