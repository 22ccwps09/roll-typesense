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
        name: "acquisition_transfer",
        type: "string",
        facet: true
      },
      {
        name: "public_access_status",
        type: "string",
        facet: false
      },          
      {
        name: "slug",
        type: "int32",
        facet: false
      },
      {
        name: "level__rg",
        type: "string",
        facet: false
      },            
      {
        name: "level__series",
        type: "string",
        facet: true
      },
      {
        name: "level__file",
        type: "string",
        facet: false
      },
      {
        name: "level__file_number",
        type: "int32",
        facet: false
      },      
      {
        name: "level__local_identifier",
        type: "string",
        facet: false
      },
      {
        name: "date",
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
        name: "subjects",
        type: "string",
        facet: true
      },      
      {
        name: "title",
        type: "string",
        facet: false
      },
      {
        name: "description",
        type: "string",
        facet: false
      },
      {
        name: "shotlist",
        type: "string",
        facet: false
      },
      {
        name: "link",
        type: "string",
        facet: false
      },
      {
        name: "components",
        type: "string",
        facet: false
      },
      {
        name: "target",
        type: "string",
        facet: false
      },                                                   
      {
        name: "media_type",
        type: "string",
        facet: true
      },
    ],
  };

  console.log("Populating index in Typesense");

  const items = require("./data/items-20220206.json");

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
