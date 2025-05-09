// app.js – Complete ES‑module for Marriage Retreats Map & Table

// ---------- DATA ---------------------------------------------------------
// Array containing retreat objects with details.
export const retreats = [
    { id: 1,  name:'Cornerstone Marriage Retreat', url:'https://cornerstoneretreats.org', icon:'⛰️', tags:['mountain'], city:'Colorado Springs, CO', coords:[38.8339,-104.8214], dates:['2025-06-13/2025-06-15','2025-07-11/2025-07-13','2025-08-08/2025-08-10'], price:1295 },
    { id: 2,  name:'MountainView Couples Escape',  url:'https://mountainviewcouples.com', icon:'⛰️', tags:['mountain'], city:'Asheville, NC',           coords:[35.5951,-82.5515], dates:['2025-10-03/2025-10-05','2025-10-10/2025-10-12'],                                         price:1850 },
    { id: 3,  name:'Coastal Connection – San Diego',url:'https://coastalconnectretreat.com/sd', icon:'🏖️', tags:['beach'],    city:'San Diego, CA',          coords:[32.7157,-117.1611], dates:['2025-05-16/2025-05-18'],                                                     price:2400 },
    { id: 4,  name:'Coastal Connection – Myrtle',   url:'https://coastalconnectretreat.com/mb', icon:'🏖️', tags:['beach'],    city:'Myrtle Beach, SC',       coords:[33.6891,-78.8867],  dates:['2025-09-12/2025-09-14'],                                                     price:2400 },
    { id: 5,  name:'Heartland Marriage Encounter',  url:'https://heartlandmarriage.org',       icon:'🏠', tags:['other'],    city:'Omaha, NE',              coords:[41.2565,-95.9345],  dates:['2025-11-07/2025-11-09'],                                                     price:950  },
    { id: 6,  name:'SonScape Retreats',             url:'https://sonscaperetreats.org',        icon:'⛰️', tags:['mountain'], city:'Colorado Springs, CO',    coords:[38.8339,-104.8214], dates:['2025-07-20/2025-07-26'],                                                     price:2995 },
    { id: 7,  name:'WinShape Marriage Weekend',     url:'https://marriage.winshape.org',       icon:'⛰️', tags:['mountain'], city:'Rome, GA',                coords:[34.257,-85.1647],   dates:['2025-04-04/2025-04-06','2025-08-22/2025-08-24','2025-10-10/2025-10-12'],         price:675  },
    { id: 8,  name:'WinShape Journey Intensive',    url:'https://marriage.winshape.org/journey',icon:'⛰️', tags:['mountain'], city:'Rome, GA',                coords:[34.257,-85.1647],   dates:['2025-05-18/2025-05-22','2025-06-08/2025-06-12','2025-08-03/2025-08-07','2025-10-19/2025-10-23'], price:2750 },
    { id: 9,  name:'TVR Camp Marriage Retreat',     url:'https://tvr.org/marriage',            icon:'⛰️', tags:['mountain'], city:'Boone, NC',               coords:[35.7796,-81.9746],  dates:['2025-09-26/2025-09-28'],                                                     price:289  },
    { id:10,  name:'Joni & Friends Getaway (NC)',   url:'https://joniandfriends.org/marriage-nc', icon:'⛰️', tags:['mountain'], city:'Asheville, NC',           coords:[35.5951,-82.5515], dates:['2025-09-25/2025-09-27'],                                                     price:500  },
    { id:11,  name:'Joni & Friends Getaway (FL)',   url:'https://joniandfriends.org/marriage-fl', icon:'🏖️', tags:['beach'],    city:'St. Johns, FL',          coords:[29.8832,-81.3829],  dates:['2025-09-25/2025-09-27'],                                                     price:null },
    { id:12,  name:'Restoration Life – Devoted',    url:'https://restorationlife.org/devoted', icon:'🏖️', tags:['beach'],    city:'Carlsbad, CA',           coords:[33.1581,-117.3506], dates:['2025-10-09/2025-10-12'],                                                     price:230  },
    { id:13,  name:'LIFE Marriage Retreats',        url:'https://lifemarriageretreats.com',    icon:'🏖️', tags:['beach'],    city:'St. Augustine, FL',      coords:[29.9045,-81.3125],  dates:['2025-11-13/2025-11-17'],                                                     price:null },
    { id:14,  name:'Love Like You Mean It Cruise',  url:'https://lovelikeyoumeanitcruise.com', icon:'🛳️', tags:['cruise'],   city:'Miami, FL',              coords:[25.7781,-80.1794],  dates:['2025-02-08/2025-02-15'],                                                     price:2098 },
    { id:15,  name:'Good News Catholic Cruise',     url:'https://goodnewscruise.com',          icon:'🛳️', tags:['cruise'],   city:'Miami, FL',              coords:[25.7781,-80.1794],  dates:['2025-01-18/2025-01-25'],                                                     price:2450 },
    { id:16,  name:'Better Together Cruise',        url:'https://bettertogethermarriage.org',  icon:'🛳️', tags:['cruise'],   city:'Fort Lauderdale, FL',    coords:[26.1106,-80.1420],  dates:['2025-04-27/2025-05-04'],                                                     price:1998 },
    { id:17,  name:'Weekend to Remember – PR',      url:'https://familylife.com/retreats/sanjuan', icon:'🏖️', tags:['beach'],    city:'San Juan, PR',           coords:[18.457,-66.086],    dates:['2025-05-30/2025-06-01'],                                                     price:350  },
    { id:18,  name:'Weekend to Remember – Honolulu',url:'https://familylife.com/retreats/honolulu',icon:'🏖️', tags:['beach'],    city:'Honolulu, HI',           coords:[21.289,-157.842],   dates:['2025-11-21/2025-11-23'],                                                     price:350  },
    { id:19,  name:'Glen Eyrie Castle Retreat',     url:'https://gleneyrie.org',               icon:'🏰', tags:['castle'],   city:'Colorado Springs, CO',   coords:[38.875,-104.8656],  dates:['2025-09-12/2025-09-14'],                                                     price:849  },
    { id:20,  name:'Whitestone Inn Castle',         url:'https://whitestoneinn.com',           icon:'🏰', tags:['castle'],   city:'Kingston, TN',           coords:[35.7284,-84.6964],  dates:['2025-03-14/2025-03-16','2025-11-07/2025-11-09'],                                 price:895  },
    { id:21,  name:'Couples at The Cove',           url:'https://thecove.org',                icon:'⛰️', tags:['mountain'], city:'Asheville, NC',           coords:[35.5839,-82.492],   dates:['2025-07-25/2025-07-27'],                                                     price:599  },
    { id:22,  name:'Mediterranean Marriage Cruise', url:'https://faithfellowshiptravel.com/med-cruise', icon:'🛳️', tags:['cruise'], city:'Barcelona, Spain', coords:[41.3545,2.1022], dates:['2025-10-04/2025-10-11'],                                           price:3420 },
    { id:23,  name:'Small‑Group Marriage Cruise',   url:'https://marriagecruise.org',          icon:'🛳️', tags:['cruise'],   city:'Fort Lauderdale, FL',    coords:[26.1106,-80.1420],  dates:['2026-02-21/2026-03-01'],                                                     price:3997 }
];

