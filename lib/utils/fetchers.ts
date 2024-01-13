import { z } from "zod";
import { createZodFetcher } from "zod-fetch";

const Nip05Schema = z.object({
  names: z.object({}),
});

const fetchWithZod = createZodFetcher();
export async function getPubkeyFromNip05(nip05: string) {
  const [name, domain] = nip05.split("@");
  if (name === undefined || domain === undefined)
    throw new Error("Unable to fetch");

  const apiResponse = await fetchWithZod(
    // The schema you want to validate with
    Nip05Schema,
    // Any parameters you would usually pass to fetch
    ``,
    {
      method: "GET",
    },
  ).then((res) => res);
}
