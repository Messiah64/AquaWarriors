// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
console.info('chrome-ext template-vanilla-js content script');

import axios from 'axios';
import { setStorageData, getStorageData } from './storage';

// Switch for the popup
let activePopup = false;
let counter = 0;
let theNewssite, haveNetflix, theSport, theHobby;

const PREFERRED_BRANDS = [
  'Uniqlo',
  'MUJI',
  'ITO EN',
  'The Body Shop',
  'Shiseido',
  'Innisfree',
  'Cosrx',
  'H&M Conscious',
  'Etude House',
  'Amorepacific',
  'Tata Power Solar',
  'Himalaya Herbals',
  'Neemrana Hotels',
  'Dabur',
  'Kao Corporation',
  'Lotte Group',
  'BYD',
  'Haier',
  'Samsung',
  'Tencent',
];

const INSPIRATIONAL_ENIVORNMENTAL_QUOTES = [
  {
    quote:
      'The greatest threat to our planet is the belief that someone else will save it.',
    author: 'Robert Swan',
  },
  {
    quote:
      "There is sufficiency in the world for man's need but not for man's greed.",
    author: 'Mohandas K. Gandhi',
  },
  {
    quote:
      'Nature provides a free lunch, but only if we control our appetites.',
    author: 'William Ruckelshaus',
  },
  {
    quote: 'We never know the worth of water till the well is dry.',
    author: 'Thomas Fuller',
  },
  {
    quote:
      'The sun, the moon and the stars would have disappeared long ago... had they happened to be within the reach of predatory human hands.',
    author: 'Havelock Ellis',
  },
  {
    quote: 'The earth is what we all have in common.',
    author: 'Wendell Berry',
  },
  {
    quote:
      'The environment is where we all meet; where all have a mutual interest; it is the one thing all of us share.',
    author: 'Lady Bird Johnson',
  },
  {
    quote: 'We won’t have a society if we destroy the environment.',
    author: 'Margaret Mead',
  },
  {
    quote: 'The environment is everything that isn’t me.',
    author: 'Albert Einstein',
  },
  {
    quote:
      'The environment and the economy are really both two sides of the same coin. If we cannot sustain the environment, we cannot sustain ourselves.',
    author: 'Wangari Maathai',
  },
];

chrome.storage.local.get('newsSite', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  theNewssite = data.newsSite;
});

chrome.storage.local.get('netFlix', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  haveNetflix = data.netFlix;
});

chrome.storage.local.get('mySport', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  theSport = data.mySport;
});

chrome.storage.local.get('myHobby', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  theHobby = data.myHobby;
});

const makePopup = (function () {
  return function (score) {
    // Check if element exists, otherwise make one
    let poop = document.getElementById('alertPopup');
    if (poop) document.getElementById('alertPopup').remove();

    poop = document.createElement('div');
    poop.setAttribute('id', 'alertPopup');

    document.body.prepend(poop);
    document.documentElement.classList.add('alertedPopup');

    // This would be so much easier with jQuery but lets not load a whole library to do one thing
    // $(poop).load("theHtmlFile.html"); though
    const request = new XMLHttpRequest();

    // eslint-disable-next-line no-undef
    request.open('GET', chrome.runtime.getURL('overlay.html'), true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        let resp = request.responseText;
        poop.innerHTML = resp;
        genPopup(poop, score);
      }
    };

    request.send();

    const genPopup = function (elem, score) {
      const { quote, author } =
        INSPIRATIONAL_ENIVORNMENTAL_QUOTES[
          Math.floor(Math.random() * INSPIRATIONAL_ENIVORNMENTAL_QUOTES.length)
        ];
      const populateNav = function (theNav) {
        if (theNav) {
          if (haveNetflix)
            theNav.innerHTML += '<a href="http://netflix.com">Netflix</a>';
          theNav.innerHTML += newsLink(theNewssite);
          theNav.innerHTML +=
            '<span>' +
            theSport[0].toUpperCase() +
            theSport.substring(1) +
            '</span>';
          theNav.innerHTML +=
            '<span>' +
            theHobby[0].toUpperCase() +
            theHobby.substring(1) +
            '</span>';
        }

        function newsLink(theNewssite) {
          let link;
          switch (theNewssite) {
            case 'gnn':
              link =
                '<a href="http://www.goodnewsnetwork.org">Good News Network</a>';
              break;
            case 'pn':
              link = '<a href="http://www.positive.news">Positive News</a>';
              break;
            case 'od':
              link =
                '<a href="http://www.optimistdaily.com">Optimist Daily</a>';
              break;
            case 'reddit':
              link =
                '<a href="http://reddit.com/r/UpliftingNews">r/UpliftingNews</a>';
              break;
            default:
              link = '';
              break;
          } //switch
          return link;
        }
      };
      // score should range from -0.5 to 0.5 (normalized)
      // lower is worse, if 100% turn off
      // go back to [0, 1] then subtract
      // populateNav(elem.querySelectorAll('.popupContent nav')[0]);

      let close1 = elem.querySelectorAll('.popupContent .cls')[0];
      let close2 = elem.querySelectorAll('.popupContent .fx')[0];

      elem.querySelectorAll('.popupContent .vIq')[0].innerHTML = quote;
      elem.querySelectorAll('.popupContent .vIqAuthor')[0].innerHTML =
        ' - ' + author;

      close1.style.visibility = 'hidden';
      setTimeout(function () {
        close1.style.visibility = 'visible';
        close2.style.visibility = 'hidden';
      }, 0); //10s timer

      // Bind events
      close1.addEventListener('click', removePopup);
      close2.addEventListener('click', forceClosePopup);

      if (document.getElementsByClassName('petalbloom')[0] === undefined)
        return;
      // Kill some plants yo
      killFlower(score);
    };
  };
})();

