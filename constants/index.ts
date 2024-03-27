export const headerLinks = [
  {
    label: 'HOME',
    route: '/',
  },

  {
    label: 'ALL BOOKS',
    route: '/books',
  },
  {
    label: 'SERIES',
    route: '/series',
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

export const allbooks = [
  {
    id: '001',
    name: 'Shelly and Spike The Tale of Starfish Adventure and Friendship Book 1',
    image: 'shellyandspikebook1.jpg',
    slugId: 'shellyandspikebook1',
    shortdescription: 'The Tale of Starfish Adventure and Friendship Book 1',
    description:
      'Dive into an enchanting undersea adventure with Shelly and Spike, two starfish friends with contrasting personalities! Join Shelly, the cautious pink starfish, and Spike, the adventurous yellow starfish, as they embark on a thrilling treasure hunt guided by a mysterious map.',
    longdescription: [
      "This isn't just a fun-filled adventure; it's also an educational journey. As Shelly and Spike navigate their underwater world, children will learn interesting facts about marine life, sparking curiosity and a love for the ocean. The book's language is playful and engaging, while the illustrations bring the underwater world to life with vibrant colors and charming details.",
      "But the adventure doesn't end there! The book concludes with a thrilling cliffhanger, leaving your child eager to dive into Book 2. This mini series provides a natural progression for young readers, allowing them to continue their undersea escapade with their newfound friends.",
    ],
    ages: '5-8 years',
    bookType: 'series',
    seriesname: 'Shelly and Spike',
    serieslink: 'shellyandspike',
    available: 'yes',
    buylinks: [
      {
        buyname: 'Buy Ebook (AU Edition)',
        buylink: 'https://www.amazon.com.au/dp/B0CVR8MSRT',
      },

      {
        buyname: 'Buy Ebook',
        buylink: 'https://www.amazon.com/dp/B0CVRPHN1Y',
      },
      {
        buyname: 'Buy Paperback (AU Edition)',
        buylink:
          'https://www.amazon.com.au/Shelly-Spike-Starfish-Adventure-Friendship/dp/B0CVSNJSX1/',
      },
      {
        buyname: 'Buy Paperback',
        buylink:
          'https://www.amazon.com/Shelly-Spike-Starfish-Adventure-Friendship/dp/B0CVSLH2RN/',
      },
    ],
    sample: 'https://heyzine.com/flip-book/e88f5dd3fa.html',
  },
  {
    id: '002',
    name: 'Marine Life With Billy Book 1',
    image: 'billybook1.jpg',
    seriesname: 'Billy',
    serieslink: 'billy',
    slugId: 'billybook1',
    shortdescription: 'Marine Life With Billy Book 1',
    description:
      'Dive into the amazing world of starfish with Billy the Blue Fish, your friendly guide to undersea adventures! Marine Life with Billy Book 1: Starfish is the perfect blend of fun storytelling and fascinating facts, designed to spark a love for our oceans in young readers.',
    longdescription: [
      'Join Billy as he introduces you to Shelly and Spike, two starfish superstars with incredible stories to tell. Discover the secrets of their star-shaped bodies, vibrant colors, and hidden superpowers. Did you know they can grow new arms and navigate the ocean floor with hundreds of tiny water balloons at the tips of their arms?',
      "This charming book goes beyond just starfish, offering a glimpse into the wonders of the entire ocean ecosystem. Learn about the unique water vascular system that carries food and oxygen within starfish, and travel with Billy and his friends to the deepest, darkest parts of the ocean where sunlight never reaches. Each page is bursting with colorful illustrations that bring the underwater world to life, igniting your child's imagination and curiosity.",
    ],
    ages: '5-8 years',
    bookType: 'series',
    available: 'yes',
    buylinks: [
      {
        buyname: 'Buy Ebook (AU Edition)',
        buylink: 'https://www.amazon.com.au/dp/B0CW19XD9B/',
      },

      {
        buyname: 'Buy Ebook',
        buylink: 'https://www.amazon.com/dp/B0CTHPW9C5/',
      },
      {
        buyname: 'Buy Paperback (AU Edition)',
        buylink:
          'https://www.amazon.com.au/Marine-Life-Billy-Illustrated-Educational/dp/B0CWSN6M5W/',
      },
      {
        buyname: 'Buy Paperback',
        buylink:
          'https://www.amazon.com/Marine-Life-Billy-Illustrated-Educational/dp/B0CWS7CWK4/',
      },
    ],

    sample: 'https://heyzine.com/flip-book/5a76bfc07c.html',
  },
  {
    id: '003',
    name: 'Buzzy The Bee, A Tale of Triumph on Her First Day at School Book 1',
    image: 'buzzybook1.png',
    seriesname: 'Buzzy',
    serieslink: 'buzzy',
    slugId: 'buzzybook1',
    shortdescription: 'A Tale of Triumph on Her First Day at School Book 1',
    description:
      'Meet Buzzy, the tiniest bee in the hive with a heart as big as the honeycomb! Join her on her heartwarming journey as she overcomes her fears, makes new friends, and discovers the magic of believing in herself.',
    longdescription: [
      "This delightful tale, buzzing with vibrant illustrations, teaches valuable lessons about self-acceptance, courage, and the power of friendship. Perfect for young readers, Buzzy's adventure will leave them giggling, inspired, and eager to explore the world with newfound confidence. So grab your wings and join Buzzy's exciting story today!",
    ],
    ages: '4-8 years',
    bookType: 'series',
    available: '7-MAY-2024',
    ebookurl: '',
    paperbackurl: '',
    sample: 'https://heyzine.com/flip-book/06abc85b4f.html',
  },
  {
    id: '004',
    shortname: 'Worry Whale',
    name: 'Worry Whale - A Whimsical Worry Whale: A Tale of Taming Worries',
    image: 'worrywhale.png',
    seriesname: '',
    slugId: 'worrywhale',
    shortdescription: 'A Whimsical Worry Whale: A Tale of Taming Worries',
    description:
      "Dive into a whimsical adventure with a heartwarming children's book that will help your little ones navigate the stormy seas of anxiety. Set sail with Worry Whale, a lovable character who shows children how to transform their worries from heavy anchors into wispy clouds that drift away on the ocean breeze.",
    longdescription: [
      'Worry Whale embarks on a journey of self-discovery, learning valuable mindfulness techniques to calm her anxious mind.',
      'The story celebrates resilience and inner strength, reminding children that even in the face of worries, they have the power to find joy and peace within themselves.',
    ],
    ages: '5-8 years',
    bookType: 'non-series',
    available: 'yes',
    sample: 'https://heyzine.com/flip-book/e6f7d6a90e.html',
    buylinks: [
      {
        buyname: 'Buy Ebook (AU Edition)',
        buylink: 'https://www.amazon.com.au/dp/B0CQVBW877',
      },

      {
        buyname: 'Buy Ebook',
        buylink: 'https://www.amazon.com/dp/B0CQWH9DWC',
      },
      {
        buyname: 'Buy Paperback (AU Edition)',
        buylink:
          'https://www.amazon.com.au/Whimsical-Worry-Whale-Taming-Worries/dp/B0CQVQPG4Y',
      },
      {
        buyname: 'Buy Paperback',
        buylink:
          'https://www.amazon.com/Whimsical-Worry-Whale-Taming-Worries/dp/B0CQVQPG4Y/',
      },
    ],
  },
  {
    id: '005',
    name: 'Sparky - The Adventures of Sparky the Squirrel: A Tale of Self-Worth',
    shortname: 'Sparky',
    image: 'sparky.png',
    seriesname: '',
    slugId: 'sparky',
    shortdescription:
      'The Adventures of Sparky the Squirrel: A Tale of Self-Worth',
    description:
      "Meet Sparky, a squirrel who doesn't quite fit the mould. He can't climb the tallest trees or gather the biggest piles of nuts, and that makes him feel small and discouraged. But what if Sparkly's special talents shine differently?",
    longdescription: [
      "Join Sparky on a heartwarming adventure as he discovers his hidden gifts! Paint with berries under the sun, tap out tunes on leafy drums, and watch Sparkly's confidence blossom. Along the way, he'll help lost friends, soothe worried hearts with his music, and prove that being different is what makes you amazing!",

      'In The Adventures of Sparky the Squirrel: A Tale of Self-Worth, you will learn to love their unique talents and shine bright! Embark on a heartwarming journey of self-discovery and discover the power of kindness and helping others.',
      'Enjoy playful rhymes and coluorful illustrations.',
    ],
    ages: '4-8 years',
    bookType: 'non-series',
    available: 'yes',
    buylinks: [
      {
        buyname: 'Buy Ebook(AU Edition)',
        buylink: 'https://www.amazon.com.au/dp/B0CQMF94VJ',
      },
      {
        buyname: 'Buy Paperback(AU Edition)',
        buylink:
          'https://www.amazon.com.au/Adventures-Sparky-Squirrel-Tale-Self-Worth/dp/B0CQTTBGCL/',
      },
      {
        buyname: 'Buy Ebook',
        buylink: 'https://www.amazon.com/dp/B0CQNXB8VX',
      },
      {
        buyname: 'Buy Paperback',
        buylink:
          'https://www.amazon.com/Adventures-Sparky-Squirrel-Tale-Self-Worth/dp/B0CQTTBGCL/',
      },
    ],
    sample: '',
  },
  {
    id: '006',
    name: 'Shelly and Spike The Tale of Starfish Adventure and Friendship Book 2',
    image: 'shellyandspikebook2.jpg',
    slugId: 'shellyandspikebook2',
    shortdescription: 'The Tale of Starfish Adventure and Friendship Book 2',
    description:
      "Join Shelly, the cautious pink starfish, and Spike, the bubbly yellow explorer, as they embark on a new quest following their super special treasure map! They're headed to the mysterious Deep Sea of Stingrays on the back of Windy, a friendly whale shark. But their journey isn't all smooth sailing.",
    longdescription: [
      "Packed with exciting adventures, heartwarming moments, and valuable lessons, Shelly & Spike. The Tales of Starfish Adventure and Friendship Book 2 is sure to captivate young readers! It's the perfect blend of thrilling exploration, unbreakable friendship, gentle environmental message, non-stop excitement and series continuity.",
      "Don't let Shelly & Spike explore the undersea world alone! Get your copy today and join them on a journey filled with laughter, friendship, and unforgettable discoveries!",
    ],
    ages: '5-8 years',
    bookType: 'series',
    seriesname: 'Shelly and Spike',
    serieslink: 'shellyandspike',
    available: 'yes',
    sample: 'https://heyzine.com/flip-book/21e00b29d4.html',
    buylinks: [
      {
        buyname: 'Buy Ebook',
        buylink: 'https://www.amazon.com/dp/B0CYYH72BD',
      },
      {
        buyname: 'Buy Paperback',
        buylink: 'https://www.amazon.com/dp/B0CYY2J43H',
      },
    ],
  },
  {
    id: '007',
    name: 'Marine Life With Billy Book 2',
    image: 'billybook2.jpg',
    seriesname: 'Billy',
    serieslink: 'billy',
    slugId: 'billybook2',
    shortdescription: 'Marine Life With Billy Book 2',
    description:
      'Dive into the amazing world of whale sharks with Billy the Blue Fish, your friendly guide to undersea adventures! Marine Life with Billy Book 2: Whale shark is the perfect blend of fun storytelling and fascinating facts, designed to spark a love for our oceans in young readers.',
    longdescription: [
      'Join Billy as he introduces you to Windy, the whale shark, with incredible stories to tell.',
      "This charming book goes beyond just whale shark, offering a glimpse into the wonders of the entire ocean ecosystem.Each page is bursting with colorful illustrations that bring the underwater world to life, igniting your child's imagination and curiosity.",
    ],
    ages: '5-8 years',
    bookType: 'series',
    available: '30-APR-2024',
    ebookurl: '',
    paperbackurl: '',
    sample: '',
  },
  {
    id: '007',
    name: 'Marine Life With Billy Book 3',
    image: 'billybook3.jpg',
    seriesname: 'Billy',
    serieslink: 'billy',
    slugId: 'billybook3',
    shortdescription: 'Marine Life With Billy Book 3',
    description:
      'Dive into the amazing world of urchins with Billy the Blue Fish, your friendly guide to undersea adventures! Marine Life with Billy Book 3: Uchin is the perfect blend of fun storytelling and fascinating facts, designed to spark a love for our oceans in young readers.',
    longdescription: [
      'Join Billy as he introduces you to Uma, the urchin with incredible stories to tell.',
      "This charming book goes beyond just urchin, offering a glimpse into the wonders of the entire ocean ecosystem.Each page is bursting with colorful illustrations that bring the underwater world to life, igniting your child's imagination and curiosity.",
    ],
    ages: '5-8 years',
    bookType: 'series',
    available: '25-JUNE-2024',
    ebookurl: '',
    paperbackurl: '',
    sample: '',
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
