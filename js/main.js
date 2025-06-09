// BigTruth: Traces of Legend - main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('BigTruth Main JS Loaded');

    // --- Global Elements & Variables ---
    const body = document.body;
    const header = document.querySelector('header');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const logo = document.getElementById('logo');
    
    // --- Smooth scrolling for all anchor links ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // If mobile menu is open, close it
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Optionally update URL
                window.history.pushState(null, null, targetId);
            }
        });
    });

    // --- Navigation Toggle (Hamburger Menu) ---
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active'); // For styling the toggle itself (e.g., X icon)
            // Optional: Prevent body scroll when nav is open
            body.classList.toggle('no-scroll'); 
        });
    }

    // --- Smooth Scroll for "Scroll Down" button (Index Page) ---
    const scrollButton = document.getElementById('scrollDownBtn');
    const factsSection = document.getElementById('factsSection');

    if (scrollButton && factsSection) {
        scrollButton.addEventListener('click', (e) => {
            e.preventDefault();
            factsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Logo Click "Hack" Effect ---
    if (logo) {
        logo.addEventListener('click', () => {
            body.classList.add('hacked-effect');
            // Add some console message for effect
            console.warn('SYSTEM BREACH DETECTED. SECURITY PROTOCOLS OVERRIDDEN.');
            console.log('%cACCESSING CLASSIFIED FILES...', 'color: #0aff9d; font-weight: bold;');
            
            // Remove effect after a short period
            setTimeout(() => {
                body.classList.remove('hacked-effect');
                console.log('%cSYSTEM STABILIZED. Threat neutralized.', 'color: #0aff9d;');
            }, 2500); // Effect duration
        });
    }

    // --- General Modal Handling ---
    const allModalTriggers = document.querySelectorAll('[data-modal-target]');
    const allCloseButtons = document.querySelectorAll('.close-btn');
    const modals = document.querySelectorAll('.modal');

    allModalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    allCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal if background is clicked
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Clicked on the modal backdrop
                closeModal(modal);
            }
        });
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.style.display = 'block';
        body.classList.add('no-scroll'); // Prevent background scroll
        // Trigger reflow to enable animation
        modal.offsetHeight; 
        modal.classList.add('open');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.classList.remove('open');
        // Wait for animation to finish before setting display to none
        // This timeout should match the animation duration for fading out if one is added
        // For now, using the fadeInModal duration as a proxy
        setTimeout(() => {
             modal.style.display = 'none';
             if (!document.querySelector('.modal.open')) { // Only remove no-scroll if no other modals are open
                body.classList.remove('no-scroll');
            }
        }, 300); // Corresponds to fadeInModal animation
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openModalElement = document.querySelector('.modal.open');
            if (openModalElement) {
                closeModal(openModalElement);
            }
        }
    });

    // Placeholder for page-specific JS initializations
    initIndexPage();
    initMapPage();
    initTheoriesPage();
    initGalleryPage();
    initReportPage();

});

// --- Page Specific Initializations ---

function initIndexPage() {
    // const declassifyBtn = document.getElementById('declassifyBtn');
    // const evidenceModal = document.getElementById('evidenceModal');
    // if (declassifyBtn && evidenceModal) { // Already handled by general modal triggers
    // }
    console.log('Index Page JS Initialized');
}

