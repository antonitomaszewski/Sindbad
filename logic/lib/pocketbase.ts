import PocketBase from 'pocketbase';
// poprostu zainicjowanie bazy pocketbase

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090'
);

pb.autoCancellation(false);

export default pb;

// do odpalania w terminalu w node i prób
// const { default: PocketBase } = await import("pocketbase");
// const pb = new PocketBase('http://127.0.0.1:8090');