// ---------- HELPERS ------------------------------------------------------

/**
 * Converts an ISO date range string (YYYY-MM-DD/YYYY-MM-DD) to a display format (e.g., "Jun 13-Jun 15").
 * @param {string} range - The ISO date range string.
 * @returns {string} The formatted date range string.
 */
export const isoRangeToDisplay = range => {
  if (!range || !range.includes('/')) return 'Date TBD'; // Handle missing or invalid range
  const [st, en] = range.split('/');
  try {
    const f = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); // Add time and specify UTC to avoid timezone issues
    return `${f(st)}-${f(en)}`;
  } catch (e) {
    console.error("Error formatting date range:", range, e);
    return 'Invalid Date';
  }
};

/**
 * Formats a price number into a currency string (e.g., $1,295) or returns 'Contact'.
 * @param {number|null} price - The price value.
 * @returns {string} The formatted price string.
 */
const formatPrice = (price) => {
  return price ? `$${price.toLocaleString()}` : 'Contact';
};

// ---------- RENDER TABLE --------------------------------------------------

/**
 * Renders the list of retreats into the HTML table.
 * @param {Array<object>} list - The array of retreat objects to render.
 */
export function renderTable(list) {
  const tbody = document.querySelector('#retreatTable tbody');
  const noResultsDiv = document.getElementById('noResults');
  if (!tbody || !noResultsDiv) return; // Ensure elements exist

  tbody.innerHTML = ''; // Clear existing rows

  if (list.length === 0) {
    noResultsDiv.style.display = 'block'; // Show 'no results' message
  } else {
    noResultsDiv.style.display = 'none'; // Hide 'no results' message
    list.forEach(r => {
      const tr = document.createElement('tr');
      // Store coordinates and ID for map interaction
      tr.dataset.coords = JSON.stringify(r.coords);
      tr.dataset.id = r.id;

      // Create table cells with retreat data
      tr.innerHTML = `
        <td>${r.icon} <a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.name}</a></td>
        <td>${r.city}</td>
        <td>${r.dates.map(isoRangeToDisplay).join('<br>')}</td>
        <td>${formatPrice(r.price)}</td>
      `;
      tbody.appendChild(tr); // Append the new row to the table body
    });
  }
}

