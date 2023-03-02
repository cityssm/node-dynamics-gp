# Node Dynamics GP

_Read only inquiries into Microsoft Dynamics GP._

The purpose of this project to make it easy to incorporate Dynamics GP data
into custom applications.  It connects to the underlying SQL Server directly,
and returns data in easy-to-use Javascript objects.

## Installation

    npm install @cityssm/dynamics-gp

## Dynamics GP Functions

```javascript
import * as gp from '@cityssm/dynamics-gp'

gp.setMSSQLConfig(mssqlConfig)
```


## Diamond-Specific GP Functions

The functions below query Dynamics GP tables with extensions from
[Diamond Municipal Solutions](https://diamondmunicipal.com/).

```javascript
import * as diamond from '@cityssm/dynamics-gp/diamond.js'

diamond.setMSSQLConfig(mssqlConfig)

const cashReceipt = await diamond.getCashReceiptByDocumentNumber(123456)
```