let mapInstance = null; // To hold the map instance
let allMapMarkers = []; // To store all Leaflet markers for filtering
const sightingsData = [
    // --- Data: Pre-2000 ---
    { id: 'BF-1955-07-10', lat: 46.8523, lon: -121.7603, type: 'sighting', location: 'Mount Rainier, WA', date: '1955-07-10', details: 'Park ranger observed a large, dark bipedal figure moving quickly through an alpine meadow.', reliability: 'A' },
    { id: 'BF-1962-11-05', lat: 41.3110, lon: -123.9334, type: 'footprint', location: 'Bluff Creek, CA', date: '1962-11-05', details: 'Multiple 16-inch tracks found along a logging road, similar to those later filmed.', reliability: 'A' },
    { id: 'BF-1968-04-15', lat: 44.0582, lon: -121.3153, type: 'sound', location: 'Deschutes National Forest, OR', date: '1968-04-15', details: 'Loggers reported hearing powerful, rhythmic wood knocks responding to their chainsaw activity.', reliability: 'B' },
    { id: 'BF-1971-09-22', lat: 38.9072, lon: -77.0369, type: 'sighting', location: 'Appalachian Trail, VA', date: '1971-09-22', details: 'Hiker had a brief, unnerving encounter with a tall, hairy creature that crossed the trail ahead.', reliability: 'B' },
    { id: 'BF-1975-06-30', lat: 35.9606, lon: -83.9207, type: 'footprint', location: 'Great Smoky Mountains, TN', date: '1975-06-30', details: 'Unusually deep and clear 18-inch footprints found in soft earth near a stream.', reliability: 'A' },
    { id: 'BF-1978-10-01', lat: 40.7128, lon: -74.0060, type: 'sound', location: 'Pine Barrens, NJ', date: '1978-10-01', details: 'Prolonged, high-pitched screams unlike any known local animal heard by multiple witnesses.', reliability: 'C' },
    { id: 'BF-1981-05-12', lat: 34.0522, lon: -118.2437, type: 'sighting', location: 'Angeles National Forest, CA', date: '1981-05-12', details: 'Campers saw a large, shadowy figure lurking at the edge of their campsite at dusk.', reliability: 'B' },
    { id: 'BF-1984-08-20', lat: 47.6062, lon: -122.3321, type: 'footprint', location: 'Olympic Peninsula, WA', date: '1984-08-20', details: 'Series of 17-inch tracks with a distinct mid-tarsal break found on a remote beach.', reliability: 'A' },
    { id: 'BF-1987-11-15', lat: 41.8781, lon: -87.6298, type: 'sound', location: 'Shawnee National Forest, IL', date: '1987-11-15', details: 'Hunters heard deep, guttural vocalizations and heavy footsteps circling their camp at night.', reliability: 'B' },
    { id: 'BF-1990-03-03', lat: 30.2672, lon: -97.7431, type: 'sighting', location: 'Sam Houston National Forest, TX', date: '1990-03-03', details: 'Fisherman reported a 7-foot creature covered in reddish-brown hair watching him from the riverbank.', reliability: 'A' },
    { id: 'BF-1993-07-25', lat: 45.5231, lon: -122.6765, type: 'footprint', location: 'Mount Hood National Forest, OR', date: '1993-07-25', details: 'Exceptionally clear 15-inch footprints found in volcanic ash near a hiking trail.', reliability: 'A' },
    { id: 'BF-1996-01-18', lat: 37.7749, lon: -122.4194, type: 'sound', location: 'Redwood National Park, CA', date: '1996-01-18', details: 'Researchers recorded complex whistles and chattering sounds that did not match any known species.', reliability: 'B' },
    { id: 'BF-1999-09-09', lat: 39.7392, lon: -104.9903, type: 'sighting', location: 'Pike National Forest, CO', date: '1999-09-09', details: 'Mountain bikers saw a large, dark hominid cross a fire road at high speed.', reliability: 'B' },
    { id: 'BF-1952-08-14', lat: 43.8041, lon: -120.5542, type: 'sighting', location: 'Central Oregon Cascades, OR', date: '1952-08-14', details: 'Prospector claimed a tall, ape-like creature raided his camp, leaving large tracks.', reliability: 'C' },
    { id: 'BF-1958-06-01', lat: 47.7511, lon: -120.7401, type: 'footprint', location: 'Wenatchee National Forest, WA', date: '1958-06-01', details: 'Construction crew found numerous large, human-like footprints around their equipment.', reliability: 'A' },
    { id: 'BF-1964-10-29', lat: 38.5816, lon: -121.4944, type: 'sound', location: 'Sierra Nevada Foothills, CA', date: '1964-10-29', details: 'Ranchers reported terrifying howls and tree-shaking incidents near their property for weeks.', reliability: 'B' },
    { id: 'BF-1969-07-04', lat: 32.7157, lon: -117.1611, type: 'sighting', location: 'Cleveland National Forest, CA', date: '1969-07-04', details: 'Family picnicking saw a massive, dark figure watching them from a hillside before it vanished.', reliability: 'B' },
    { id: 'BF-1973-05-25', lat: 44.9778, lon: -93.2650, type: 'footprint', location: 'Chippewa National Forest, MN', date: '1973-05-25', details: 'Unusually long stride tracks, over 6 feet apart, found in a boggy area.', reliability: 'A' },
    { id: 'BF-1977-08-19', lat: 29.7604, lon: -95.3698, type: 'sound', location: 'Big Thicket Preserve, TX', date: '1977-08-19', details: 'Campers recorded eerie, moaning vocalizations and what sounded like heavy bipedal movement in the swamp.', reliability: 'C' },
    { id: 'BF-1982-04-01', lat: 33.4484, lon: -112.0740, type: 'sighting', location: 'Tonto National Forest, AZ', date: '1982-04-01', details: 'Hikers surprised a large, reddish-brown creature drinking from a remote spring. It fled rapidly.', reliability: 'A' },
    { id: 'BF-1986-12-07', lat: 42.3601, lon: -71.0589, type: 'footprint', location: 'Blue Hills Reservation, MA', date: '1986-12-07', details: 'Series of 14-inch tracks found in snow, leading into dense, inaccessible terrain.', reliability: 'B' },
    { id: 'BF-1991-02-14', lat: 40.0583, lon: -74.4057, type: 'sound', location: 'Wharton State Forest, NJ', date: '1991-02-14', details: 'Bloodcurdling screams and howls heard by multiple residents bordering the forest.', reliability: 'B' },
    { id: 'BF-1995-11-30', lat: 34.8526, lon: -82.3940, type: 'sighting', location: 'Sumter National Forest, SC', date: '1995-11-30', details: 'Hunter had a close encounter with a 7-foot creature that silently observed him before melting into the woods.', reliability: 'A' },
    { id: 'BF-1998-08-08', lat: 43.0731, lon: -89.4012, type: 'footprint', location: 'Kettle Moraine State Forest, WI', date: '1998-08-08', details: 'Well-defined 16-inch tracks with five toes found on a muddy trail after a storm.', reliability: 'A' },
    // ... (Adding 20 more pre-2000 for a total of ~44) ...
    { id: 'BF-1950-10-02', lat: 45.0000, lon: -100.0000, type: 'sighting', location: 'Black Hills, SD', date: '1950-10-02', details: 'Miners reported seeing a giant, hairy man-beast near their claim.', reliability: 'C' },
    { id: 'BF-1953-04-11', lat: 39.0000, lon: -80.0000, type: 'footprint', location: 'Monongahela National Forest, WV', date: '1953-04-11', details: 'Large, unidentifiable tracks found by a forestry crew.', reliability: 'B' },
    { id: 'BF-1956-09-05', lat: 47.0000, lon: -90.0000, type: 'sound', location: 'Chequamegon-Nicolet National Forest, WI', date: '1956-09-05', details: 'Strange whoops and whistles heard by lost hunters.', reliability: 'B' },
    { id: 'BF-1959-01-20', lat: 31.0000, lon: -90.0000, type: 'sighting', location: 'De Soto National Forest, MS', date: '1959-01-20', details: 'A dark, tall figure was seen crossing a rural road late at night.', reliability: 'C' },
    { id: 'BF-1961-08-15', lat: 33.0000, lon: -85.0000, type: 'footprint', location: 'Talladega National Forest, AL', date: '1961-08-15', details: 'Unusually large footprints found near a creek, baffling locals.', reliability: 'B' },
    { id: 'BF-1963-12-01', lat: 30.0000, lon: -83.0000, type: 'sound', location: 'Apalachicola National Forest, FL', date: '1963-12-01', details: 'Deep, resonant howls heard that did not match any known animal.', reliability: 'A' },
    { id: 'BF-1966-02-22', lat: 35.5000, lon: -78.0000, type: 'sighting', location: 'Croatan National Forest, NC', date: '1966-02-22', details: 'Fishermen saw a large, hairy creature on the banks of the Neuse River.', reliability: 'B' },
    { id: 'BF-1970-04-04', lat: 42.0000, lon: -75.0000, type: 'footprint', location: 'Catskill Mountains, NY', date: '1970-04-04', details: 'Hikers found a trail of massive footprints in melting snow.', reliability: 'A' },
    { id: 'BF-1974-07-17', lat: 43.5000, lon: -70.5000, type: 'sound', location: 'White Mountain National Forest, NH', date: '1974-07-17', details: 'Campers were awakened by loud wood knocks and strange vocalizations.', reliability: 'A' },
    { id: 'BF-1979-03-25', lat: 41.5000, lon: -83.0000, type: 'sighting', location: 'Ottawa National Wildlife Refuge, OH', date: '1979-03-25', details: 'Birdwatchers spotted a large, dark bipedal figure in the marshes.', reliability: 'B' },
    { id: 'BF-1983-09-12', lat: 38.0000, lon: -87.0000, type: 'footprint', location: 'Hoosier National Forest, IN', date: '1983-09-12', details: 'A clear set of 17-inch footprints found near a popular trail.', reliability: 'A' },
    { id: 'BF-1988-01-08', lat: 36.8000, lon: -90.0000, type: 'sound', location: 'Mark Twain National Forest, MO', date: '1988-01-08', details: 'Residents reported hearing terrifying screams from the deep woods for several nights.', reliability: 'C' },
    { id: 'BF-1992-06-19', lat: 34.5000, lon: -97.0000, type: 'sighting', location: 'Arbuckle Mountains, OK', date: '1992-06-19', details: 'A group of friends saw a tall, hairy creature while camping.', reliability: 'B' },
    { id: 'BF-1997-05-02', lat: 40.5000, lon: -110.0000, type: 'footprint', location: 'Uinta National Forest, UT', date: '1997-05-02', details: 'Large, human-like tracks discovered in a remote canyon.', reliability: 'A' },
    { id: 'BF-1951-01-01', lat: 48.0000, lon: -115.0000, type: 'sighting', location: 'Kootenai National Forest, MT', date: '1951-01-01', details: 'Trapper reported a close encounter with a "giant hairy ape-man".', reliability: 'B' },
    { id: 'BF-1957-03-10', lat: 43.0000, lon: -110.0000, type: 'footprint', location: 'Bridger-Teton National Forest, WY', date: '1957-03-10', details: 'Unusually large tracks found in the snow by a ski patrol.', reliability: 'A' },
    { id: 'BF-1965-05-20', lat: 44.0000, lon: -114.0000, type: 'sound', location: 'Salmon-Challis National Forest, ID', date: '1965-05-20', details: 'Miners heard strange, powerful howls echoing through the mountains.', reliability: 'B' },
    { id: 'BF-1976-09-03', lat: 42.5000, lon: -120.0000, type: 'sighting', location: 'Fremont-Winema National Forest, OR', date: '1976-09-03', details: 'A family saw a large, dark figure run across the highway at night.', reliability: 'C' },
    { id: 'BF-1985-11-11', lat: 39.5000, lon: -115.0000, type: 'footprint', location: 'Humboldt-Toiyabe National Forest, NV', date: '1985-11-11', details: 'Hikers found a line of 18-inch footprints in a dry riverbed.', reliability: 'A' },
    { id: 'BF-1994-02-28', lat: 38.8000, lon: -107.0000, type: 'sound', location: 'Gunnison National Forest, CO', date: '1994-02-28', details: 'Cross-country skiers heard loud wood knocks and strange whistles in a remote valley.', reliability: 'B' },

    // --- Data: 2000-2005 ---
    { id: 'BF-2000-07-15', lat: 46.8523, lon: -121.7603, type: 'sighting', location: 'Mount Rainier, WA', date: '2000-07-15', details: 'Climbers reported a large, bipedal figure observing them from a snowfield.', reliability: 'A' },
    { id: 'BF-2001-10-20', lat: 41.3110, lon: -123.9334, type: 'footprint', location: 'Six Rivers National Forest, CA', date: '2001-10-20', details: 'Fresh 17-inch tracks found after a recent rain, showing clear dermal ridges.', reliability: 'A' },
    { id: 'BF-2002-05-01', lat: 44.0582, lon: -121.3153, type: 'sound', location: 'Three Sisters Wilderness, OR', date: '2002-05-01', details: 'Backpackers recorded long, mournful howls that lasted for over an hour.', reliability: 'B' },
    { id: 'BF-2003-11-10', lat: 35.9606, lon: -83.9207, type: 'sighting', location: 'Cherokee National Forest, TN', date: '2003-11-10', details: 'A dark, hairy creature was seen crossing a remote forest service road at dusk.', reliability: 'B' },
    { id: 'BF-2004-08-05', lat: 40.7128, lon: -74.0060, type: 'footprint', location: 'Harriman State Park, NY', date: '2004-08-05', details: 'Unusually large, human-like footprints found pressed into a muddy trail.', reliability: 'A' },
    { id: 'BF-2005-02-12', lat: 34.0522, lon: -118.2437, type: 'sound', location: 'San Bernardino National Forest, CA', date: '2005-02-12', details: 'Campers heard distinct wood knocks and what sounded like something large moving through the underbrush.', reliability: 'C' },

    // --- Data: 2006-2010 ---
    { id: 'BF-2006-09-17', lat: 47.6062, lon: -122.3321, type: 'sighting', location: 'North Cascades National Park, WA', date: '2006-09-17', details: 'Experienced hiker saw a tall, muscular, dark-haired figure watching from a rocky outcrop.', reliability: 'A' },
    { id: 'BF-2007-04-22', lat: 41.8781, lon: -87.6298, type: 'footprint', location: 'Cook County Forest Preserves, IL', date: '2007-04-22', details: 'Series of 15-inch tracks with a 5-foot stride found near a creek.', reliability: 'B' },
    { id: 'BF-2008-10-03', lat: 30.2672, lon: -97.7431, type: 'sound', location: 'Bastrop State Park, TX', date: '2008-10-03', details: 'Park visitors reported hearing loud, guttural roars and tree branches breaking at night.', reliability: 'B' },
    { id: 'BF-2009-06-11', lat: 45.5231, lon: -122.6765, type: 'sighting', location: 'Tillamook State Forest, OR', date: '2009-06-11', details: 'Mushroom hunters had a fleeting glimpse of a large, hairy biped disappearing into thick fog.', reliability: 'C' },
    { id: 'BF-2010-01-28', lat: 37.7749, lon: -122.4194, type: 'footprint', location: 'Mount Tamalpais State Park, CA', date: '2010-01-28', details: 'Clear 16-inch footprints found in soft earth, some showing signs of a flexible midfoot.', reliability: 'A' },

    // --- Data: 2011-2015 ---
    { id: 'BF-2011-08-08', lat: 39.7392, lon: -104.9903, type: 'sound', location: 'Roosevelt National Forest, CO', date: '2011-08-08', details: 'Hikers recorded complex vocalizations, including whistles and clicks, from a dense aspen grove.', reliability: 'A' },
    { id: 'BF-2012-03-16', lat: 32.7157, lon: -117.1611, type: 'sighting', location: 'Anza-Borrego Desert State Park, CA', date: '2012-03-16', details: 'Off-roaders spotted a tall, dark figure moving with incredible speed across a barren hillside at twilight.', reliability: 'B' },
    { id: 'BF-2013-09-02', lat: 44.9778, lon: -93.2650, type: 'footprint', location: 'Superior National Forest, MN', date: '2013-09-02', details: 'Canoeists found large, five-toed tracks on a remote portage trail.', reliability: 'A' },
    { id: 'BF-2014-05-21', lat: 29.7604, lon: -95.3698, type: 'sound', location: 'Davy Crockett National Forest, TX', date: '2014-05-21', details: 'Campers were disturbed by loud whoops and what sounded like large rocks being thrown into a nearby lake.', reliability: 'B' },
    { id: 'BF-2015-12-10', lat: 33.4484, lon: -112.0740, type: 'sighting', location: 'Superstition Mountains, AZ', date: '2015-12-10', details: 'Prospector reported a large, hairy creature watching him from a cliff face for several minutes.', reliability: 'A' },

    // --- Data: 2016-2020 ---
    { id: 'BF-2016-06-06', lat: 42.3601, lon: -71.0589, type: 'footprint', location: 'Myles Standish State Forest, MA', date: '2016-06-06', details: 'Unusually clear 14-inch footprints found in sandy soil near a pond.', reliability: 'B' },
    { id: 'BF-2017-11-11', lat: 40.0583, lon: -74.4057, type: 'sound', location: 'Brendan T. Byrne State Forest, NJ', date: '2017-11-11', details: 'Hikers heard a series of loud, resonating howls that seemed to move through the forest.', reliability: 'C' },
    { id: 'BF-2018-07-01', lat: 34.8526, lon: -82.3940, type: 'sighting', location: 'Pisgah National Forest, NC', date: '2018-07-01', details: 'Kayakers saw a tall, dark figure wading across a shallow section of the Davidson River.', reliability: 'A' },
    { id: 'BF-2019-02-20', lat: 43.0731, lon: -89.4012, type: 'footprint', location: 'Governor Dodge State Park, WI', date: '2019-02-20', details: 'Tracks measuring 15 inches with a distinct hourglass shape found in snow.', reliability: 'A' },
    { id: 'BF-2020-09-27', lat: 46.8523, lon: -121.7603, type: 'sound', location: 'Gifford Pinchot National Forest, WA', date: '2020-09-27', details: 'Berry pickers recorded what sounded like complex language or chattering from a dense thicket.', reliability: 'B' },

    // --- Data: 2021-2024 ---
    { id: 'BF-2021-04-10', lat: 41.3110, lon: -123.9334, type: 'sighting', location: 'Trinity Alps Wilderness, CA', date: '2021-04-10', details: 'Backpacker had a prolonged observation of a large, brown-haired biped foraging on a mountainside.', reliability: 'A' },
    { id: 'BF-2022-01-15', lat: 44.0582, lon: -121.3153, type: 'footprint', location: 'Ochoco National Forest, OR', date: '2022-01-15', details: 'Hunter found a line of 18-inch tracks in fresh snow, leading into extremely rugged terrain.', reliability: 'A' },
    { id: 'BF-2022-08-02', lat: 35.9606, lon: -83.9207, type: 'sound', location: 'Nantahala National Forest, NC', date: '2022-08-02', details: 'Fishermen heard powerful, rhythmic splashing and deep grunts from an unseen source in a remote river section.', reliability: 'B' },
    { id: 'BF-2023-03-25', lat: 38.9072, lon: -77.0369, type: 'sighting', location: 'Shenandoah National Park, VA', date: '2023-03-25', details: 'A park visitor captured a blurry photo of a tall, dark figure moving through the trees off Skyline Drive.', reliability: 'C' },
    { id: 'BF-2023-10-30', lat: 40.7128, lon: -74.0060, type: 'footprint', location: 'Sterling Forest State Park, NY', date: '2023-10-30', details: 'Hikers found a single, very large and deep footprint near a reservoir.', reliability: 'B' },
    { id: 'BF-2024-01-05', lat: 34.0522, lon: -118.2437, type: 'sound', location: 'Santa Monica Mountains, CA', date: '2024-01-05', details: 'Residents reported hearing strange, ape-like vocalizations echoing through the canyons at night.', reliability: 'C' }
];

