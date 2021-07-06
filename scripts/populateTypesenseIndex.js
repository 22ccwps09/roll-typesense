require('dotenv').config();

const Typesense = require("typesense");

module.exports = (async () => {
  // Create a client
  const typesense = new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST,
        port: process.env.TYPESENSE_PORT,
        protocol: process.env.TYPESENSE_PROTOCOL
      }
    ],
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY
  });

  const schema = {
    name: "items",
    num_documents: 0,
    fields: [
      {
        name: "reference_code",
        type: "string",
        facet: false
      },
      {
        name: "title_ko",
        type: "string",
        facet: false
      },
      {
        name: "title_en",
        type: "string",
        facet: false
      },      
      {
        name: "description_ko",
        type: "string",
        facet: false
      },
      {
        name: "description_en",
        type: "string",
        facet: false
      },      
      {
        name: "creators",
        type: "string",
        facet: true
      },
      {
        name: "sources",
        type: "string",
        facet: true
      },
      {
        name: "venues",
        type: "string",
        facet: true
      },                 
      {
        name: "media_type",
        type: "string",
        facet: true
      },
      {
        name: "public_access_status",
        type: "string",
        facet: true
      },
    ],
  };

  console.log("Populating index in Typesense");

  const items = require("./data/items.json");

  let reindexNeeded = false;
  try {
    const collection = await typesense.collections("items").retrieve();
    console.log("Found existing schema");
    // console.log(JSON.stringify(collection, null, 2));
    if (
      collection.num_documents !== items.length ||
      process.env.FORCE_REINDEX === "true"
    ) {
      console.log("Deleting existing schema");
      reindexNeeded = true;
      await typesense.collections("items").delete();
    }
  } catch (e) {
    reindexNeeded = true;
  }

  if (!reindexNeeded) {
    return true;
  }

  console.log("Creating schema: ");
  console.log(JSON.stringify(schema, null, 2));
  await typesense.collections().create(schema);

  // const collectionRetrieved = await typesense
  //   .collections("items")
  //   .retrieve();
  // console.log("Retrieving created schema: ");
  // console.log(JSON.stringify(collectionRetrieved, null, 2));

  console.log("Adding records: ");

  // Bulk Import


  try {
    const returnData = await typesense
      .collections("items")
      .documents()
      .import(items);
    console.log(returnData);
    console.log("Done indexing.");

    const failedItems = returnData.filter(item => item.success === false);
    if (failedItems.length > 0) {
      throw new Error(
        `Error indexing items ${JSON.stringify(failedItems, null, 2)}`
      );
    }

    return returnData;
  } catch (error) {
    console.log(error);
  }
})();
