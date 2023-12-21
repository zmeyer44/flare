"use server";

export async function syncViews({ naddr }: { naddr: string }) {
  return fetch(`${process.env.DB_SERVER_URL}/video-sync/${naddr}`);
}