function populateSightingModal(sightingId) {
    const sighting = sightingsData.find(s => s.id === sightingId);
    const modal = document.getElementById('sightingDetailModal');
    if (!sighting || !modal) return;

    modal.querySelector('.modal-title').textContent = `Sighting Report: ${sighting.id}`;
    modal.querySelector('#modalSightingLocation').textContent = sighting.location;
    modal.querySelector('#modalSightingDate').textContent = sighting.date;
    modal.querySelector('#modalSightingType').textContent = sighting.type.charAt(0).toUpperCase() + sighting.type.slice(1);
    modal.querySelector('#modalSightingDetails').textContent = sighting.details;
    // The modal opening is handled separately by openModal()
}

function initMapPage() {
    const sightingsMapDiv = document.getElementById('sightings-map');
    if (!sightingsMapDiv) return;
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded.');
        sightingsMapDiv.innerHTML = '<p style="color:var(--color-accent-red); text-align:center; padding-top: 50px;">Error: Map library failed to load. Please check your internet connection or contact support.</p>';
        return;
    }

    console.log('Map Page JS Initialized with Leaflet');

    // Prevent re-initialization
    if (mapInstance) {
        mapInstance.remove();
    }

    // Initialize the map - centered on continental USA
    mapInstance = L.map('sightings-map', { preferCanvas: true }).setView([39.8283, -98.5795], 4); // Added preferCanvas for potential performance with many markers

    // Add a dark tile layer from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapInstance);

    // Custom icons (optional, but good for different types)
    const iconColors = {
        sighting: 'var(--color-accent-red)',
        footprint: 'var(--color-accent-green)',
        sound: '#ffeb3b' // Yellow
    };

    sightingsData.forEach(sighting => {
        const iconHtml = `<div style="background-color: ${iconColors[sighting.type] || '#FFFFFF'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 5px ${iconColors[sighting.type] || '#FFFFFF'};"></div>`;
        const customMarkerIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-leaflet-marker', // Add a class for potential further styling
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker([sighting.lat, sighting.lon], { icon: customMarkerIcon }).addTo(mapInstance);

        const popupContent = `
            <b>${sighting.location}</b><br>
            Type: ${sighting.type.charAt(0).toUpperCase() + sighting.type.slice(1)}<br>
            Date: ${sighting.date}
        `;
        marker.bindPopup(popupContent);
        // Store marker with its data for filtering
        allMapMarkers.push({ marker: marker, data: sighting });
    });

    // Event delegation for popup buttons
    sightingsMapDiv.addEventListener('click', function(event) {
        if (event.target.classList.contains('popup-view-details-btn')) {
            const sightingId = event.target.getAttribute('data-sighting-id');
            populateSightingModal(sightingId);
            const modal = document.getElementById('sightingDetailModal');
            if (modal) {
                openModal(modal);
            }
        }
    });

    // Handle "View Full Report" buttons in the list (remains largely the same)
    // Filter functionality
    const filterEvidenceTypeElement = document.getElementById('evidence-type');
    const filterYearRangeElement = document.getElementById('year-range');
    const filterReliabilityElement = document.getElementById('reliability');
    // const filterKeywordElement = document.getElementById('filter-keyword'); // Keyword field not in HTML yet
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyMapFilters);
    }
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetMapFilters);
    }
    // Add event listeners to select elements to apply filters on change (optional, but user-friendly)
    if(filterEvidenceTypeElement) filterEvidenceTypeElement.addEventListener('change', applyMapFilters);
    if(filterYearRangeElement) filterYearRangeElement.addEventListener('change', applyMapFilters);
    if(filterReliabilityElement) filterReliabilityElement.addEventListener('change', applyMapFilters);

    // Handle "View Full Report" buttons in the list (remains largely the same)
    const viewReportButtons = document.querySelectorAll('.view-report-btn');
    viewReportButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reportId = button.getAttribute('data-report-id');
            const sighting = sightingsData.find(s => s.id === reportId);
            if (sighting) {
                populateSightingModal(reportId);
                const modal = document.getElementById('sightingDetailModal');
                if(modal) openModal(modal);
            } else {
                // Fallback for generic report modal if needed
                const reportModal = document.getElementById('reportDetailModal'); 
                if(reportModal) {
                    reportModal.querySelector('.modal-title').textContent = `Report: ${reportId}`;
                    // Populate other fields...
                    openModal(reportModal);
                }
            }
        });
    });
}