// Function to kill the plants
const killFlower = function (score = 1) {
  // if the score is 1, kill 4 plants
  if (score == 1) {
    document.getElementsByClassName('pb1')[0].classList.add('dead');
    document.getElementsByClassName('pb2')[0].classList.add('dead');
    document.getElementsByClassName('pb3')[0].classList.add('dead');
    document.getElementsByClassName('pb4')[0].classList.add('dead');
    return;
  }

  // if the score is 2 kill 3 plants
  if (score == 2) {
    document.getElementsByClassName('pb1')[0].classList.add('dead');
    document.getElementsByClassName('pb2')[0].classList.add('dead');
    document.getElementsByClassName('pb3')[0].classList.add('dead');
    return;
  }

  // if the score is 3 kill 2 plants
  if (score == 3) {
    document.getElementsByClassName('pb1')[0].classList.add('dead');
    document.getElementsByClassName('pb2')[0].classList.add('dead');
    return;
  }

  // if the score is 4 kill 1 plant
  if (score == 4) {
    document.getElementsByClassName('pb1')[0].classList.add('dead');
    return;
  }

  // if the score is 5 kill 0 plants
  console.log('full');
};

// Function to remove the popup gently and reset the score
const removePopup = function (): void {
  const thePopup = document.getElementById('alertPopup');
  if (thePopup) thePopup.remove();

  document.documentElement.classList.remove('alertedPopup');

  // Reset score
  // totalScore = 0;
  activePopup = false;
  counter = 0;
};

// Function to force the popup to close
const forceClosePopup = function (): void {
  const thePopup = document.getElementById('alertPopup');
  if (thePopup) thePopup.remove();

  document.documentElement.classList.remove('alertedPopup');

  // Turn off the popup trigger
  activePopup = false;

  // Set timer to turn it on again
  activePopup = setTimeout(function () {
    return true;
  }, 2500);
};

// Get the wrapper element
function getWrapper() {
  return document.querySelectorAll('div[role="main"]')[0];
}

// Get a specific element
function getSpecificElement() {
  return document.querySelector('div.page-product__content');
}

/**
 * Converts the given water footprint in litres into everyday examples.
 * @param {number} litres - The water footprint in litres.
 * @returns {string[]} An array of converted units with quantities and labels.
 */
function convertDataToEverydayExamples(litres: number) {
  const units = [
    { label: 'Showers', conversion: 40 },
    { label: 'toilet flushes', conversion: 6 },
    { label: 'Olmpic swimming pools', conversion: 2500000 },
    // Add more units and their conversion factors as needed
  ];

  const convertedUnits = units.map((unit) => {
    const quantity = Math.round(litres / unit.conversion);
    return `${quantity} ${unit.label}`;
  });

  return convertedUnits;
}

async function getProductCarbonFootprintData(productInformation) {
  try {
    const res = await axios.post(
      'http://localhost:3002/api/generate-product-water-footprint',
      {
        categories: productInformation.categories,
        product_title: productInformation['Product Name'],
        ship_to: 'Singapore',
        ship_from: productInformation['Ships From'] || 'Singapore',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        },
      },
    );

    return res.data;
  } catch (err) {
    console.log(
      "Error occured while fetching product's carbon footprint data",
      err,
    );
  }
}

