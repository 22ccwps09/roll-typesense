import jQuery from 'jquery';
import { debounce } from 'lodash';

window.$ = jQuery; // workaround for https://github.com/parcel-bundler/parcel/issues/333

import 'popper.js';
import 'bootstrap';
import instantsearch from 'instantsearch.js/es';
import {
  searchBox,
  pagination,
  refinementList,
  hits,
  stats,
  sortBy,
  hierarchicalMenu,
  rangeSlider,
  ratingMenu,
  toggleRefinement,
  hitsPerPage,
  clearRefinements,
  breadcrumb,
} from 'instantsearch.js/es/widgets';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

let TYPESENSE_SERVER_CONFIG = {
  apiKey: process.env.TYPESENSE_SEARCH_ONLY_API_KEY, // Be sure to use an API key that only allows searches, in production
  nodes: [
    {
      host: process.env.TYPESENSE_HOST,
      port: process.env.TYPESENSE_PORT,
      protocol: process.env.TYPESENSE_PROTOCOL,
    },
  ],
  numRetries: 8,
};

// [2, 3].forEach(i => {
//   if (process.env[`TYPESENSE_HOST_${i}`]) {
//     TYPESENSE_SERVER_CONFIG.nodes.push({
//       host: process.env[`TYPESENSE_HOST_${i}`],
//       port: process.env.TYPESENSE_PORT,
//       protocol: process.env.TYPESENSE_PROTOCOL,
//     });
//   }
// });

// Unfortunately, dynamic process.env keys don't work with parcel.js
// So need to enumerate each key one by one

if (process.env[`TYPESENSE_HOST_2`]) {
  TYPESENSE_SERVER_CONFIG.nodes.push({
    host: process.env[`TYPESENSE_HOST_2`],
    port: process.env.TYPESENSE_PORT,
    protocol: process.env.TYPESENSE_PROTOCOL,
  });
}

if (process.env[`TYPESENSE_HOST_3`]) {
  TYPESENSE_SERVER_CONFIG.nodes.push({
    host: process.env[`TYPESENSE_HOST_3`],
    port: process.env.TYPESENSE_PORT,
    protocol: process.env.TYPESENSE_PROTOCOL,
  });
}

