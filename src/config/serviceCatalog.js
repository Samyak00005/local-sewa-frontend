import {
  AirVentIcon,
  CarFrontIcon,
  CleanIcon,
  DropletsIcon,
  FlashIcon,
  GridViewIcon,
  HammerIcon,
} from "@hugeicons/core-free-icons";

const servicePresentation = {
  electrician: {
    icon: FlashIcon,
    description: "Wiring, switches, fans and electrical repairs.",
  },
  plumber: {
    icon: DropletsIcon,
    description: "Leak repairs, fittings and plumbing maintenance.",
  },
  carpenter: {
    icon: HammerIcon,
    description: "Furniture repair and custom wood work.",
  },
  cleaning: {
    icon: CleanIcon,
    description: "Reliable home and office cleaning services.",
  },
  "ac-repair": {
    icon: AirVentIcon,
    description: "AC servicing, installation and quick repairs.",
  },
  mechanic: {
    icon: CarFrontIcon,
    description: "Vehicle inspection, servicing and repair.",
  },
};

const iconGroups = [
  {
    icon: FlashIcon,
    slugs: [
      "electrician",
      "appliance-repair",
      "tv-repair",
      "computer-laptop-repair",
      "mobile-repair",
      "printer-repair",
      "cctv-security",
      "solar-services",
      "generator-inverter",
    ],
  },
  {
    icon: DropletsIcon,
    slugs: [
      "plumber",
      "ro-water-purifier",
      "water-tank-cleaning",
      "bathroom-cleaning",
      "borewell-pump",
      "waterproofing",
    ],
  },
  {
    icon: HammerIcon,
    slugs: [
      "carpenter",
      "locksmith",
      "painter",
      "mason-construction",
      "interior-designer",
      "architect",
      "furniture-assembly",
      "welder-fabricator",
      "glass-aluminium",
      "tailor",
    ],
  },
  {
    icon: CleanIcon,
    slugs: [
      "cleaning",
      "pest-control",
      "gardening",
      "sofa-carpet-cleaning",
      "laundry-dry-cleaning",
      "beautician",
      "salon-haircut",
      "makeup-artist",
      "mehndi-artist",
      "massage-spa",
      "domestic-help",
    ],
  },
  {
    icon: AirVentIcon,
    slugs: [
      "ac-repair",
      "refrigerator-repair",
      "washing-machine-repair",
      "geyser-repair",
    ],
  },
  {
    icon: CarFrontIcon,
    slugs: [
      "mechanic",
      "driver",
      "taxi-cab",
      "bike-service",
      "car-wash",
      "packers-movers",
      "courier-delivery",
    ],
  },
];

const groupedIcons = iconGroups.reduce((lookup, group) => {
  group.slugs.forEach((slug) => {
    lookup[slug] = group.icon;
  });
  return lookup;
}, {});

export function getServicePresentation(category = {}) {
  const slug = typeof category === "string" ? category : category.slug;
  const name =
    typeof category === "string"
      ? slug
          .replaceAll("-", " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : category.name;

  return {
    slug,
    name: name || "Local Service",
    icon: servicePresentation[slug]?.icon || groupedIcons[slug] || GridViewIcon,
    description:
      servicePresentation[slug]?.description ||
      `Find trusted ${name || "service"} professionals near you.`,
  };
}
