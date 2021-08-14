# Tezos Payments

[Homepage](https://tezospayments.com) &nbsp;&nbsp;•&nbsp;&nbsp;
[Dashboard](https://dashboard.tezospayments.com) &nbsp;&nbsp;•&nbsp;&nbsp;
[Demo - Payments](https://demo.tezospayments.com) &nbsp;&nbsp;•&nbsp;&nbsp;
[Demo - Donations](https://payment.tezospayments.com/KT1BhWg791Mg4x2xVrh2Zb2yjf87U275JmGW/donation) &nbsp;&nbsp;•&nbsp;&nbsp; 
[Service Factory Contract [Granadanet]](https://better-call.dev/granadanet/KT1TsixZzkALSuJhzKkyCDgyJxQCbHsGoqda)  

> ⚠️ Tezos Payments is in active development so any component (application, contract, package, API) is subject to change ⚠️

Prod  
**Coming Soon**  

Dev  
[![apps/dashboard-react-web](https://github.com/fastwaterbear/tezospayments/actions/workflows/dashboard-react-web.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/dashboard-react-web.yml)
[![apps/payment-react-web](https://github.com/fastwaterbear/tezospayments/actions/workflows/payment-react-web.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/payment-react-web.yml)
[![apps/landing](https://github.com/fastwaterbear/tezospayments/actions/workflows/landing.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/landing.yml)
[![apps/demo-next-js](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-next-js.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/demo-next-js.yml)  
[![packages/common](https://github.com/fastwaterbear/tezospayments/actions/workflows/common.yml/badge.svg?branch=master)](https://github.com/fastwaterbear/tezospayments/actions/workflows/common.yml)

Tezos Payments is a decentralized service that allows anyone to accept payments, donations, or send invoices using all advantages of the Tezos system. To use the service you don't need to register as with traditional services, just use the existing Tezos accounts.

Tezos Payments consists of two parts: smart contracts and applications for easy interaction with these contracts. This repository contains applications and related packages, the smart contracts is located [here](https://github.com/fastwaterbear/tezospayments-contracts).

## Key Components
* **Dashboard Application**. Web application for users who accepts payments or donations. Using this app the users can interact with the services factory contract for the creation of their own service contracts. Also, the app provides analytics and operations for all user services;  
* **Payment Application**. Web application for end-users (payers). This application provides a payment form that allows the end-user to view required information of a service, send payments or a donations using the current popular wallets, and review payment data that can be stored into a blockchain.
This app is opened when end-users navigate by a payment URL generated by a service owner;
* **Service Smart Contract**. Smart contract that reflects a user service. This contract contains service metadata (service name, description, link, etc.) and the method by which end-users can send payments and donations to the service owner;
* **Services Factory Smart Contract**. Smart contract that creates service smart contracts for users.

## Repository Structure
This repository is a monorepo of all applications and packages are located in the `src` directory:
```
tezospayments/
└── src/
    ├── common
    ├── dashboard-react-web
    ├── demo-next-js
    ├── landing
    └── payment-react-web
```

* `common`. Shared code for the dashboard app and the payment app;  

* `dashboard-react-web`. Web application.  
Usage: React, Ant Design, Redux Toolkit, Taquito, Beacon SDK, TypeScript;

* `demo-next-js`. Demo online store showing demo payments.  
Usage: Next.js, React, Typescript;

* `landing`. Simple landing page for the [tezospayments.com](https://tezospayments.com) site;

* `payment-react-web`. Web application.  
Usage: React, Ant Design, Redux Toolkit, Taquito, Beacon SDK, TypeScript;

## Run Locally

### Prerequisites
* [Node.js](https://nodejs.org) version 15.14.0 or later  
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version 7.7.6 or later  

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

## Urls

### Apps
* Homepage: https://tezospayments.com
* Dashboard: https://dashboard.tezospayments.com
* Payment: https://payment.tezospayments.com
* Demo: https://demo.tezospayments.com

### Contracts

* Services Factory 
  * Mainnet: Coming Soon
  * Granadanet: [KT1TsixZzkALSuJhzKkyCDgyJxQCbHsGoqda](https://better-call.dev/granadanet/KT1TsixZzkALSuJhzKkyCDgyJxQCbHsGoqda)
  * Edo2net: [KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU](https://better-call.dev/edo2net/KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU)
