import algoliasearch from "algoliasearch";

const algoliaConfig = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
};
export type AlgoliaVideoResponse = {
  readonly objectID: string;
  readonly _highlightResult?: {} | undefined;
  readonly _snippetResult?: {} | undefined;
  readonly _distinctSeqID?: number | undefined;
  identifier: string;
  title: string;
  summary?: string;
  thumbnail?: string;
  kind: number;
  pubkey: string;
  published_at: number;
}[];

type AlgoliaResponse = {
  hits: { [key: string]: string }[];
  page: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
  index: string;
};
export type SearchSuggestionObject = {
  index: string;
  hits: {
    identifier: string;
    title: string;
    summary?: string;
    thumbnail?: string;
    kind: number;
    pubkey: string;
    published_at: number;
  }[];
};
const useSearch = () => {
  const client = algoliasearch(algoliaConfig.appId, algoliaConfig.searchApiKey);
  const search = async (input: string) => {
    if (!input) return;
    try {
      const queries = [
        {
          indexName: "Videos",
          query: input,
          params: {
            hitsPerPage: 10,
          },
        },
      ];
      const { results } = await client.multipleQueries(queries);
      return results as unknown as AlgoliaResponse[];
    } catch (error) {
      console.log("Algolia Error", error);
    }
  };
  const videoSearch = async (input: string) => {
    if (!input) return;
    try {
      const index = client.initIndex("Videos");
      const { hits } = await index.search(input, {});

      return hits as unknown as AlgoliaVideoResponse;
    } catch (error) {
      console.log("Algolia Error", error);
    }
  };

  return { search, videoSearch };
};

export default useSearch;