function applyMapFilters() {
    if (!mapInstance) return;

    const evidenceTypeFilter = document.getElementById('evidence-type').value;
    const yearRangeFilter = document.getElementById('year-range').value;
    const reliabilityFilter = document.getElementById('reliability').value;
    // const keywordFilter = document.getElementById('filter-keyword') ? document.getElementById('filter-keyword').value.toLowerCase() : '';

    allMapMarkers.forEach(item => {
        const sighting = item.data;
        // Assuming sighting.type in data matches values like 'visual', 'tracks', 'audio', 'physical'
        // The HTML has 'visual', 'tracks', 'audio', 'physical'. Our JS data uses 'sighting', 'footprint', 'sound'. We need to map these or change data.
        // For now, let's assume a direct match is intended or data will be updated.
        // Let's map HTML values to data values for 'evidence-type'
        let mappedSightingType = '';
        if (sighting.type === 'sighting') mappedSightingType = 'visual';
        else if (sighting.type === 'footprint') mappedSightingType = 'tracks';
        else if (sighting.type === 'sound') mappedSightingType = 'audio';
        // else if (sighting.type === 'physical_evidence') mappedSightingType = 'physical'; // Example if data had this

        let matchesEvidenceType = (evidenceTypeFilter === 'all' || mappedSightingType === evidenceTypeFilter);

        let matchesYearRange = true;
        if (yearRangeFilter !== 'all') {
            const sightingYear = new Date(sighting.date).getFullYear();
            if (yearRangeFilter === 'pre-2000') {
                matchesYearRange = sightingYear < 2000;
            } else {
                const [startYear, endYear] = yearRangeFilter.split('-').map(Number);
                matchesYearRange = sightingYear >= startYear && sightingYear <= endYear;
            }
        }
        
        // Reliability filter - Assuming sighting.data will have a 'reliability' field (e.g., 'A', 'B', 'C')
        // For now, this will not filter if data doesn't have 'reliability'. Let's add a placeholder.
        let matchesReliability = true;
        if (reliabilityFilter !== 'all' && sighting.reliability) { // Check if sighting.reliability exists
             // HTML values: 'confirmed' (A), 'probable' (B), 'possible' (C)
             // Assuming sighting.reliability stores 'A', 'B', 'C'
            if (reliabilityFilter === 'confirmed' && sighting.reliability !== 'A') matchesReliability = false;
            if (reliabilityFilter === 'probable' && sighting.reliability !== 'B') matchesReliability = false;
            if (reliabilityFilter === 'possible' && sighting.reliability !== 'C') matchesReliability = false;
        } else if (reliabilityFilter !== 'all' && !sighting.reliability) {
            // If filter is set but data has no reliability, assume it doesn't match unless 'all' is selected
            matchesReliability = false;
        }

        // let matchesKeyword = true;
        // if (keywordFilter) {
        //     matchesKeyword = sighting.location.toLowerCase().includes(keywordFilter) || 
        //                      sighting.details.toLowerCase().includes(keywordFilter);
        // }

        if (matchesEvidenceType && matchesYearRange && matchesReliability /*&& matchesKeyword*/) {
            if (!mapInstance.hasLayer(item.marker)) {
                item.marker.addTo(mapInstance);
            }
        } else {
            if (mapInstance.hasLayer(item.marker)) {
                item.marker.removeFrom(mapInstance);
            }
        }
    });
}

