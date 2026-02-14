import Link from "next/link";

import type { MessageDictionary } from "@/types/messages";

import { getMessage } from "@/helpers/messages";
import messages from "@/messages/en.json";

export default function NotFound() {
  const copy = messages as MessageDictionary;

  return (
    <div>
      <h2>{getMessage(copy, "NotFound.title")}</h2>
      <p>{getMessage(copy, "NotFound.description")}</p>
      <Link href="/">{getMessage(copy, "NotFound.action")}</Link>
    </div>
  );
}
