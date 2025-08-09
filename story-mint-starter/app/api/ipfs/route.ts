import { NextRequest } from "next/server";
import { Web3Storage, File } from "web3.storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, imageBase64 } = body as { name: string; description: string; imageBase64?: string };

    const token = process.env.WEB3_STORAGE_TOKEN;
    if (!token) {
      // Dry-run mode: return a data URL metadata for local preview
      const meta = {
        name,
        description,
        image: imageBase64 || ""
      };
      return new Response(JSON.stringify({ dryRun: true, tokenUri: `data:application/json,${encodeURIComponent(JSON.stringify(meta))}`, meta }), { status: 200 });
    }

    const client = new Web3Storage({ token });
    const files: File[] = [];

    let imageRef = "";
    if (imageBase64) {
      const [prefix, b64] = imageBase64.split(",");
      const buff = Buffer.from(b64, "base64");
      const imgName = `image-${Date.now()}.png`;
      files.push(new File([buff], imgName));
      const imgCid = await client.put(files, { wrapWithDirectory: false });
      imageRef = `ipfs://${imgCid}`;
    }

    const metadata = {
      name,
      description,
      image: imageRef
    };
    const metaBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const metaCid = await client.put([new File([metaBlob], "metadata.json")], { wrapWithDirectory: false });
    const tokenUri = `ipfs://${metaCid}`;

    return new Response(JSON.stringify({ dryRun: false, tokenUri, metadata }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Upload failed" }), { status: 500 });
  }
}
