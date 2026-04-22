/**
 * Draco Coffee and Eatery - Complete Menu
 * Converted from client-info/menu.md
 */

export interface MenuItem {
  name: string;
  description: string;
  price: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji?: string;
  items: MenuItem[];
}

export const DRACO_MENU: MenuCategory[] = [
  {
    id: "pastry",
    name: "PASTRY",
    emoji: "🥐",
    items: [
      { name: "Almond Croissant", description: "", price: "30K" },
      { name: "Croissant Cheese", description: "", price: "30K" },
      { name: "Chocolatine", description: "", price: "30K" },
      { name: "Apple Slipper Butter Croissant", description: "", price: "30K" },
    ],
  },
  {
    id: "breakfast",
    name: "BREAKFAST",
    emoji: "🍳",
    items: [
      {
        name: "Egg Any Style",
        description: "Omelette / Scramble / Sunny side up, with salad on the side",
        price: "25K",
      },
      {
        name: "Croissant Sandwich",
        description: "Croissant, egg any style, salad on the side",
        price: "30K",
      },
      {
        name: "Draco Breakfast",
        description: "Grilled bread, spinach, egg any style, sautéed mushroom, sausage",
        price: "45K",
      },
      {
        name: "Smashed Avo",
        description: "Grilled bread, guacamole, roasted tomato, salad on the side",
        price: "45K",
      },
    ],
  },
  {
    id: "rice-bowl",
    name: "RICE BOWL",
    emoji: "🍚",
    items: [
      {
        name: "Chicken Cabai Garam",
        description: "Fried chicken garlic, chop chilli, garlic & salt, lettuce, mix vegetable, egg, steam rice",
        price: "30K",
      },
      {
        name: "Chicken Katsu",
        description: "Crispy fried chicken, egg, lettuce, mix vegetable, teriyaki sauce, steam rice",
        price: "30K",
      },
      {
        name: "Chicken Teriyaki",
        description: "Grilled chicken, egg, mix vegetable, lettuce, teriyaki sauce, steam rice",
        price: "30K",
      },
      {
        name: "Beef Teriyaki",
        description: "Grilled beef, egg, mix vegetable, lettuce, teriyaki sauce, steam rice",
        price: "30K",
      },
      {
        name: "Chicken Salted Egg",
        description: "Crispy fried chicken, egg, lettuce, mix vegetable, salted egg sauce, steam rice",
        price: "30K",
      },
      {
        name: "Chicken Black Pepper",
        description: "Crispy fried chicken, egg, lettuce, mix vegetable, black pepper sauce, steam rice",
        price: "30K",
      },
      {
        name: "Beef Black Pepper",
        description: "Crispy fried beef, egg, lettuce, mix vegetable, black pepper sauce, steam rice",
        price: "30K",
      },
      {
        name: "Chicken Sambal Matah",
        description: "Crispy fried chicken, egg, lettuce, mix vegetable, Balinese sambal matah, steam rice",
        price: "30K",
      },
    ],
  },
  {
    id: "to-share",
    name: "TO SHARE",
    emoji: "🍟",
    items: [
      {
        name: "Home Made Potato Wedges",
        description: "With spicy mayo",
        price: "30K",
      },
      {
        name: "Ayam Cabai Garam",
        description: "Fried chicken garlic, chop chilli, garlic & salt",
        price: "30K",
      },
      {
        name: "Singkong Cabai Garam",
        description: "Fried cassava, chop chili, garlic & salt",
        price: "30K",
      },
      {
        name: "Onion Ring",
        description: "Fried crispy onion with spicy mayo",
        price: "30K",
      },
      {
        name: "Home Made Crispy Calamari",
        description: "Fried crispy calamari with spicy mayo",
        price: "30K",
      },
    ],
  },
  {
    id: "indonesian",
    name: "INDONESIAN",
    emoji: "🍜",
    items: [
      {
        name: "Fried Rice Chicken",
        description: "Served with egg, oyster sauce, chicken",
        price: "30K",
      },
      {
        name: "Fried Rice Seafood",
        description: "Served with egg, oyster sauce, prawn and calamari",
        price: "35K",
      },
      {
        name: "Fried Noodle Chicken",
        description: "Served with egg, oyster sauce, chicken",
        price: "30K",
      },
      {
        name: "Fried Noodle Seafood",
        description: "Served with egg, oyster sauce, prawn and calamari",
        price: "35K",
      },
      {
        name: "Nasi Bakar Ayam",
        description: "Banana leaves filled with Kemangi (Thai basil), grilled chicken",
        price: "29K",
      },
      {
        name: "Nasi Bakar Cumi",
        description: "Banana leaves filled with Kemangi (Thai basil), grilled calamari",
        price: "35K",
      },
    ],
  },
  {
    id: "pizza",
    name: "PIZZA",
    emoji: "🍕",
    items: [
      {
        name: "Margarita Pizza",
        description: "Homemade Draco sauce, tomato and basil",
        price: "85K",
      },
      {
        name: "Cheese Pizza",
        description: "Homemade Draco sauce, parmesan cheese",
        price: "95K",
      },
      {
        name: "Meat Lover Pizza",
        description: "Homemade Draco sauce, ham, bacon, chicken, and sausage",
        price: "95K",
      },
    ],
  },
  {
    id: "pasta",
    name: "PASTA",
    emoji: "🍝",
    items: [
      {
        name: "Spaghetti Carbonara",
        description: "Homemade cream sauce, ham, egg yolk, garlic bread",
        price: "45K",
      },
      {
        name: "Spaghetti Aglio Olio",
        description: "Prawn, garlic, salad oil, basil",
        price: "45K",
      },
      {
        name: "Spaghetti Marinara",
        description: "Draco sauce, seasonal seafood, cherry tomato, fresh basil",
        price: "45K",
      },
    ],
  },
  {
    id: "burgers",
    name: "BURGERS",
    emoji: "🍔",
    items: [
      {
        name: "Chicken Burger",
        description: "Homemade chicken patty, pickles, mayonnaise, cocktail sauce, potato wedges, iceberg lettuce",
        price: "45K",
      },
      {
        name: "Beef Burger",
        description: "Homemade beef patty, iceberg lettuce, tomato, cheese, caramelized onion, potato wedges",
        price: "65K",
      },
    ],
  },
  {
    id: "desserts",
    name: "SWEET TEMPTATION",
    emoji: "🍌",
    items: [
      {
        name: "Pisang Goreng Original",
        description: "Traditional fried banana",
        price: "25K",
      },
      {
        name: "Tropical Pancake",
        description: "",
        price: "35K",
      },
    ],
  },
  {
    id: "coffee",
    name: "COFFEE",
    emoji: "☕",
    items: [
      {
        name: "Black Coffee (Hot/Iced)",
        description: "Espresso, Americano, Long Black",
        price: "HOT: 25K | ICED: 28K",
      },
      {
        name: "White Coffee",
        description: "Macchiato, Piccolo, Flat White, Latte, Cappuccino",
        price: "28K",
      },
      {
        name: "Scoop",
        description: "Affogato, Frappuccino, Iced Chocolate, Iced Coffee, Iced Matcha Latte (with ice cream)",
        price: "35K",
      },
      {
        name: "Matcha Latte",
        description: "",
        price: "35K",
      },
      {
        name: "Mochaccino",
        description: "",
        price: "28K",
      },
      {
        name: "Chocolate",
        description: "",
        price: "28K",
      },
      {
        name: "Take A Shake",
        description: "Blended with ice cream and milk. Flavors: Chocolate, Vanilla, Banana, Strawberry, Cookies Crunch",
        price: "35K",
      },
    ],
  },
  {
    id: "tea",
    name: "TEA",
    emoji: "🍵",
    items: [
      {
        name: "Hot/Iced Tea",
        description: "English Breakfast, Jasmine, Peppermint, Herbal",
        price: "25K",
      },
      {
        name: "Refreshing Tea",
        description: "Lemon, Lychee, Strawberry",
        price: "25K",
      },
      {
        name: "Milk Tea",
        description: "",
        price: "25K",
      },
    ],
  },
  {
    id: "juice",
    name: "JUICE",
    emoji: "🍹",
    items: [
      {
        name: "Fresh Juice",
        description: "Orange, Lime, Mango, Strawberry, Pineapple, Dragon Fruit, Watermelon",
        price: "25K",
      },
    ],
  },
  {
    id: "booster",
    name: "BOOSTER DRINKS",
    emoji: "🥤",
    items: [
      {
        name: "Booster",
        description: "Apple, Carrot, Beetroot, Pineapple, Kale, Kiwi",
        price: "28K",
      },
      {
        name: "Green Detox",
        description: "Pakcoy, Pineapple, Lime",
        price: "35K",
      },
      {
        name: "Antioxidant Booster",
        description: "Banana, Orange, Strawberry",
        price: "35K",
      },
      {
        name: "Body Fit",
        description: "Banana, Pakcoy, Milk, Almond, Honey",
        price: "35K",
      },
    ],
  },
  {
    id: "smoothies",
    name: "SMOOTHIES",
    emoji: "🍓",
    items: [
      {
        name: "Basic Smoothies",
        description: "Banana, Mango, Strawberry, Avocado, Pineapple, Mix Berries",
        price: "30K",
      },
      {
        name: "365 Kumbasari",
        description: "Banana, Mix Berries, Yogurt, Honey, Milk",
        price: "39K",
      },
      {
        name: "Mango Mint",
        description: "Mango, Mint Leaf, Yogurt, Honey, Milk",
        price: "39K",
      },
      {
        name: "Pineberry",
        description: "Pineapple, Mango, Strawberry, Yogurt, Honey, Milk",
        price: "39K",
      },
      {
        name: "Bedugul Sensation",
        description: "Strawberry, Kiwi, Yogurt, Honey, Milk",
        price: "39K",
      },
      {
        name: "Avo.Co",
        description: "Avocado, Yogurt, Honey, Milk",
        price: "39K",
      },
    ],
  },
  {
    id: "mocktails",
    name: "MOCKTAILS",
    emoji: "🍹",
    items: [
      { name: "Soda Gembira", description: "", price: "30K" },
      { name: "Draco Float", description: "", price: "30K" },
      { name: "Virgin Mojito", description: "", price: "30K" },
    ],
  },
  {
    id: "beer",
    name: "BEER",
    emoji: "🍺",
    items: [
      { name: "Singaraja Small", description: "", price: "25K" },
      { name: "Singaraja Tower", description: "", price: "195K" },
    ],
  },
  {
    id: "cocktails",
    name: "COCKTAILS",
    emoji: "🍸",
    items: [
      {
        name: "Arani",
        description: "Local Spirit, Lime, Honey",
        price: "32K",
      },
      {
        name: "Blue Ocean",
        description: "Local Spirit, Lime, Blue Curaçao, Soda water",
        price: "37K",
      },
      {
        name: "Banana Comet",
        description: "Local Spirit, Espresso, Banana, Milk, Tiramisu",
        price: "37K",
      },
      {
        name: "Red Lips",
        description: "Arak, Dragon Fruit, Blue Curaçao, Lime juice, Soda water",
        price: "37K",
      },
      {
        name: "Basil Sin City",
        description: "Local Spirit, Mango, Basil, Lime, Sugar",
        price: "37K",
      },
      {
        name: "Espresso Martini",
        description: "Local Spirit, Espresso, Tiramisu, Sugar",
        price: "37K",
      },
      {
        name: "Cupid",
        description: "Local Spirit, Lime Juice, Sugar, Pineapple Slice",
        price: "37K",
      },
      {
        name: "Happy Shake",
        description: "Local Spirit, Pineapple Juice, Lychee, Lime, Sugar",
        price: "37K",
      },
      {
        name: "Tropical Passion (Pitcher)",
        description: "Arak, Passion fruit, Lime juice, Pineapple juice, Mint leaf, Soda water",
        price: "78K",
      },
      {
        name: "Tiki Tropical (Pitcher)",
        description: "Arak, Palm sugar, Lychee syrup, Honey syrup, Lime juice, Pineapple juice, Soda water",
        price: "83K",
      },
      {
        name: "Magic Purple (Pitcher)",
        description: "Local Spirit, Mix Berries, Dragon Fruit, Lime, Sugar",
        price: "78K",
      },
    ],
  },
];
