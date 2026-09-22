type SocialNetwork = "facebook" | "twitter" | "instagram" | "youtube" | "whatsapp";

export function SocialIcon({ network }: { network: SocialNetwork }) {
  const labels: Record<SocialNetwork, string> = {
    facebook: "f",
    twitter: "𝕏",
    instagram: "IG",
    youtube: "YT",
    whatsapp: "WA",
  };

  return (
    <span className="inline-flex h-full w-full items-center justify-center text-xs font-bold">
      {labels[network]}
    </span>
  );
}