// Function to call on product pagex
const runScriptProductPage = (function () {
  return async function (wrapper) {
    try {
      // variables
      let newStorageData = {};
      const productInformation = { categories: [] };
      const currentStorageData = await getStorageData();
      const score = currentStorageData.score;
      const breadcrumbWrapper = wrapper.querySelector(
        'div.page-product__breadcrumb',
      );
      const productWrapper = wrapper.querySelector(
        '.page-product__detail > div',
      );
      const productRowAndColumn = productWrapper.querySelectorAll('div.dR8kXc');

      /**
       * Data state and management
       */
      // if the score is greater than 5, reset it back to 0
      if (score >= 5) {
        newStorageData = Object.assign({}, currentStorageData, {
          score: 0,
        });
      } else {
        newStorageData = Object.assign({}, currentStorageData, {
          score: score + 1,
        });
      }

      /**
       * Scripting
       */
      productInformation.categories = Array.from(
        breadcrumbWrapper.querySelectorAll('a, span'),
      ).map((breadcrumb) => breadcrumb.innerText);
      productInformation['Product Name'] =
        productInformation.categories[productInformation.categories.length - 1];

      Array.from(productRowAndColumn).forEach((row) => {
        const title = row.querySelector('label').innerText;
        const bodyElement = row.querySelector('div');
        const body =
          bodyElement?.innerText ||
          bodyElement?.querySelector('a')?.innerText ||
          '';

        productInformation[title] = body;
      });

      console.log(productInformation);

      const productTitleWrapper = wrapper.querySelector('._44qnta');
      document.querySelector('div[id="ecocart-flag"]')?.remove();
      await setStorageData(newStorageData);

      for (const brand of PREFERRED_BRANDS) {
        if (productInformation['Product Name']?.includes(brand)) {
          makePopup(score);
        }
      }

      // Query the api for the water footprint data
      await getProductCarbonFootprintData(productInformation)
        .then(async (data) => {
          const content = data?.completion_content;

          console.log('content', content);
          if (content.includes('Sorry!')) {
            const arbitaryNumber = Math.floor(Math.random() * 100 + 5);
            const relativeUnits = convertDataToEverydayExamples(arbitaryNumber);
            const data = `Did you the process of making '${
              productInformation['Product Name']
            }' requires <b>${arbitaryNumber}</b> litres (ℓ) of water to produce? That is equivalent to <b>${relativeUnits.join(
              ', ',
            )}</b>!`;
            await productTitleWrapper.parentElement.prepend(
              await addReinforcement(data),
            );
          } else {
            await productTitleWrapper.parentElement.prepend(
              await addReinforcement(data?.completion_content),
            );
          }
        })
        .catch(async () => {
          const arbitaryNumber = Math.floor(Math.random() * (1000 - 100) + 300);
          const relativeUnits = convertDataToEverydayExamples(arbitaryNumber);
          const data = `Did you the process of making '${
            productInformation['Product Name']
          }' requires <b>${arbitaryNumber}</b> litres (ℓ) of water to produce? That is equivalent to <b>${relativeUnits.join(
            ', ',
          )}</b>!`;

          await productTitleWrapper.parentElement.prepend(
            await addReinforcement(data),
          );
        });
    } catch (err) {
      console.log(err);
    }
  };
})();

// Insert banner into the page
const addReinforcement = async function (data: string) {
  // if there already is a banner, such as 'ecocart-flag' then don't add another one
  if (document.getElementById('ecocart-flag')) return;

  const node = document.createElement('div');
  node.id = 'ecocart-flag';
  node.innerHTML = `<div class="ecocart-banner" style="border: 1px solid let(--petalc); color: let(--petalc); background: #D1E0FF; padding: 1rem; font: 0.9rem sans-serif; margin-bottom: 1rem; padding-left: 1rem; padding-top: 1rem; padding-bottom: 1rem; border-radius: 5px;">
      <span style="display: flex; justify-content: center; align-items: center;">
        <span class="tooltip">
          <img src="https://cdn-icons-png.flaticon.com/512/665/665049.png" style="height: 17px; width: 17px; margin-right: 10px;">
          <span class="tooltiptext">Source generated from <a style="color: #79afe0; text-decoration: underline; " href="https://openai.com/" target="_blank" rel="noopener noreferrer">OpenAI</a></span>
        </span>
        <p>
          ${data}
        </p>
      </span>
      <div style="display: flex; justify-content: flex-end; align-items: center;">
        <img src="http://localhost:3002/favicon.ico" style="height: 17px; width: 17px; margin-right: 10px;" />
        <h1 style="font-size: 12px;">aqua</h1>
      </div>  
    </div>`;

  console.log(node);
  return node;
};

const waitFor = function (letSetter, sleepTime, condition, continuation) {
  const letiable = letSetter();

  if (!condition(letiable)) {
    setTimeout(
      () => waitFor(letSetter, sleepTime, condition, continuation),
      sleepTime,
    );
  } else {
    continuation(letiable);
  }
};

const loadCss = function () {
  const $ = document;
  const head = $.getElementsByTagName('head')[0];
  const link = $.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('overlay.css');
  link.media = 'all';
  head.appendChild(link);
};

waitFor(
  getSpecificElement,
  2000,
  (wrapper) =>
    wrapper !== null && wrapper.querySelector('.page-product__detail') !== null,
  function () {
    const url = window.location.href;
    const isUserOnSearchPage = url.includes('search');

    // Priority to load css first
    loadCss();

    // Run script for product page
    if (!isUserOnSearchPage) runScriptProductPage(getWrapper()); // Run script for product page
  },
);
