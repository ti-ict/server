import { z } from "zod";

export const sshPublicKeySchema = z.string().refine(
  (key) => {
    const parts = key.trim().split(/\s+/);
    if (parts.length < 2) return false;

    const [type, b64] = parts;

    const validTypes = [
      "ssh-ed25519",
      "ssh-rsa",
      "ssh-dss",
      "ecdsa-sha2-nistp256",
      "ecdsa-sha2-nistp384",
      "ecdsa-sha2-nistp521"
    ];

    if (!validTypes.includes(type)) return false;
    if (!/^[A-Za-z0-9+/]+=*$/.test(b64) || b64.length < 68) return false;

    return true;
  },
  { message: "Invalid SSH public key" }
);