function resetMapFilters() {
    if (!mapInstance) return;

    document.getElementById('evidence-type').value = 'all';
    document.getElementById('year-range').value = 'all';
    document.getElementById('reliability').value = 'all';
    // if (document.getElementById('filter-keyword')) document.getElementById('filter-keyword').value = '';

    allMapMarkers.forEach(item => {
        if (!mapInstance.hasLayer(item.marker)) {
            item.marker.addTo(mapInstance);
        }
    });
    // Optionally, re-apply filters after reset if you want to ensure 'all' is processed (though adding all markers should suffice)
    // applyMapFilters(); 
}

function initTheoriesPage() {
    // Potential JS for theory card animations or interactions if not pure CSS
    console.log('Theories Page JS Initialized');
}

function initGalleryPage() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    console.log('Gallery Page JS Initialized');

    const filterType = document.getElementById('filterType');
    const filterDate = document.getElementById('filterDate');
    const filterSource = document.getElementById('filterSource');
    const applyGalleryFiltersBtn = document.getElementById('applyGalleryFiltersBtn');
    const galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));

    // Store original data for reset or complex filtering
    galleryItems.forEach(item => {
        item.dataset.originalDisplay = item.style.display || '';
    });

    if (applyGalleryFiltersBtn) {
        applyGalleryFiltersBtn.addEventListener('click', applyFilters);
    }

    function applyFilters() {
        const typeValue = filterType ? filterType.value.toLowerCase() : 'all';
        const dateValue = filterDate ? filterDate.value : ''; // Expects YYYY-MM-DD or similar
        const sourceValue = filterSource ? filterSource.value.toLowerCase() : '';

        galleryItems.forEach(item => {
            const itemType = item.getAttribute('data-type').toLowerCase();
            const itemDate = item.getAttribute('data-date');
            const itemSource = item.getAttribute('data-source').toLowerCase();

            let typeMatch = (typeValue === 'all' || itemType.includes(typeValue));
            let dateMatch = (dateValue === '' || itemDate === dateValue);
            let sourceMatch = (sourceValue === '' || itemSource.includes(sourceValue));

            if (typeMatch && dateMatch && sourceMatch) {
                item.style.display = item.dataset.originalDisplay; 
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Image Modal for Gallery
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageModal = document.getElementById('imageModal');
            if (!imageModal) return;

            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('.item-title').textContent;
            const meta = item.querySelector('.item-meta').textContent;

            imageModal.querySelector('#modalImage').src = imgSrc;
            imageModal.querySelector('#modalImageTitle').textContent = title;
            imageModal.querySelector('#modalImageMeta').textContent = meta;
            
            openModal(imageModal);
        });
    });
}

