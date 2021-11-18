import { getBanners } from "@/api/home";
import { ref } from "vue";

export default function useBanners() {
  const banners = ref();
  const getData = (distributionSite) => {
    getBanners(distributionSite).then((res) => {
      banners.value = res.result;
    });
  };
  return { banners, getData };
}
