# Tezos Payments

[Homepage](https://tezospayments.com) &nbsp;&nbsp;•&nbsp;&nbsp;
[Dashboard](https://dashboard.tezospayments.com) &nbsp;&nbsp;•&nbsp;&nbsp;
[Demo - Payments](https://demo.tezospayments.com) &nbsp;&nbsp;•&nbsp;&nbsp;
[Demo - Donations](https://payment.tezospayments.com/KT1S394GiUh6dkA4tcM6ceb49Yhot4ToYtDb/donation?network=hangzhounet) &nbsp;&nbsp;•&nbsp;&nbsp; 
[Contracts](https://github.com/fastwaterbear/tezospayments-contracts) &nbsp;&nbsp;•&nbsp;&nbsp; 
[Statuses](#statuses)  

> ⚠️ Tezos Payments is in active development so any component (application, contract, package, API) is subject to change ⚠️

Tezos Payments is a decentralized service that allows anyone to accept payments, donations, or send invoices using all advantages of the Tezos system. To use the service you don't need to register as with traditional services, just use the existing Tezos accounts.

Tezos Payments consists of two parts: smart contracts and applications for easy interaction with these contracts. This repository contains applications and related packages, the smart contracts is located [here](https://github.com/fastwaterbear/tezospayments-contracts).

## Key Components
* **Dashboard Application**. Web application for users who accepts payments or donations. Using this app the users can interact with the services factory contract for the creation of their own service contracts. Also, the app provides analytics and operations for all user services;  
* **Payment Application**. Web application for end-users (payers). This application provides a payment form that allows the end-user to view required information of a service, send payments or a donations using the current popular wallets, and review payment data that can be stored into a blockchain.
This app is opened when end-users navigate by a payment URL generated by a service owner;
* **Service Smart Contract**. Smart contract that reflects a user service. This contract contains service metadata (service name, description, link, etc.) and the method by which end-users can send payments and donations to the service owner;
* **Services Factory Smart Contract**. Smart contract that creates service smart contracts for users.

## Repository Structure
This repository is a monorepo of all applications and packages are located in the root directory:
```
tezospayments/
├── apps/
│   ├── dashboard-react-web
│   ├── demo-shop-next-js
│   ├── landing
│   └── payment-react-web
└── packages/
    └── js/
        ├── common
        ├── react-web-core
        └── tezospayments
```

<details>
<summary><code>apps</code>. Contains all production and demo applications.</summary>

  * `dashboard-react-web`. Web application.  
    Usage: React, Ant Design, Redux Toolkit, Taquito, Beacon SDK, TypeScript;  
  
  * `demo-shop-next-js`. Demo online store showing demo payments.  
    Usage: Next.js, React, Typescript;  

  * `landing`. Simple landing page for the [tezospayments.com](https://tezospayments.com) site;  

  * `payment-react-web`. Web application.  
    Usage: React, Ant Design, Redux Toolkit, Taquito, Beacon SDK, TypeScript;  
</details>

<details>
<summary><code>packages</code>. Contains all related packages both public and internal.</summary>

  * `js`. Packages for NodeJS and browsers;  

    * `common`. Base packages for all js packages Shared code for the dashboard app and the payment app;  
    
    * `react-web-core`. Shared code for the dashboard app and the payment app;

    * `tezospayments`. Public package for generating payments on the server and client sides
</details>
    
## Run Locally

### Prerequisites
* [Node.js](https://nodejs.org) version 16.7.0 or later  
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version 7.20.3 or later  

### Install dependencies
Open the root directory of the repository and launch the following command:
```
npm install
```
After all the dependencies are installed you can launch applications.

### Dashboard Application
Don't forget install the dependencies (see above).  
Open the root directory of the repository and launch the following commands:  
```bash
# Build the common package
npm run build -w @tezospayments/common

# Start the dashboard-react-web application
npm run start -w @tezospayments/dashboard-react-web
```

### Payment Application
Don't forget install the dependencies (see above).  
Open the root directory of the repository and launch the following commands:  
```bash
# Build the common package
npm run build -w @tezospayments/common

# Start the payment-react-web application
npm run start -w @tezospayments/payment-react-web
```

## Statuses
Prod  
[![apps/dashboard-react-web](https://github.com/fastwaterbear/tezospayments/actions/workflows/dashboard-react-web-app.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/dashboard-react-web-app.yml)
[![apps/payment-react-web](https://github.com/fastwaterbear/tezospayments/actions/workflows/payment-react-web-app.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/payment-react-web-app.yml)
[![apps/landing](https://github.com/fastwaterbear/tezospayments/actions/workflows/landing-app.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/landing-app.yml)   
[![packages/js/tezospayments](https://github.com/fastwaterbear/tezospayments/actions/workflows/tezospayments-js-package.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/tezospayments-js-package.yml)
[![packages/js/common](https://github.com/fastwaterbear/tezospayments/actions/workflows/common-js-package.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/common-js-package.yml)  
[![apps/demo-shop-next-js](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-next-js-app.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-next-js-app.yml)
[![apps/demo-shop-asp-net](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-asp-net-app.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-asp-net-app.yml)  

Dev  
[![apps/dashboard-react-web](https://github.com/fastwaterbear/tezospayments/actions/workflows/dashboard-react-web-app.yml/badge.svg?branch=dev)](https://github.com/fastwaterbear/tezospayments/actions/workflows/dashboard-react-web-app.yml)
[![apps/payment-react-web](https://github.com/fastwaterbear/tezospayments/actions/workflows/payment-react-web-app.yml/badge.svg?branch=dev)](https://github.com/fastwaterbear/tezospayments/actions/workflows/payment-react-web-app.yml)
[![apps/landing](https://github.com/fastwaterbear/tezospayments/actions/workflows/landing-app.yml/badge.svg?branch=dev)](https://github.com/fastwaterbear/tezospayments/actions/workflows/landing-app.yml)   
[![packages/js/tezospayments](https://github.com/fastwaterbear/tezospayments/actions/workflows/tezospayments-js-package.yml/badge.svg?branch=dev)](https://github.com/fastwaterbear/tezospayments/actions/workflows/tezospayments-js-package.yml)
[![packages/js/common](https://github.com/fastwaterbear/tezospayments/actions/workflows/common-js-package.yml/badge.svg?branch=dev)](https://github.com/fastwaterbear/tezospayments/actions/workflows/common-js-package.yml)  
[![apps/demo-shop-next-js](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-next-js-app.yml/badge.svg?branch=dev)](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-next-js-app.yml)
[![apps/demo-shop-asp-net](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-asp-net-app.yml/badge.svg?branch=dev)](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-shop-asp-net-app.yml)  

## Urls

### Apps
* Homepage: https://tezospayments.com
* Dashboard: https://dashboard.tezospayments.com
* Payment: https://payment.tezospayments.com
* Demo: https://demo.tezospayments.com

### Contracts

* Services Factory 
  * Mainnet: Coming Soon
  * Hangzhounet: [KT1BLQ4tfy5iizuCSaR5D8sSDiQSemhvnAif](https://better-call.dev/hangzhou2net/KT1BLQ4tfy5iizuCSaR5D8sSDiQSemhvnAif)
