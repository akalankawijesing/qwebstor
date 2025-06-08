import HeroSlider from "@/components/layout/HeroSlider";
import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/sanity/lib/client";


export default async function Home() {

  const products = await getAllProducts();
  

  return (
    <>
    <SalesCampaignBanner/>
    <HeroSlider/>
    <ProductGrid products={products} />
    </>
  );
}

