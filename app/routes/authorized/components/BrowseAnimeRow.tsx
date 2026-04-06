import type { BrowseAnimeMediaList } from "~/store/mediaApi";
import BrowseAnimeCard from "./BrowseAnimeCard";

export default function BrowseAnimeRow({
  list,
}: {
  list: BrowseAnimeMediaList;
}) {
  return (
    <div>
      {list.map((media) => (
        <BrowseAnimeCard key={media.id} media={media} />
      ))}
    </div>
  );
}
