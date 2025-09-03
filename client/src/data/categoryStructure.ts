export interface SubCategory {
  id: string;
  name: string;
  productTypes?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  subcategories: SubCategory[];
}

export interface CategoryGroup {
  id: string;
  name: string;
  categories: Category[];
}

export const categoryStructure: CategoryGroup[] = [
  {
    id: 'home-decor',
    name: 'Home Decor',
    categories: [
      {
        id: 'furniture',
        name: 'Furniture',
        subcategories: [
          { id: 'living-room', name: 'Living Room', productTypes: ['Sofas', 'Chairs', 'Coffee Tables', 'TV Stands', 'Ottomans'] },
          { id: 'bedroom', name: 'Bedroom', productTypes: ['Beds', 'Dressers', 'Nightstands', 'Wardrobes', 'Vanities'] },
          { id: 'dining-room', name: 'Dining Room', productTypes: ['Dining Tables', 'Dining Chairs', 'Buffets', 'Bar Stools'] },
          { id: 'storage', name: 'Storage', productTypes: ['Shelving Units', 'Cabinets', 'Storage Benches', 'Bookcases'] }
        ]
      },
      {
        id: 'lighting',
        name: 'Lighting',
        subcategories: [
          { id: 'ceiling-lights', name: 'Ceiling Lights', productTypes: ['Chandeliers', 'Pendant Lights', 'Flush Mounts', 'Track Lighting'] },
          { id: 'lamps', name: 'Lamps', productTypes: ['Table Lamps', 'Floor Lamps', 'Desk Lamps', 'Reading Lamps'] },
          { id: 'outdoor-lighting', name: 'Outdoor Lighting', productTypes: ['String Lights', 'Path Lights', 'Security Lights', 'Lanterns'] },
          { id: 'smart-lighting', name: 'Smart Lighting', productTypes: ['Smart Bulbs', 'Smart Switches', 'LED Strips', 'Controllers'] }
        ]
      },
      {
        id: 'decor-accessories',
        name: 'Decor & Accessories',
        subcategories: [
          { id: 'wall-decor', name: 'Wall Decor', productTypes: ['Wall Art', 'Mirrors', 'Clocks', 'Shelves', 'Tapestries'] },
          { id: 'rugs-carpets', name: 'Rugs & Carpets', productTypes: ['Area Rugs', 'Runners', 'Door Mats', 'Outdoor Rugs'] },
          { id: 'cushions-throws', name: 'Cushions & Throws', productTypes: ['Throw Pillows', 'Blankets', 'Poufs', 'Floor Cushions'] },
          { id: 'vases-planters', name: 'Vases & Planters', productTypes: ['Flower Vases', 'Plant Pots', 'Hanging Planters', 'Terrariums'] }
        ]
      },
      {
        id: 'kitchen-dining',
        name: 'Kitchen & Dining',
        subcategories: [
          { id: 'cookware', name: 'Cookware', productTypes: ['Pots & Pans', 'Bakeware', 'Kitchen Tools', 'Cutting Boards'] },
          { id: 'dinnerware', name: 'Dinnerware', productTypes: ['Plates', 'Bowls', 'Cups & Mugs', 'Serving Dishes'] },
          { id: 'glassware', name: 'Glassware', productTypes: ['Wine Glasses', 'Tumblers', 'Pitchers', 'Decanters'] },
          { id: 'kitchen-storage', name: 'Kitchen Storage', productTypes: ['Containers', 'Jars', 'Organizers', 'Spice Racks'] }
        ]
      }
    ]
  },
  {
    id: 'office',
    name: 'Office',
    categories: [
      {
        id: 'office-furniture',
        name: 'Office Furniture',
        subcategories: [
          { id: 'desks', name: 'Desks', productTypes: ['Standing Desks', 'Computer Desks', 'Writing Desks', 'L-Shaped Desks'] },
          { id: 'office-chairs', name: 'Office Chairs', productTypes: ['Ergonomic Chairs', 'Executive Chairs', 'Task Chairs', 'Gaming Chairs'] },
          { id: 'office-storage', name: 'Storage', productTypes: ['File Cabinets', 'Bookcases', 'Storage Carts', 'Desk Organizers'] },
          { id: 'conference', name: 'Conference Room', productTypes: ['Conference Tables', 'Presentation Boards', 'AV Stands'] }
        ]
      },
      {
        id: 'office-supplies',
        name: 'Office Supplies',
        subcategories: [
          { id: 'writing', name: 'Writing & Drawing', productTypes: ['Pens', 'Pencils', 'Markers', 'Notebooks', 'Journals'] },
          { id: 'organization', name: 'Organization', productTypes: ['Folders', 'Binders', 'Labels', 'Desk Trays'] },
          { id: 'paper-products', name: 'Paper Products', productTypes: ['Printer Paper', 'Sticky Notes', 'Envelopes', 'Business Cards'] },
          { id: 'tech-accessories', name: 'Tech Accessories', productTypes: ['Cable Organizers', 'Monitor Stands', 'Laptop Stands', 'Desk Pads'] }
        ]
      },
      {
        id: 'office-tech',
        name: 'Office Technology',
        subcategories: [
          { id: 'printers', name: 'Printers & Scanners', productTypes: ['Inkjet Printers', 'Laser Printers', 'All-in-One', '3D Printers'] },
          { id: 'shredders', name: 'Shredders', productTypes: ['Paper Shredders', 'Cross-Cut', 'Micro-Cut', 'Industrial'] },
          { id: 'calculators', name: 'Calculators', productTypes: ['Scientific', 'Financial', 'Basic', 'Printing Calculators'] },
          { id: 'phones', name: 'Office Phones', productTypes: ['VoIP Phones', 'Conference Phones', 'Cordless', 'Headsets'] }
        ]
      }
    ]
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    categories: [
      {
        id: 'garden',
        name: 'Garden',
        subcategories: [
          { id: 'gardening-tools', name: 'Gardening Tools', productTypes: ['Hand Tools', 'Power Tools', 'Watering Equipment', 'Wheelbarrows'] },
          { id: 'planters-pots', name: 'Planters & Pots', productTypes: ['Ceramic Pots', 'Plastic Planters', 'Raised Beds', 'Window Boxes'] },
          { id: 'seeds-plants', name: 'Seeds & Plants', productTypes: ['Flower Seeds', 'Vegetable Seeds', 'Herbs', 'Bulbs'] },
          { id: 'fertilizers', name: 'Fertilizers & Soil', productTypes: ['Organic Fertilizers', 'Potting Soil', 'Mulch', 'Compost'] }
        ]
      },
      {
        id: 'patio-furniture',
        name: 'Patio Furniture',
        subcategories: [
          { id: 'seating', name: 'Outdoor Seating', productTypes: ['Patio Sets', 'Lounge Chairs', 'Benches', 'Hammocks'] },
          { id: 'dining', name: 'Outdoor Dining', productTypes: ['Dining Sets', 'Picnic Tables', 'Bar Sets', 'Serving Carts'] },
          { id: 'shade', name: 'Shade & Shelter', productTypes: ['Umbrellas', 'Gazebos', 'Pergolas', 'Canopies'] },
          { id: 'heating', name: 'Heating & Fire', productTypes: ['Fire Pits', 'Patio Heaters', 'Chimineas', 'Outdoor Fireplaces'] }
        ]
      },
      {
        id: 'outdoor-recreation',
        name: 'Recreation',
        subcategories: [
          { id: 'grills', name: 'Grills & BBQ', productTypes: ['Gas Grills', 'Charcoal Grills', 'Electric Grills', 'Smokers'] },
          { id: 'pools-spas', name: 'Pools & Spas', productTypes: ['Above Ground Pools', 'Hot Tubs', 'Pool Equipment', 'Pool Toys'] },
          { id: 'games', name: 'Outdoor Games', productTypes: ['Cornhole', 'Badminton', 'Volleyball', 'Bocce Ball'] },
          { id: 'camping', name: 'Camping', productTypes: ['Tents', 'Sleeping Bags', 'Camping Chairs', 'Coolers'] }
        ]
      }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics',
    categories: [
      {
        id: 'computers',
        name: 'Computers',
        subcategories: [
          { id: 'laptops', name: 'Laptops', productTypes: ['Business Laptops', 'Gaming Laptops', 'Ultrabooks', 'Chromebooks'] },
          { id: 'desktops', name: 'Desktop PCs', productTypes: ['All-in-One', 'Tower PCs', 'Mini PCs', 'Workstations'] },
          { id: 'tablets', name: 'Tablets', productTypes: ['iPads', 'Android Tablets', 'E-Readers', 'Drawing Tablets'] },
          { id: 'peripherals', name: 'Peripherals', productTypes: ['Monitors', 'Keyboards', 'Mice', 'Webcams', 'Speakers'] }
        ]
      },
      {
        id: 'audio',
        name: 'Audio',
        subcategories: [
          { id: 'headphones', name: 'Headphones', productTypes: ['Over-Ear', 'On-Ear', 'In-Ear', 'Wireless Earbuds'] },
          { id: 'speakers', name: 'Speakers', productTypes: ['Bluetooth Speakers', 'Bookshelf Speakers', 'Soundbars', 'Party Speakers'] },
          { id: 'home-audio', name: 'Home Audio', productTypes: ['Receivers', 'Amplifiers', 'Turntables', 'CD Players'] },
          { id: 'pro-audio', name: 'Pro Audio', productTypes: ['Studio Monitors', 'Microphones', 'Audio Interfaces', 'Mixers'] }
        ]
      },
      {
        id: 'tv-video',
        name: 'TV & Video',
        subcategories: [
          { id: 'televisions', name: 'TVs', productTypes: ['4K TVs', 'OLED TVs', 'Smart TVs', 'Outdoor TVs'] },
          { id: 'streaming', name: 'Streaming Devices', productTypes: ['Roku', 'Apple TV', 'Chromecast', 'Fire TV'] },
          { id: 'projectors', name: 'Projectors', productTypes: ['Home Theater', 'Portable', 'Business', '4K Projectors'] },
          { id: 'accessories', name: 'TV Accessories', productTypes: ['TV Mounts', 'Remotes', 'HDMI Cables', 'Antennas'] }
        ]
      },
      {
        id: 'gaming',
        name: 'Gaming',
        subcategories: [
          { id: 'consoles', name: 'Game Consoles', productTypes: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Retro Consoles'] },
          { id: 'pc-gaming', name: 'PC Gaming', productTypes: ['Graphics Cards', 'Gaming Mice', 'Gaming Keyboards', 'Gaming Chairs'] },
          { id: 'vr', name: 'VR Gaming', productTypes: ['VR Headsets', 'VR Controllers', 'VR Accessories'] },
          { id: 'games', name: 'Video Games', productTypes: ['PS5 Games', 'Xbox Games', 'Switch Games', 'PC Games'] }
        ]
      }
    ]
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    categories: [
      {
        id: 'security',
        name: 'Security',
        subcategories: [
          { id: 'cameras', name: 'Security Cameras', productTypes: ['Indoor Cameras', 'Outdoor Cameras', 'Doorbell Cameras', 'PTZ Cameras'] },
          { id: 'alarms', name: 'Alarm Systems', productTypes: ['Smart Alarms', 'Motion Sensors', 'Door Sensors', 'Glass Break Sensors'] },
          { id: 'locks', name: 'Smart Locks', productTypes: ['Deadbolts', 'Lever Handles', 'Padlocks', 'Lock Boxes'] },
          { id: 'monitoring', name: 'Monitoring', productTypes: ['Security Hubs', 'NVR Systems', 'Video Doorbells', 'Smart Safes'] }
        ]
      },
      {
        id: 'automation',
        name: 'Home Automation',
        subcategories: [
          { id: 'hubs', name: 'Smart Hubs', productTypes: ['SmartThings', 'Hubitat', 'Home Assistant', 'Alexa Hubs'] },
          { id: 'voice-assistants', name: 'Voice Assistants', productTypes: ['Amazon Echo', 'Google Home', 'Apple HomePod', 'Smart Displays'] },
          { id: 'switches', name: 'Smart Switches', productTypes: ['Light Switches', 'Dimmer Switches', 'Motion Switches', 'Remote Controls'] },
          { id: 'plugs', name: 'Smart Plugs', productTypes: ['WiFi Plugs', 'Outdoor Plugs', 'Power Strips', 'USB Outlets'] }
        ]
      },
      {
        id: 'climate',
        name: 'Climate Control',
        subcategories: [
          { id: 'thermostats', name: 'Smart Thermostats', productTypes: ['Nest', 'Ecobee', 'Honeywell', 'Sensi'] },
          { id: 'air-quality', name: 'Air Quality', productTypes: ['Air Purifiers', 'Humidifiers', 'Dehumidifiers', 'Air Monitors'] },
          { id: 'fans', name: 'Smart Fans', productTypes: ['Ceiling Fans', 'Tower Fans', 'Pedestal Fans', 'Exhaust Fans'] },
          { id: 'hvac', name: 'HVAC Controls', productTypes: ['Zone Controllers', 'Smart Vents', 'AC Controllers', 'Furnace Controls'] }
        ]
      }
    ]
  },
  {
    id: 'pets',
    name: 'Pets',
    categories: [
      {
        id: 'dog-supplies',
        name: 'Dog Supplies',
        subcategories: [
          { id: 'dog-food', name: 'Food & Treats', productTypes: ['Dry Food', 'Wet Food', 'Treats', 'Bones & Chews'] },
          { id: 'dog-toys', name: 'Toys', productTypes: ['Chew Toys', 'Fetch Toys', 'Rope Toys', 'Puzzle Toys'] },
          { id: 'dog-beds', name: 'Beds & Furniture', productTypes: ['Dog Beds', 'Crates', 'Dog Houses', 'Car Seats'] },
          { id: 'dog-grooming', name: 'Grooming', productTypes: ['Brushes', 'Shampoos', 'Nail Clippers', 'Grooming Tables'] }
        ]
      },
      {
        id: 'cat-supplies',
        name: 'Cat Supplies',
        subcategories: [
          { id: 'cat-food', name: 'Food & Treats', productTypes: ['Dry Food', 'Wet Food', 'Treats', 'Cat Grass'] },
          { id: 'cat-toys', name: 'Toys', productTypes: ['Catnip Toys', 'Feather Toys', 'Laser Pointers', 'Scratching Posts'] },
          { id: 'cat-furniture', name: 'Furniture', productTypes: ['Cat Trees', 'Cat Beds', 'Window Perches', 'Cat Condos'] },
          { id: 'litter', name: 'Litter & Accessories', productTypes: ['Cat Litter', 'Litter Boxes', 'Litter Mats', 'Scoops'] }
        ]
      },
      {
        id: 'small-pets',
        name: 'Small Pets',
        subcategories: [
          { id: 'cages', name: 'Cages & Habitats', productTypes: ['Hamster Cages', 'Rabbit Hutches', 'Bird Cages', 'Aquariums'] },
          { id: 'small-food', name: 'Food & Treats', productTypes: ['Pellets', 'Seeds', 'Hay', 'Treats'] },
          { id: 'bedding', name: 'Bedding', productTypes: ['Wood Shavings', 'Paper Bedding', 'Fleece Liners', 'Nesting Material'] },
          { id: 'accessories', name: 'Accessories', productTypes: ['Water Bottles', 'Food Bowls', 'Exercise Wheels', 'Hideouts'] }
        ]
      },
      {
        id: 'aquarium',
        name: 'Aquarium',
        subcategories: [
          { id: 'tanks', name: 'Tanks & Stands', productTypes: ['Glass Tanks', 'Acrylic Tanks', 'Nano Tanks', 'Tank Stands'] },
          { id: 'filtration', name: 'Filtration', productTypes: ['Filters', 'Pumps', 'Protein Skimmers', 'UV Sterilizers'] },
          { id: 'decoration', name: 'Decorations', productTypes: ['Artificial Plants', 'Rocks', 'Driftwood', 'Ornaments'] },
          { id: 'fish-care', name: 'Fish Care', productTypes: ['Fish Food', 'Water Conditioners', 'Medications', 'Test Kits'] }
        ]
      }
    ]
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    categories: [
      {
        id: 'fitness',
        name: 'Fitness Equipment',
        subcategories: [
          { id: 'cardio', name: 'Cardio Equipment', productTypes: ['Treadmills', 'Exercise Bikes', 'Ellipticals', 'Rowing Machines'] },
          { id: 'strength', name: 'Strength Training', productTypes: ['Dumbbells', 'Barbells', 'Weight Benches', 'Power Racks'] },
          { id: 'yoga', name: 'Yoga & Pilates', productTypes: ['Yoga Mats', 'Blocks', 'Straps', 'Pilates Reformers'] },
          { id: 'accessories', name: 'Fitness Accessories', productTypes: ['Resistance Bands', 'Foam Rollers', 'Jump Ropes', 'Gym Bags'] }
        ]
      },
      {
        id: 'personal-care',
        name: 'Personal Care',
        subcategories: [
          { id: 'skin-care', name: 'Skin Care', productTypes: ['Moisturizers', 'Cleansers', 'Serums', 'Masks'] },
          { id: 'hair-care', name: 'Hair Care', productTypes: ['Shampoos', 'Conditioners', 'Hair Tools', 'Styling Products'] },
          { id: 'oral-care', name: 'Oral Care', productTypes: ['Electric Toothbrushes', 'Water Flossers', 'Toothpaste', 'Mouthwash'] },
          { id: 'grooming', name: 'Grooming', productTypes: ['Shavers', 'Trimmers', 'Grooming Kits', 'Nail Care'] }
        ]
      },
      {
        id: 'medical',
        name: 'Medical Supplies',
        subcategories: [
          { id: 'monitoring', name: 'Health Monitoring', productTypes: ['Blood Pressure Monitors', 'Thermometers', 'Pulse Oximeters', 'Scales'] },
          { id: 'mobility', name: 'Mobility Aids', productTypes: ['Walkers', 'Canes', 'Wheelchairs', 'Crutches'] },
          { id: 'first-aid', name: 'First Aid', productTypes: ['First Aid Kits', 'Bandages', 'Antiseptics', 'Medical Tape'] },
          { id: 'therapy', name: 'Therapy Products', productTypes: ['Hot/Cold Packs', 'TENS Units', 'Massagers', 'Compression Wear'] }
        ]
      },
      {
        id: 'nutrition',
        name: 'Nutrition',
        subcategories: [
          { id: 'supplements', name: 'Supplements', productTypes: ['Vitamins', 'Minerals', 'Protein Powders', 'Probiotics'] },
          { id: 'sports-nutrition', name: 'Sports Nutrition', productTypes: ['Pre-Workout', 'BCAAs', 'Creatine', 'Energy Bars'] },
          { id: 'weight-management', name: 'Weight Management', productTypes: ['Meal Replacements', 'Fat Burners', 'Appetite Control', 'Detox'] },
          { id: 'wellness', name: 'Wellness Products', productTypes: ['Essential Oils', 'Aromatherapy', 'Herbal Teas', 'Superfoods'] }
        ]
      }
    ]
  }
];