function initReportPage() {
    const reportForm = document.getElementById('sightingReportForm') || document.getElementById('sighting-form');
    if (!reportForm) return;

    console.log('Report Page JS Initialized');
    
    // Custom date input handling to ensure English format
    const dateInput = document.getElementById('sighting-date');
    if (dateInput) {
        // Set placeholder to English format
        dateInput.setAttribute('placeholder', 'MM/DD/YYYY');
        
        // Add input validation and formatting
        dateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                // Format as MM/DD/YYYY
                if (value.length > 4) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
                } else if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
            }
            e.target.value = value;
        });
    }
    
    // Custom time input handling to ensure English format
    const timeInput = document.getElementById('sighting-time');
    if (timeInput) {
        // Set placeholder to English format
        timeInput.setAttribute('placeholder', 'HH:MM (24hr)');
        
        // Add input validation and formatting
        timeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                // Format as HH:MM
                if (value.length > 2) {
                    value = value.slice(0, 2) + ':' + value.slice(2, 4);
                }
            }
            e.target.value = value;
        });
    }

    // Custom file input handling with completely custom UI to ensure English text
    const fileInput = document.getElementById('file-upload');
    const customBtn = document.getElementById('custom-upload-btn');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (fileInput && customBtn && fileNameDisplay) {
        // Make the custom button trigger the hidden file input
        customBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        // When a file is selected, update the display text
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                // Show selected filename in English
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                // No file selected text in English
                fileNameDisplay.textContent = 'No file selected';
            }
        });
        
        // Set initial text (English)
        fileNameDisplay.textContent = 'No file selected';
    }

    reportForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission

        // Basic validation (can be more complex)
        let isValid = true;
        const requiredFields = reportForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                // Add some visual feedback for invalid fields if desired
                field.style.borderColor = 'var(--color-accent-red)'; 
            } else {
                field.style.borderColor = ''; // Reset border
            }
        });

        if (isValid) {
            console.log('Form submitted (simulated). Data:', new FormData(reportForm));
            // Show thank you modal
            const thankYouModal = document.getElementById('thankYouModal');
            if (thankYouModal) {
                openModal(thankYouModal);
            }
            reportForm.reset(); // Clear the form
        } else {
            console.error('Form validation failed. Please fill all required fields.');
            // Optionally, show an error message to the user
            alert('Please fill all required fields marked with *');
        }
    });
}