if (process.env[`TYPESENSE_HOST_NEAREST`]) {
  TYPESENSE_SERVER_CONFIG['nearestNode'] = {
    host: process.env[`TYPESENSE_HOST_NEAREST`],
    port: process.env.TYPESENSE_PORT,
    protocol: process.env.TYPESENSE_PROTOCOL,
  };
}

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: TYPESENSE_SERVER_CONFIG,
  additionalSearchParameters: {
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  queryBy is required.
    queryBy: 'description', 
    numTypos: 1,
    typoTokensThreshold: 0,
    // groupLimit: 1
    // pinnedHits: "23:2"
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
const search = instantsearch({
  searchClient,
  indexName: 'items',
  routing: true,
});

// ============ Begin Widget Configuration
search.addWidgets([
  searchBox({
    container: '#searchbox',
    showSubmit: false,
    showReset: false,
    placeholder: 'Search for items... ',
    autofocus: false,
    cssClasses: {
      input: 'form-control form-control-sm border border-light text-dark',
      loadingIcon: 'stroke-primary',
    },
  }),
  pagination({
    container: '#pagination',
    cssClasses: {
      list: 'd-flex flex-row justify-content-end',
      item: 'px-2 d-block',
      link: 'text-decoration-none',
      disabledItem: 'text-muted',
      selectedItem: 'font-weight-bold text-primary',
    },
  }),
  refinementList({
    limit: 10,
    showMoreLimit: 50,
    container: '#acquisition-transfer',
    attribute: 'acquisition_transfer',
    searchable: false,
    searchablePlaceholder: 'Search brands',
    showMore: false,
    sortBy: [],
    cssClasses: {
      searchableInput:
        'form-control form-control-sm form-control-secondary mb-2 border-light-2',
      searchableSubmit: 'd-none',
      searchableReset: 'd-none',
      showMore: 'btn btn-secondary btn-sm',
      list: 'list-unstyled',
      count: 'badge text-dark-2 ml-2',
      label: 'd-flex align-items-center',
      checkbox: 'mr-2',
    },    
  }),   
  refinementList({
    limit: 10,
    showMoreLimit: 50,
    container: '#media-type',
    attribute: 'media_type',
    searchable: false,
    searchablePlaceholder: 'Search brands',
    showMore: false,
    sortBy: [],
    cssClasses: {
      searchableInput:
        'form-control form-control-sm form-control-secondary mb-2 border-light-2',
      searchableSubmit: 'd-none',
      searchableReset: 'd-none',
      showMore: 'btn btn-secondary btn-sm',
      list: 'list-unstyled',
      count: 'badge text-dark-2 ml-2',
      label: 'd-flex align-items-center',
      checkbox: 'mr-2',
    },    
  }), 
  refinementList({
    limit: 10,
    showMoreLimit: 50,
    container: '#source-list',
    attribute: 'sources',
    searchable: false,
    searchablePlaceholder: 'Search brands',
    showMore: true,
    sortBy: [],
    cssClasses: {
      searchableInput:
        'form-control form-control-sm form-control-secondary mb-2 border-light-2',
      searchableSubmit: 'd-none',
      searchableReset: 'd-none',
      showMore: 'btn btn-secondary btn-sm',
      list: 'list-unstyled',
      count: 'badge text-dark-2 ml-2',
      label: 'd-flex align-items-center',
      checkbox: 'mr-2',
    },
  }),
  refinementList({
    limit: 10,
    showMoreLimit: 50,
    container: '#venues-list',
    attribute: 'venues',
    searchable: true,
    searchablePlaceholder: 'Search venues',
    showMore: true,
    sortBy: [],
    cssClasses: {
      searchableInput:
        'form-control form-control-sm form-control-secondary mb-2 border-light-2',
      searchableSubmit: 'd-none',
      searchableReset: 'd-none',
      showMore: 'btn btn-secondary btn-sm',
      list: 'list-unstyled',
      count: 'badge text-dark-2 ml-2',
      label: 'd-flex align-items-center',
      checkbox: 'mr-2',
    },
  }),
  refinementList({
    limit: 10,
    showMoreLimit: 50,
    container: '#creators-list',
    attribute: 'creators',
    searchable: false,
    searchablePlaceholder: 'Search creators',
    showMore: true,
    sortBy: [],
    cssClasses: {
      searchableInput:
        'form-control form-control-sm form-control-secondary mb-2 border-light-2',
      searchableSubmit: 'd-none',
      searchableReset: 'd-none',
      showMore: 'btn btn-secondary btn-sm',
      list: 'list-unstyled',
      count: 'badge text-dark-2 ml-2',
      label: 'd-flex align-items-center',
      checkbox: 'mr-2',
    },
  }),  
  refinementList({
    limit: 10,
    showMoreLimit: 50,
    container: '#subjects-list',
    attribute: 'subjects',
    searchable: false,
    searchablePlaceholder: 'Search Subjects(Sires)',
    showMore: true,
    sortBy: [],
    cssClasses: {
      searchableInput:
        'form-control form-control-sm form-control-secondary mb-2 border-light-2',
      searchableSubmit: 'd-none',
      searchableReset: 'd-none',
      showMore: 'btn btn-secondary btn-sm',
      list: 'list-unstyled',
      count: 'badge text-dark-2 ml-2',
      label: 'd-flex align-items-center',
      checkbox: 'mr-2',
    },
  }), 
/*  hierarchicalMenu({
    container: '#categories-hierarchical-menu',
    showParentLevel: true,
    rootPath: 'Cell Phones',
    attributes: [
      'categories.lvl0',
      'categories.lvl1',
      'categories.lvl2',
      'categories.lvl3',
    ],
    cssClasses: {
      showMore: 'btn btn-secondary btn-sm',
      list: 'list-unstyled',
      childList: 'ml-4',
      count: 'badge text-dark-2 ml-2',
      link: 'text-dark text-decoration-none',
      selectedItem: 'text-primary font-weight-bold',
      parentItem: 'text-dark font-weight-bold',
    },
  }),*/
/*  toggleRefinement({
    container: '#toggle-refinement',
    attribute: 'acquisition_transfer',
    templates: {
      labelText: 'Free shipping',
    },
    cssClasses: {
      label: 'd-flex align-items-center',
      checkbox: 'mr-2',
    },
  }),*/
/*  rangeSlider({
    container: '#reference-range-slider',
    attribute: 'reference_code',
  }),*/
/*  ratingMenu({
    container: '#rating-menu',
    attribute: 'rating',
    cssClasses: {
      list: 'list-unstyled',
      link: 'text-decoration-none',
      starIcon: '',
      count: 'badge text-dark-2 ml-2',
      disabledItem: 'text-muted',
      selectedItem: 'font-weight-bold text-primary',
    },
  }),*/
  sortBy({
    container: '#sort-by',
    items: [
      { label: 'Relevancy', value: 'items' },
      { label: 'reference_code (asc)', value: 'items/sort/reference_code:asc' },
      { label: 'reference_code (desc)', value: 'items/sort/reference_code:desc' },
    ],
    cssClasses: {
      select: 'custom-select custom-select-sm',
    },
  }),
  hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <div class="row">
              <div class="col-md">
                  <a href="https://ccwps.org/items{{url}}"><img class="w-100" src="{{components}}" alt="{{title}}"></a> 
              </div>
          </div>
          <div class="row mt-5">
              <div class="col-md">
                  <h5>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</h5>
              </div>
          </div>
          <div class="row mt-2">
              <div class="col-md">
                {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
              </div>
          </div>
          <div class="row mt-2">
              <div class="col-md">
                {{#helpers.highlight}}{ "attribute": "shotlist" }{{/helpers.highlight}}
              </div>
          </div>
          <div class="row mt-auto">
            <div class="col-md">
              <div class="hit-price font-weight-bold mt-4">출처:{{sources}}</div>
              <div class="hit-rating font-weight-bold">장소:{{venues}}</div>
              <div class="hit-rating font-weight-bold">생산자:{{creators}}</div>
              <div class="hit-rating font-weight-bold">주제:{{subjects}}</div>
            </div>
          </div>
          <a href="https://ccwps.org/items{{url}}">[아이템 보기]</a>  
        </div>
      `,
    },
    cssClasses: {
      list: 'list-unstyled grid-container',
      item: 'd-flex flex-column search-result-card mb-1 mr-1 p-3',
      loadMore: 'btn btn-primary mx-auto d-block mt-4',
      disabledLoadMore: 'btn btn-dark mx-auto d-block mt-4',
    },
  }),
  hitsPerPage({
    container: '#hits-per-page',
    items: [
      { label: '9 per page', value: 9, default: true },
      { label: '18 per page', value: 18 },
    ],
    cssClasses: {
      select: 'custom-select custom-select-sm',
    },
  }),
  stats({
    container: '#stats',
    templates: {
      text: `
      {{#hasNoResults}}No products{{/hasNoResults}}
      {{#hasOneResult}}1 product{{/hasOneResult}}
      {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} products{{/hasManyResults}}
      found in {{processingTimeMS}}ms
    `,
    },
    cssClasses: {
      text: 'small',
    },
  }),
  clearRefinements({
    container: '#clear-refinements',
    cssClasses: {
      button: 'btn btn-primary',
    },
  }),
]);

window.sendEventDebounced = debounce((uiState) => {
  window.gtag('event', 'page_view', {
    page_path: window.location.pathname + window.location.search,
  });
  console.log('here');
}, 500);

search.use(() => ({
  onStateChange({ uiState }) {
    window.sendEventDebounced(uiState);
  },
  subscribe() {},
  unsubscribe() {},
}));

search.start();
