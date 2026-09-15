/**
 * Editorial seed data — Unsplash hero images (free to hotlink for dev).
 */
export const SEED_IMAGES = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "https://images.pexels.com/photos/6476259/pexels-photo-6476259.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

export const SEED_CATEGORIES = [
  { name: "World", slug: "world", displayOrder: 1, description: "Global news and international affairs." },
  { name: "Politics", slug: "politics", displayOrder: 2, description: "Policy, elections, and government." },
  { name: "Business", slug: "business", displayOrder: 3, description: "Companies, markets, and the economy." },
  { name: "Markets", slug: "markets", displayOrder: 4, description: "Stocks, bonds, and trading." },
  { name: "Opinion", slug: "opinion", displayOrder: 5, description: "Editorials and columnists." },
  { name: "Technology", slug: "technology", displayOrder: 6, description: "Tech industry and innovation." },
  { name: "Science", slug: "science", displayOrder: 7, description: "Research and discovery." },
  { name: "Sports", slug: "sports", displayOrder: 8, description: "Scores, leagues, and athletes." },
  { name: "Arts", slug: "arts", displayOrder: 9, description: "Culture and the arts." },
  { name: "Entertainment", slug: "entertainment", displayOrder: 10, description: "Film, television, and media." },
  { name: "Style", slug: "style", displayOrder: 11, description: "Fashion and design." },
  { name: "Food", slug: "food", displayOrder: 12, description: "Dining and culinary trends." },
  { name: "Travel", slug: "travel", displayOrder: 13, description: "Destinations and hospitality." },
  { name: "Health", slug: "health", displayOrder: 14, description: "Medicine and public health." },
];

export const SEED_AUTHORS = [
  { name: "John Doe", role: "Senior Political Correspondent" },
  { name: "Maria Chen", role: "Markets Reporter" },
  { name: "James Whitfield", role: "World Affairs Editor" },
  { name: "Priya Sharma", role: "Technology Columnist" },
  { name: "Elena Rossi", role: "Investigations Reporter" },
  { name: "David Okonkwo", role: "Business Editor" },
  { name: "Sarah Klein", role: "Science & Health Writer" },
  { name: "Tom Bradley", role: "Sports Desk" },
];

export const HEADLINE_TEMPLATES: Record<string, string[]> = {
  world: [
    "UN Brokers Fragile Ceasefire After Week of Border Clashes",
    "Migration Pact Divides EU Leaders Ahead of Summit Vote",
    "Pacific Nations Agree on Climate Financing Framework",
    "Aid Convoys Resume After Port Reopens in Conflict Zone",
  ],
  politics: [
    "Nicola Sturgeon Reported to Police Over Apparent Face Mask Law Breach",
    "Coalition Talks Stall as Minor Parties Demand Cabinet Seats",
    "Senate Panel Advances Bill on Digital Privacy Protections",
    "Local Elections Signal Shift in Suburban Voting Patterns",
  ],
  business: [
    "Manufacturers Cut Outlook as Input Costs Remain Elevated",
    "Retailers Stock Up Early to Avoid Supply Chain Bottlenecks",
    "Private Equity Firms Circle Distressed Commercial Real Estate",
    "Union Vote at Major Automaker Enters Final Stretch",
  ],
  markets: [
    "Eskom to Implement Power Cuts From Today Until Next Week",
    "Treasury Yields Climb After Inflation Data Beats Forecasts",
    "Oil Holds Gains as OPEC+ Signals Extended Output Discipline",
    "Asian Stocks Rise on Hopes of Stimulus in Major Economies",
  ],
  opinion: [
    "Why Industrial Policy Needs a Harder Look at Competition",
    "The Case for Letting Cities Set Their Own Housing Rules",
    "Editorial: Institutions Must Earn Trust, Not Demand It",
  ],
  technology: [
    "Chipmakers Race to Ship AI Accelerators Amid Capacity Crunch",
    "Regulators Probe App Store Fees in Multiple Jurisdictions",
    "Open-Source Models Close Gap With Proprietary AI Systems",
    "Cybersecurity Firms Warn of Surge in Ransomware Attacks",
  ],
  science: [
    "Telescope Array Detects Unexpected Signals From Distant Galaxy",
    "Clinical Trial Shows Promise for New Alzheimer's Therapy",
    "Researchers Map Ocean Heat Absorption With Unprecedented Detail",
  ],
  sports: [
    "Champions League Quarterfinal Draw Sets Up Blockbuster Clashes",
    "Star Quarterback Agrees to Record Extension Before Deadline",
    "Olympic Organizers Unveil Updated Security Plan for Games",
  ],
  arts: [
    "Major Museum Restores Controversial Work After Public Debate",
    "Film Festival Opens With Premiere Tackling Political Corruption",
  ],
  entertainment: [
    "For 'Fantastic Beasts' Series, a Case of Diminishing Returns",
    "Streaming Giants Raise Prices as Subscriber Growth Slows",
    "Studio Delays Blockbuster Release Amid Postproduction Setbacks",
  ],
  style: [
    "Design Houses Bet on Quiet Luxury for Fall Collections",
    "Vintage Markets Boom as Shoppers Seek Sustainable Fashion",
  ],
  food: [
    "Michelin Guide Expands List With Regional Street Food Stars",
    "Coffee Prices Surge as Harvests Disappoint in Key Regions",
  ],
  travel: [
    "A New Cruise Ship Is Redefining Luxury in the Galápagos",
    "Airlines Add Routes as Trans-Pacific Demand Rebounds",
  ],
  health: [
    "WHO Updates Guidance on Long Covid Treatment Pathways",
    "Hospital Systems Invest in At-Home Monitoring Programs",
  ],
};

export function buildArticleBody(title: string, category: string): string {
  const lead = title.split(" ").slice(0, 1)[0]?.charAt(0) ?? "T";
  return `
<p><strong>${lead}</strong>he story unfolding in ${category} circles this week has drawn scrutiny from policymakers, investors, and the public alike. Officials say the developments could reshape priorities for months to come, though details remain in flux as negotiations continue behind closed doors.</p>
<p>Analysts note that the situation reflects broader pressures facing the sector, from shifting consumer demand to regulatory headwinds. Several experts interviewed for this report cautioned against drawing firm conclusions until more data is released.</p>
<h2>What Happens Next</h2>
<p>Stakeholders are preparing for a series of announcements expected over the coming days. Markets have already priced in a cautious outlook, while advocacy groups are calling for greater transparency.</p>
<blockquote>It is essential that those who set the rules are seen to be following them. This apparent lapse in judgment undermines the public message.</blockquote>
<p>Representatives for the parties involved did not immediately respond to requests for comment late Sunday. This article will be updated as new information becomes available.</p>
`.trim();
}
