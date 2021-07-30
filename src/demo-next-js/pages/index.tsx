import Head from 'next/head';

import { ProductsPure } from '../components/Products';
import config from '../config';
import { products } from '../data';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Tezos Payments Demo Shop</title>
        <meta name="description" content="This is a demo shop of Tezos Payments" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          This is a demo shop of <a href={config.mainSiteUrl} target="_blank" rel="noopener noreferrer">Tezos Payments</a>
        </h1>

        <ProductsPure products={products}></ProductsPure>
      </main>
    </>
  );
}
