export const headerLinks = [
  {
    label: 'HOME',
    route: '/',
  },
  {
    label: 'BUY',
    route: '/buy',
  },
  {
    label: 'ALL BOOKS',
    route: '/books',
  },

  {
    label: 'ACTIVITIES',
    route: '/activities',
  },

  {
    label: 'ABOUT',
    route: '/about',
  },
  {
    label: 'CONTACT',
    route: '/contact',
  },
];

export const quickbuyLink = [
  {
    provider: 'Amazon(US)',
    url: '',
  },
  {
    provider: 'Amazon(AU)',
    url: '',
  },
  {
    provider: 'Google Play',
    url: '',
  },
  {
    provider: 'Buy Local',
    url: '',
  },
];
export const allbooks = [
  {
    id: 'S01',
    name: 'Starfish Super Squad Book 1 - A Mystery Map',
    image: 'starfishsupersquadbook1.jpg',
    slugId: 'starfishsupersquadbook1',
    shortdescription: 'Starfish Super Squad Book 1 - A Mystery Map',
    description:
      'Deep in Coral Cove, two best friends lived under the sea—Shelly, a shy pink starfish, and Spike, a cheerful yellow starfish who loved adventures! One sunny day, they discovered a mysterious treasure map that would change everything.',
    longdescription: [
      'Join Shelly and Spike in the very first book of their 24-book series, packed with exciting discoveries, ocean creatures, and underwater fun. What treasures and secrets will they uncover next?',
    ],
    ages: 'Independent 6–10 ★ Read-aloud 4–6',
    bookType: 'series',
    seriesname: 'Treasure Map Adventures',
    serieslink: 'shellyandspike',
    available: 'yes',
    buylinks: [
      {
        buyname: 'Buy from Amazon (US)',
        buylink: 'https://www.amazon.com/dp/1923337033/',
      },
      {
        buyname: 'Buy from Amazon (AU)',
        buylink: 'https://www.amazon.com.au/dp/1923337033',
      },
      {
        buyname: 'Buy from Google Play',
        buylink: 'https://play.google.com/store/books/details?id=b3hZEQAAQBAJ',
      },
    ],
    sample: 'https://heyzine.com/flip-book/a2ff8d113f.html',
  },
  {
    id: 'S02',
    name: 'Starfish Super Squad Book 2 - Coral Reef Heroes',
    image: 'starfishsupersquadbook2.jpg',
    slugId: 'starfishsupersquadbook2',
    shortdescription: 'Starfish Super Squad Book 2 - Coral Reef Heroes',
    description:
      'Follow Shelly and Spike as they set off on a big adventure and make new friends. But before they can search for treasure, they discover the coral reefs are in trouble! Now, they must work together with their new friends to save the reefs before continuing their quest.',

    longdescription: [
      'Join Shelly, Spike, and the rest of the Starfish Super Squad in the second book of their 24-book series, as they embark on an exciting mission to protect the coral reefs and uncover even more underwater wonders.',
    ],

    bookType: 'series',
    seriesname: 'Treasure Map Adventures',
    serieslink: 'shellyandspike',
    available: 'yes',
    buylinks: [
      {
        buyname: 'Buy Ebook (Google Play)',
        buylink: 'https://play.google.com/store/books/details?id=7opfEQAAQBAJ',
      },

      {
        buyname: 'Buy from Amazon (US)',
        buylink: 'https://www.amazon.com/dp/1923337068',
      },
      {
        buyname: 'Buy from Amazon (AU)',
        buylink: 'https://www.amazon.com.au/dp/1923337068',
      },
    ],
    sample: 'https://heyzine.com/flip-book/6c56778374.html',
  },

  {
    id: 'S03',
    name: 'Starfish Super Squad Book 3 - The Grumpy Quest',
    image: 'starfishsupersquadbook3.jpg',
    slugId: 'starfishsupersquadbook3',
    shortdescription: 'Starfish Super Squad Book 3 - The Grumpy Quest',
    description:
      'Follow Shelly and Spike as they set off on a big adventure and make new friends. But before they searched for treasure, they stopped at the Coral Reef Garden to save the coral reefs. There, they met a grumpy sea creature who needed their help.',

    longdescription: [
      'Join Shelly, Spike, and the rest of the Starfish Super Squad in the second book of their 24-book series, as they embark on an exciting mission to protect the coral reefs and uncover even more underwater wonders.',
    ],

    bookType: 'series',
    seriesname: 'Treasure Map Adventures',
    serieslink: 'shellyandspike',
    available: 'yes',
    buylinks: [
      {
        buyname: 'Buy Ebook (Google Play)',
        buylink: 'https://play.google.com/store/books/details/?id=ze1iEQAAQBAJ',
      },

      {
        buyname: 'Buy from Amazon (US)',
        buylink: 'https://www.amazon.com/dp/1923337076',
      },
      {
        buyname: 'Buy from Amazon (AU)',
        buylink: 'https://www.amazon.com.au/dp/1923337076',
      },
    ],
    sample: 'https://heyzine.com/flip-book/91e1dcc072.html',
  },
  {
    id: 'S04',
    name: 'Starfish Super Squad Book 4 - The Mystery of Grumble Rock',
    image: 'starfishsupersquadbook4.jpg',
    slugId: 'starfishsupersquadbook4',
    shortdescription:
      'Starfish Super Squad Book 4 - The Mystery of Grumble Rock',
    description:
      'The treasure map has brought Shelly and Spike to the Deep Sea of Stingrays — but danger lies ahead at their next stop, Grumble Rock! Uma, a wise little sea urchin, races to warn them before it’s too late. Along the way, she encounters sea otters, while the Squad meets Sandy, a gentle manta ray with a secret.',

    bookType: 'series',
    seriesname: 'Treasure Map Adventures',
    serieslink: 'shellyandspike',
    available: 'yes',
    buylinks: [
      {
        buyname: 'Buy from Amazon (US)',
        buylink: 'https://www.amazon.com/dp/1923337092',
      },
      {
        buyname: 'Buy from Amazon (AU)',
        buylink: 'https://www.amazon.com.au/dp/1923337092',
      },
    ],
    sample: 'https://heyzine.com/flip-book/91e1dcc072.html',
  },
];

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
};
