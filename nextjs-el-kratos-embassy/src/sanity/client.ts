import { createClient } from "next-sanity";
import {createImageUrlBuilder, SanityImageSource } from "@sanity/image-url";


export const client = createClient({
  projectId: "2se5hsfj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// helper: builds image URLs from a Sanity image source
const builder = createImageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);