// ---------- MAP INITIALIZATION -------------------------------------------

let map = null; // Variable to hold the map instance
let markers = L.markerClusterGroup(); // Marker cluster group instance
const markerReferences = {}; // Object to store references to individual markers by retreat ID

/**
 * Initializes the Leaflet map and adds markers for retreats.
 * @param {Array<object>} list - The array of retreat objects to display on the map.
 */
export function initMap(list) {
  // Check if map is already initialized
  if (map) {
    map.remove(); // Remove existing map if re-initializing
  }

  // Initialize the map centered on the Eastern Hemisphere
  // Changed from [39.8283, -98.5795], 4 (US Center)
  map = L.map('map').setView([20, -70], 2); // Centered more towards western Hemisphere, zoom level 2

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Clear existing markers before adding new ones
  markers.clearLayers();
  Object.keys(markerReferences).forEach(key => delete markerReferences[key]); // Clear references

  // Add markers for each retreat
  list.forEach(r => {
    // Create a custom icon using the retreat's emoji icon
    const customIcon = L.divIcon({
        html: `<span style="font-size: 24px;">${r.icon}</span>`,
        className: 'emoji-icon', // Add a class for potential styling
        iconSize: [30, 30],
        iconAnchor: [15, 30], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -25] // Point from which the popup should open relative to the iconAnchor
    });


    // Create marker with custom icon
    const marker = L.marker(r.coords, { icon: customIcon });

    // Create popup content
    const popupContent = `
      <b>${r.name}</b><br>
      ${r.city}<br>
      Dates: ${r.dates.map(isoRangeToDisplay).join(', ')}<br>
      Price: ${formatPrice(r.price)}<br>
      <a href="${r.url}" target="_blank" rel="noopener noreferrer">Visit Website</a>
    `;
    marker.bindPopup(popupContent);

    // Add marker to the cluster group
    markers.addLayer(marker);

    // Store marker reference by retreat ID
    markerReferences[r.id] = marker;
  });

  // Add the marker cluster group to the map
  map.addLayer(markers);

  // Add click listener to table rows
  addTableClickListeners();
}

/**
 * Adds click event listeners to table rows to interact with the map.
 */
function addTableClickListeners() {
    const tbody = document.querySelector('#retreatTable tbody');
    if (!tbody) return;

    tbody.addEventListener('click', (event) => {
        const row = event.target.closest('tr'); // Find the closest parent table row
        if (row && row.dataset.id && map && markerReferences[row.dataset.id]) {
            const marker = markerReferences[row.dataset.id];
            const coords = JSON.parse(row.dataset.coords);

            // Option 1: Pan and zoom to the marker, then open popup
            map.flyTo(coords, 13); // Fly to coordinates with zoom level 13
            // Use a timeout to open popup after flyTo animation likely finishes
            setTimeout(() => {
                 // If the marker is in a cluster, zoom to reveal it first
                markers.zoomToShowLayer(marker, () => {
                    marker.openPopup();
                });
            }, 600); // Adjust timeout as needed based on flyTo duration

            // Option 2: Just open the popup (if marker is visible)
            // markers.zoomToShowLayer(marker, () => {
            //     marker.openPopup();
            // });
        }
    });
}

// --- Initial Load (Optional, if not handled by index.html) ---
// This part assumes index.html handles the initial call.
// If running this script standalone or differently, you might need:
// document.addEventListener('DOMContentLoaded', () => {
//   renderTable(retreats);
//   initMap(retreats);
// });

