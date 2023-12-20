import algoliasearch from "algoliasearch";

const algoliaConfig = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
};
type AlgoliaResponse = {
  hits: { [key: string]: string }[];
  page: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
  index: string;
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

  return { search };
};

export default useSearch;
