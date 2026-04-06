import type { BrowseAnimeMedia } from "~/store/mediaApi";

export default function BrowseAnimeCard({
  media,
}: {
  media: BrowseAnimeMedia;
}) {
  const title = media.title?.userPreferred ?? "";
  const coverSrc = media.coverImage?.large ?? undefined;

  return (
    <div className="relative inline-block w-[185px] h-[265px] overflow-hidden">
      <img
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        src={coverSrc}
      />
    </div>
  );
}
